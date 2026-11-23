package com.nextlvlict.nextlvlict.controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.nextlvlict.nextlvlict.dto.AdminDTO;
import com.nextlvlict.nextlvlict.hibernate.Admin_Users;
import com.nextlvlict.nextlvlict.hibernate.HibernateUtil;
import com.nextlvlict.nextlvlict.util.AdminAuthTokenStore;
import com.nextlvlict.nextlvlict.util.AuditLogger;
import com.nextlvlict.nextlvlict.util.LoginAttemptTracker;
import com.nextlvlict.nextlvlict.util.PasswordUtil;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.query.Query;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "AdminLogin", urlPatterns = {"/AdminLogin"})
public class AdminLogin extends HttpServlet {

    private SessionFactory sessionFactory;

    @Override
    public void init() throws ServletException {
        sessionFactory = HibernateUtil.getSessionFactory();
    }

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        PrintWriter out = response.getWriter();
        Gson gson = new Gson();
        
        try {
            String username = request.getParameter("username");
            String password = request.getParameter("password");
            
            if (username == null || password == null || username.isEmpty() || password.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print(gson.toJson(new ResponseMessage("error", "Username and password are required")));
                return;
            }

            // Rate limiting check by IP address
            String ipAddress = request.getRemoteAddr();
            if (LoginAttemptTracker.isRateLimited(ipAddress)) {
                long resetTime = LoginAttemptTracker.getRateLimitResetTime(ipAddress);
                response.setStatus(429); // HTTP 429 Too Many Requests
                out.print(gson.toJson(new ResponseMessage("error", "Too many login attempts. Please try again in " + resetTime + " seconds.")));
                return;
            }

            // Check if account is locked out
            if (LoginAttemptTracker.isLockedOut(username)) {
                long remainingTime = LoginAttemptTracker.getRemainingLockoutTime(username);
                AuditLogger.logAccountLockout(request, username, "ADMIN");
                response.setStatus(423); // HTTP 423 Locked
                out.print(gson.toJson(new ResponseMessage("error", "Account temporarily locked due to too many failed attempts. Please try again in " + remainingTime + " seconds.")));
                return;
            }
            
            Session session = sessionFactory.openSession();
            try {
                // Using JPA Criteria API to find admin by username (not password)
                CriteriaBuilder cb = session.getCriteriaBuilder();
                CriteriaQuery<Admin_Users> cq = cb.createQuery(Admin_Users.class);
                Root<Admin_Users> root = cq.from(Admin_Users.class);

                cq.where(
                    cb.and(
                        cb.equal(root.get("username"), username),
                        cb.equal(root.get("is_active"), 1)
                    )
                );

                Query<Admin_Users> query = session.createQuery(cq);
                Admin_Users admin = query.uniqueResult();

                if (admin == null) {
                    // Record failed attempt for rate limiting
                    LoginAttemptTracker.recordFailedAttempt(username);
                    AuditLogger.logLoginFailure(request, username, "ADMIN", "Invalid username");
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    out.print(gson.toJson(new ResponseMessage("error", "Invalid credentials")));
                    return;
                }

                // Verify password using BCrypt with migration support
                if (!PasswordUtil.verifyPassword(password, admin.getPassword())) {
                    // Record failed attempt and check for lockout
                    boolean shouldLockout = LoginAttemptTracker.recordFailedAttempt(username);
                    AuditLogger.logLoginFailure(request, username, "ADMIN", "Invalid password");
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    if (shouldLockout) {
                        out.print(gson.toJson(new ResponseMessage("error", "Invalid credentials. Account temporarily locked due to too many failed attempts.")));
                    } else {
                        out.print(gson.toJson(new ResponseMessage("error", "Invalid credentials")));
                    }
                    return;
                }

                // Migrate plain text password to BCrypt if needed
                if (PasswordUtil.needsMigration(admin.getPassword())) {
                    Transaction transaction = null;
                    try {
                        transaction = session.beginTransaction();
                        String hashedPassword = PasswordUtil.migratePassword(password);
                        admin.setPassword(hashedPassword);
                        session.update(admin);
                        transaction.commit();
                        System.out.println("Password migrated to BCrypt for admin: " + admin.getUsername());
                    } catch (Exception e) {
                        if (transaction != null) {
                            transaction.rollback();
                        }
                        System.err.println("Failed to migrate password for admin: " + admin.getUsername());
                        e.printStackTrace();
                        // Continue with login even if migration fails
                    }
                }

                // Reset failed login attempts on successful login
                LoginAttemptTracker.resetAttempts(username);

                // Log successful login
                AuditLogger.logLoginSuccess(request, admin.getUsername(), "ADMIN");

                // Issue auth token (X-Auth-Token)
                String authToken = AdminAuthTokenStore.issueToken(
                        (long) admin.getId(),
                        admin.getUsername(),
                        admin.getEmail()
                );

                // Generate session ID (X-Session-Id) - UUID independent of HttpSession
                String sessionId = java.util.UUID.randomUUID().toString();

                // Create DTO for secure response (excludes password and sensitive data)
                AdminDTO adminDTO = new AdminDTO();
                adminDTO.setId(admin.getId());
                adminDTO.setUsername(admin.getUsername());
                adminDTO.setEmail(admin.getEmail());
                adminDTO.setIsActive(admin.getIs_active());
                adminDTO.setCreatedAt(admin.getCreated_at());

                JsonObject responseBody = new JsonObject();
                responseBody.addProperty("status", "success");
                responseBody.addProperty("message", "Login successful");
                responseBody.addProperty("sessionId", sessionId);
                responseBody.addProperty("authToken", authToken);
                responseBody.add("admin", new Gson().toJsonTree(adminDTO));

                response.setStatus(HttpServletResponse.SC_OK);
                response.setHeader("X-Session-Id", sessionId);
                response.setHeader("X-Auth-Token", authToken);
                out.print(responseBody);
            } finally {
                session.close();
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(new ResponseMessage("error", "Server error: " + e.getMessage())));
        } finally {
            out.flush();
            out.close();
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    // Helper class for JSON response
    private class ResponseMessage {
        private String status;
        private String message;

        public ResponseMessage(String status, String message) {
            this.status = status;
            this.message = message;
        }

        public String getStatus() { return status; }
        public String getMessage() { return message; }
    }
}
