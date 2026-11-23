// PaymentVerificationServlet.java
package com.nextlvlict.nextlvlict.controller;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.nextlvlict.nextlvlict.hibernate.HibernateUtil;
import com.nextlvlict.nextlvlict.hibernate.PaymentTransactions;
import com.nextlvlict.nextlvlict.hibernate.StudentMonthlyFees;
import com.nextlvlict.nextlvlict.hibernate.PaymentStatus;
import com.nextlvlict.nextlvlict.util.AdminAuthTokenStore;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.hibernate.Transaction;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@WebServlet(name = "PaymentVerificationServlet", urlPatterns = {"/PaymentVerificationServlet"})
public class PaymentVerificationServlet extends HttpServlet {

    private static final int ADMIN_SESSION_TIMEOUT_SECONDS = 120 * 60;

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json;charset=UTF-8");
        response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
        response.setHeader("Access-Control-Allow-Credentials", "true");
        
        PrintWriter out = response.getWriter();
        JsonObject jsonResponse = new JsonObject();

        AdminAuthTokenStore.AuthData authData = ensureAdminAuth(request);
        if (authData == null) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Not logged in");
            out.print(jsonResponse.toString());
            return;
        }

        try (Session session = HibernateUtil.getSessionFactory().openSession()) {

            // Get payment verification status parameter (optional)
            String statusFilter = request.getParameter("status");
            String studentIdFilter = request.getParameter("studentId");

            // Build query based on filters
            String hql = "SELECT pt FROM PaymentTransactions pt JOIN pt.student s WHERE 1=1";

            // If no explicit status provided, default to showing completed payments only
            boolean useStatusParam = false;
            if (statusFilter == null || statusFilter.isEmpty()) {
                hql += " AND pt.verificationStatus = :status";
                statusFilter = "completed"; // default
                useStatusParam = true;
            } else if (!"all".equalsIgnoreCase(statusFilter)) {
                // Use the provided status filter (e.g. 'pending','completed','rejected')
                hql += " AND pt.verificationStatus = :status";
                useStatusParam = true;
            }

            if (studentIdFilter != null && !studentIdFilter.isEmpty()) {
                hql += " AND s.id = :studentId";
            }

            hql += " ORDER BY pt.createdAt DESC";

            Query<PaymentTransactions> query = session.createQuery(hql, PaymentTransactions.class);

            if (useStatusParam) {
                query.setParameter("status", statusFilter);
            }
            if (studentIdFilter != null && !studentIdFilter.isEmpty()) {
                query.setParameter("studentId", studentIdFilter);
            }

            List<PaymentTransactions> payments = query.getResultList();

            JsonArray paymentsArray = new JsonArray();
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

            for (PaymentTransactions payment : payments) {
                JsonObject paymentJson = new JsonObject();
                paymentJson.addProperty("id", payment.getId());
                paymentJson.addProperty("transactionId", payment.getTransactionId());
                paymentJson.addProperty("studentId", payment.getStudent().getId());
                paymentJson.addProperty("studentName", payment.getStudent().getFirst_name() + " " + payment.getStudent().getLast_name());
                paymentJson.addProperty("amount", payment.getAmount());
                paymentJson.addProperty("currency", payment.getCurrency());
                paymentJson.addProperty("paymentMethod", payment.getPaymentMethod());
                paymentJson.addProperty("description", payment.getDescription());
                if (payment.getCreatedAt() != null) {
                    paymentJson.addProperty("createdAt", dateFormat.format(payment.getCreatedAt()));
                } else {
                    paymentJson.addProperty("createdAt", "");
                }

                // Use the verificationStatus field from the entity
                paymentJson.addProperty("verificationStatus", payment.getVerificationStatus() != null ? payment.getVerificationStatus() : "pending");
                paymentJson.addProperty("paymentMethod", payment.getPaymentMethod());
                paymentJson.addProperty("monthYear", getMonthYearFromDescription(payment.getDescription()));

                // Include verification metadata
                paymentJson.addProperty("verifiedBy", payment.getVerifiedBy() != null ? payment.getVerifiedBy() : "");
                if (payment.getVerificationDate() != null) {
                    paymentJson.addProperty("verificationDate", dateFormat.format(payment.getVerificationDate()));
                } else {
                    paymentJson.addProperty("verificationDate", "");
                }
                paymentJson.addProperty("verificationNotes", payment.getVerificationNotes() != null ? payment.getVerificationNotes() : "");

                paymentsArray.add(paymentJson);
            }

            jsonResponse.addProperty("success", true);
            jsonResponse.add("payments", paymentsArray);

        } catch (Exception e) {
            e.printStackTrace();
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error fetching payment verifications: " + e.getMessage());
        }
        out.print(jsonResponse.toString());
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json;charset=UTF-8");
        response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
        response.setHeader("Access-Control-Allow-Credentials", "true");
        
        PrintWriter out = response.getWriter();
        JsonObject jsonResponse = new JsonObject();

        AdminAuthTokenStore.AuthData authData = ensureAdminAuth(request);
        if (authData == null) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Not logged in");
            out.print(jsonResponse.toString());
            return;
        }

        String action = request.getParameter("action");
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            Transaction tx = session.beginTransaction();

            if ("verify".equals(action)) {
                String paymentId = request.getParameter("paymentId");
                String notes = request.getParameter("notes");
                
                // Get payment transaction
                PaymentTransactions payment = session.get(PaymentTransactions.class, Long.parseLong(paymentId));
                if (payment != null) {
                    // Update verification details
                    payment.setVerificationStatus("verified");
                    payment.setVerifiedBy(authData.getAdminUsername());
                    payment.setVerificationDate(new Date());
                    payment.setVerificationNotes(notes != null ? notes : "");
                    session.merge(payment);

                    // Also update the related monthly fee if applicable
                    StudentMonthlyFees monthlyFee = null;
                    if (payment.getTransactionId() != null) {
                        try {
                            @SuppressWarnings("unchecked")
                            Object result = session.createQuery(
                                    "FROM StudentMonthlyFees WHERE transactionId = :txnId")
                                    .setParameter("txnId", payment.getTransactionId())
                                    .uniqueResult();
                            monthlyFee = (StudentMonthlyFees) result;
                        } catch (Exception e) {
                            // continue if not found
                        }
                    }

                    tx.commit();
                    
                    jsonResponse.addProperty("success", true);
                    jsonResponse.addProperty("message", "Payment verified successfully");
                    System.out.println("✅ Payment " + paymentId + " verified by admin");
                } else {
                    jsonResponse.addProperty("success", false);
                    jsonResponse.addProperty("message", "Payment not found");
                }
                
            } else if ("reject".equals(action)) {
                String paymentId = request.getParameter("paymentId");
                String reason = request.getParameter("reason");
                
                // Get payment transaction
                PaymentTransactions payment = session.get(PaymentTransactions.class, Long.parseLong(paymentId));
                if (payment != null) {
                    // Update rejection details
                    payment.setVerificationStatus("rejected");
                    payment.setVerifiedBy(authData.getAdminUsername());
                    payment.setVerificationDate(new Date());
                    payment.setVerificationNotes(reason != null ? reason : "");
                    session.merge(payment);

                    // Also reset the related monthly fee back to PENDING if applicable
                    if (payment.getTransactionId() != null) {
                        try {
                            @SuppressWarnings("unchecked")
                            Object result = session.createQuery(
                                    "FROM StudentMonthlyFees WHERE transactionId = :txnId")
                                    .setParameter("txnId", payment.getTransactionId())
                                    .uniqueResult();
                            StudentMonthlyFees monthlyFee = (StudentMonthlyFees) result;
                            if (monthlyFee != null && monthlyFee.getStatus().getId() == 2) {
                                // Reset status back to PENDING (1)
                                PaymentStatus pendingStatus = session.get(PaymentStatus.class, 1);
                                monthlyFee.setStatus(pendingStatus);
                                monthlyFee.setPaidDate(null);
                                monthlyFee.setUpdatedAt(new Date());
                                session.update(monthlyFee);
                            }
                        } catch (Exception e) {
                            // continue if not found
                        }
                    }

                    tx.commit();
                    
                    jsonResponse.addProperty("success", true);
                    jsonResponse.addProperty("message", "Payment rejected successfully");
                    System.out.println("✅ Payment " + paymentId + " rejected by admin: " + reason);
                } else {
                    jsonResponse.addProperty("success", false);
                    jsonResponse.addProperty("message", "Payment not found");
                }
                
            } else {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Unknown action");
            }
        } catch (Exception e) {
            e.printStackTrace();
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error processing request: " + e.getMessage());
        }
        out.print(jsonResponse.toString());
    }
    
    private String getMonthYearFromDescription(String description) {
        if (description == null || description.isEmpty()) {
            return "N/A";
        }
        // Extract month/year from description if it contains it
        // Example: "Class fee for January 2024"
        // You can implement your own logic based on your description format
        return "N/A";
    }

    private AdminAuthTokenStore.AuthData ensureAdminAuth(HttpServletRequest request) {
        String authToken = extractAuthToken(request);
        if (authToken == null) {
            return null;
        }

        AdminAuthTokenStore.AuthData authData = AdminAuthTokenStore.validate(authToken);
        if (authData == null) {
            return null;
        }

        return authData;
    }

    private String extractAuthToken(HttpServletRequest request) {
        String headerToken = trimToNull(request.getHeader("X-Auth-Token"));
        if (headerToken != null) {
            return headerToken;
        }

        String adminToken = trimToNull(request.getHeader("X-Admin-Token"));
        if (adminToken != null) {
            return adminToken;
        }

        String authorization = trimToNull(request.getHeader("Authorization"));
        if (authorization != null) {
            if (authorization.regionMatches(true, 0, "Bearer ", 0, 7)) {
                return trimToNull(authorization.substring(7));
            }
            return authorization;
        }

        String requestToken = trimToNull(request.getParameter("authToken"));
        if (requestToken != null) {
            return requestToken;
        }

        return trimToNull(request.getParameter("sessionId"));
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
