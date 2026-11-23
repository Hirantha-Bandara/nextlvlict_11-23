package com.nextlvlict.nextlvlict.controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.nextlvlict.nextlvlict.dto.StudentDTO;
import com.nextlvlict.nextlvlict.hibernate.HibernateUtil;
import com.nextlvlict.nextlvlict.hibernate.Students;
import com.nextlvlict.nextlvlict.util.AuditLogger;
import com.nextlvlict.nextlvlict.util.LoginAttemptTracker;
import com.nextlvlict.nextlvlict.util.PasswordUtil;
import com.nextlvlict.nextlvlict.util.PasswordValidator;
import org.hibernate.Session;
import org.hibernate.Transaction;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "LoginServlet", urlPatterns = {"/LoginServlet"})
public class LoginServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        JsonObject jsonResponse = new JsonObject();

        Session session = null;
        HttpSession httpSession = null;

        try {
            // Parse JSON request
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = request.getReader().readLine()) != null) {
                sb.append(line);
            }
            String requestBody = sb.toString();

            Gson gson = new Gson();
            JsonObject loginData = gson.fromJson(requestBody, JsonObject.class);

            // Changed from studentId to mobile
            String mobile = loginData.has("mobile") ? loginData.get("mobile").getAsString() : "";
            String password = loginData.has("password") ? loginData.get("password").getAsString() : "";

            // Validate required fields - updated message
            if (mobile.isEmpty() || password.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Mobile number and password are required");
                out.print(jsonResponse.toString());
                return;
            }

            // Rate limiting check by IP address
            String ipAddress = request.getRemoteAddr();
            if (LoginAttemptTracker.isRateLimited(ipAddress)) {
                long resetTime = LoginAttemptTracker.getRateLimitResetTime(ipAddress);
                response.setStatus(429); // HTTP 429 Too Many Requests
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Too many login attempts. Please try again in " + resetTime + " seconds.");
                out.print(jsonResponse.toString());
                return;
            }

            // Check if account is locked out
            if (LoginAttemptTracker.isLockedOut(mobile)) {
                long remainingTime = LoginAttemptTracker.getRemainingLockoutTime(mobile);
                AuditLogger.logAccountLockout(request, mobile, "STUDENT");
                response.setStatus(423); // HTTP 423 Locked
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Account temporarily locked due to too many failed attempts. Please try again in " + remainingTime + " seconds.");
                out.print(jsonResponse.toString());
                return;
            }

            session = HibernateUtil.getSessionFactory().openSession();

            // Changed query to use mobile number instead of student ID
            String checkStudentHql = "FROM Students WHERE mobile = :mobile";
            Students student = (Students) session.createQuery(checkStudentHql)
                    .setParameter("mobile", mobile)
                    .uniqueResult();

            if (student == null) {
                // Record failed attempt for rate limiting
                LoginAttemptTracker.recordFailedAttempt(mobile);
                AuditLogger.logLoginFailure(request, mobile, "STUDENT", "Invalid mobile number");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Invalid mobile number");
                out.print(jsonResponse.toString());
                return;
            }

            // Check if account is active
            if (student.getIs_active() != 1) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Account is inactive. Please contact administration.");
                out.print(jsonResponse.toString());
                return;
            }

            // Verify password using BCrypt with migration support
            if (!PasswordUtil.verifyPassword(password, student.getPassword())) {
                // Record failed attempt and check for lockout
                boolean shouldLockout = LoginAttemptTracker.recordFailedAttempt(mobile);
                AuditLogger.logLoginFailure(request, mobile, "STUDENT", "Invalid password");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                jsonResponse.addProperty("success", false);
                if (shouldLockout) {
                    jsonResponse.addProperty("message", "Invalid password. Account temporarily locked due to too many failed attempts.");
                } else {
                    jsonResponse.addProperty("message", "Invalid password");
                }
                out.print(jsonResponse.toString());
                return;
            }

            // Migrate plain text password to BCrypt if needed
            if (PasswordUtil.needsMigration(student.getPassword())) {
                Transaction transaction = null;
                try {
                    transaction = session.beginTransaction();
                    String hashedPassword = PasswordUtil.migratePassword(password);
                    student.setPassword(hashedPassword);
                    session.update(student);
                    transaction.commit();
                    System.out.println("Password migrated to BCrypt for student: " + student.getId());
                } catch (Exception e) {
                    if (transaction != null) {
                        transaction.rollback();
                    }
                    System.err.println("Failed to migrate password for student: " + student.getId());
                    e.printStackTrace();
                    // Continue with login even if migration fails
                }
            }

            // Login successful - CREATE SESSION AND SET ATTRIBUTE
            httpSession = request.getSession();
            httpSession.setAttribute("studentId", student.getId());
            httpSession.setAttribute("mobile", student.getMobile());
            httpSession.setMaxInactiveInterval(120 * 60); // 120 minutes (2 hours)

            // Reset failed login attempts on successful login
            LoginAttemptTracker.resetAttempts(mobile);

            // Log successful login
            AuditLogger.logLoginSuccess(request, student.getId(), "STUDENT");

            // Debug: print session info
            System.out.println("=== LOGIN SUCCESS ===");
            System.out.println("Student ID: " + student.getId());
            System.out.println("Mobile: " + student.getMobile());
            System.out.println("Session ID: " + httpSession.getId());
            System.out.println("=== END LOGIN SUCCESS ===");

            // Create DTO for secure response (excludes password and sensitive data)
            StudentDTO studentDTO = new StudentDTO();
            studentDTO.setId(student.getId());
            studentDTO.setFirstName(student.getFirst_name());
            studentDTO.setLastName(student.getLast_name());
            studentDTO.setEmail(student.getEmail());
            studentDTO.setMobile(student.getMobile());
            studentDTO.setIsActive(student.getIs_active());
            studentDTO.setCreatedAt(student.getCreated_at());
            
            if (student.getGrade() != null) {
                studentDTO.setGradeId(String.valueOf(student.getGrade().getId()));
                studentDTO.setGradeName(student.getGrade().getName());
            }

            jsonResponse.addProperty("success", true);
            jsonResponse.addProperty("message", "Login successful");
            jsonResponse.add("student", new Gson().toJsonTree(studentDTO));

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Login failed due to server error");
        } finally {
            if (session != null && session.isOpen()) {
                session.close();
            }
            out.print(jsonResponse.toString());
            out.flush();
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        JsonObject jsonResponse = new JsonObject();
        jsonResponse.addProperty("success", false);
        jsonResponse.addProperty("message", "GET method not supported, use POST");

        response.setStatus(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
        out.print(jsonResponse.toString());
        out.flush();
    }
}

