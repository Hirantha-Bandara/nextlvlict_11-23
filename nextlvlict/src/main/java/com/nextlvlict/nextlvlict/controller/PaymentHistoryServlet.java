package com.nextlvlict.nextlvlict.controller;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.nextlvlict.nextlvlict.hibernate.HibernateUtil;
import com.nextlvlict.nextlvlict.hibernate.PaymentTransactions;
import org.hibernate.Session;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.List;

@WebServlet(name = "PaymentHistoryServlet", urlPatterns = {"/PaymentHistoryServlet"})
public class PaymentHistoryServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json;charset=UTF-8");

        PrintWriter out = response.getWriter();
        JsonObject jsonResponse = new JsonObject();

        Session session = null;
        try {
            // Get studentId from session or request parameter
            String studentId = getStudentId(request);
            if (studentId == null) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Not logged in");
                out.print(jsonResponse.toString());
                return;
            }

            session = HibernateUtil.getSessionFactory().openSession();

            // Get payment history with proper HQL query
            @SuppressWarnings("unchecked")
            List<PaymentTransactions> payments = session.createQuery(
                    "FROM PaymentTransactions pt WHERE pt.student.id = :studentId ORDER BY pt.createdAt DESC")
                    .setParameter("studentId", studentId)
                    .list();

            JsonArray paymentsArray = new JsonArray();
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

            for (PaymentTransactions payment : payments) {
                JsonObject paymentJson = new JsonObject();

                // Basic payment information
                paymentJson.addProperty("id", payment.getId());
                paymentJson.addProperty("transactionId", payment.getTransactionId());
                paymentJson.addProperty("amount", payment.getAmount());
                paymentJson.addProperty("currency", payment.getCurrency());
                paymentJson.addProperty("paymentMethod", payment.getPaymentMethod());
                paymentJson.addProperty("description", payment.getDescription() != null ? payment.getDescription() : "");

                // Timestamp fields - handle null dates
                if (payment.getCreatedAt() != null) {
                    paymentJson.addProperty("createdAt", dateFormat.format(payment.getCreatedAt()));
                } else {
                    paymentJson.addProperty("createdAt", "");
                }

                if (payment.getUpdatedAt() != null) {
                    paymentJson.addProperty("updatedAt", dateFormat.format(payment.getUpdatedAt()));
                } else {
                    paymentJson.addProperty("updatedAt", "");
                }

                // Verification fields
                paymentJson.addProperty("verificationStatus", payment.getVerificationStatus() != null ? payment.getVerificationStatus() : "pending");
                paymentJson.addProperty("verifiedBy", payment.getVerifiedBy() != null ? payment.getVerifiedBy() : "");

                if (payment.getVerificationDate() != null) {
                    paymentJson.addProperty("verificationDate", dateFormat.format(payment.getVerificationDate()));
                } else {
                    paymentJson.addProperty("verificationDate", "");
                }

                paymentJson.addProperty("verificationNotes", payment.getVerificationNotes() != null ? payment.getVerificationNotes() : "");

                // Student information
                if (payment.getStudent() != null) {
                    paymentJson.addProperty("studentName",
                            payment.getStudent().getFirst_name() + " " + payment.getStudent().getLast_name());
                    paymentJson.addProperty("studentEmail", payment.getStudent().getEmail() != null ? payment.getStudent().getEmail() : "");
                    paymentJson.addProperty("studentMobile", payment.getStudent().getMobile() != null ? payment.getStudent().getMobile() : "");
                }

                paymentsArray.add(paymentJson);
            }

            jsonResponse.addProperty("success", true);
            jsonResponse.addProperty("totalPayments", paymentsArray.size());
            jsonResponse.add("payments", paymentsArray);

        } catch (Exception e) {
            e.printStackTrace();
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error fetching payment history: " + e.getMessage());
        } finally {
            if (session != null && session.isOpen()) {
                session.close();
            }
            out.print(jsonResponse.toString());
        }
    }

    private String getStudentId(HttpServletRequest request) {
        HttpSession httpSession = request.getSession(false);
        if (httpSession != null) {
            String sessionStudentId = (String) httpSession.getAttribute("studentId");
            if (sessionStudentId != null) {
                return sessionStudentId;
            }
        }

        String paramStudentId = request.getParameter("studentId");
        if (paramStudentId != null && !paramStudentId.trim().isEmpty()) {
            return paramStudentId.trim();
        }

        return null;
    }
}
