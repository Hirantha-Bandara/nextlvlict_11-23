package com.nextlvlict.nextlvlict.controller;

import com.google.gson.JsonObject;
import com.nextlvlict.nextlvlict.hibernate.*;
import com.nextlvlict.nextlvlict.model.PayHere;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.query.Query;
import com.nextlvlict.nextlvlict.util.PayHereConfig;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.DecimalFormat;
import java.util.Date;

@WebServlet(name = "TutesPaymentServlet", urlPatterns = {"/TutesPaymentServlet"})
public class TutesPaymentServlet extends HttpServlet {

    private PayHereConfig payhereConfig;
    
    @Override
    public void init() {
        payhereConfig = PayHereConfig.getInstance();
        payhereConfig.logConfig();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json;charset=UTF-8");
        response.setHeader("ngrok-skip-browser-warning", "true");

        PrintWriter out = response.getWriter();
        JsonObject jsonResponse = new JsonObject();
        boolean writeJsonResponse = true;

        Session session = null;
        try {
            String action = request.getParameter("action");
            System.out.println("TutesPaymentServlet action: " + action);

            // ✅ CRITICAL FIX: Handle paymentNotify WITHOUT login check
            if ("paymentNotify".equals(action)) {
                response.setContentType("text/plain;charset=UTF-8");
                session = HibernateUtil.getSessionFactory().openSession();
                handlePaymentNotify(session, request, response);
                return;  // Important: exit here
            }

            // For all other actions, check login
            String studentId = getStudentId(request);
            if (studentId == null) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Not logged in");
                jsonResponse.addProperty("errorCode", "NOT_LOGGED_IN");
                out.print(jsonResponse.toString());
                return;
            }

            session = HibernateUtil.getSessionFactory().openSession();

            if ("initiatePayment".equals(action)) {
                handleInitiatePayment(session, studentId, request, jsonResponse);
            } else if ("paymentReturn".equals(action)) {
                // Handle payment completion as fallback if notify wasn't called
                String orderId = request.getParameter("order_id");
                System.out.println("=== TUTE PAYMENT RETURN HANDLER CALLED ===");
                System.out.println("Student ID: " + studentId);
                System.out.println("Order ID: " + orderId);
                if (orderId != null && !orderId.trim().isEmpty()) {
                    handlePaymentCompletionFallback(session, studentId, orderId);
                } else {
                    System.out.println("WARNING: order_id is null or empty in paymentReturn");
                }
                jsonResponse.addProperty("success", true);
                jsonResponse.addProperty("message", "Payment completed successfully");
            } else if ("paymentCancel".equals(action)) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Payment was cancelled");
            } else {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Invalid action parameter");
            }
        } catch (Exception e) {
            System.err.println("Error in TutesPaymentServlet: " + e.getMessage());
            e.printStackTrace();
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error: " + e.getMessage());
        } finally {
            if (session != null && session.isOpen()) {
                session.close();
            }
            if (writeJsonResponse) {
                out.print(jsonResponse);
            }
            out.flush();
        }
    }

    private void handleInitiatePayment(Session session, String studentId, HttpServletRequest request, JsonObject jsonResponse) throws Exception {
        int tuteId = Integer.parseInt(request.getParameter("tuteId"));

        try {
            // Get student and tute details
            Students student = session.get(Students.class, studentId);
            Tutes tute = session.get(Tutes.class, tuteId);

            if (student == null || tute == null) {
                throw new Exception("Student or Tute not found");
            }

            // Check if request already exists
            Tutes_Request existingRequest = (Tutes_Request) session.createQuery(
                    "FROM Tutes_Request WHERE student.id = :studentId AND tutes.id = :tuteId")
                    .setParameter("studentId", studentId)
                    .setParameter("tuteId", tuteId)
                    .uniqueResult();

            if (existingRequest != null) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "You already have a purchase request for this tute");
                jsonResponse.addProperty("errorCode", "PURCHASE_REQUEST_EXISTS");
                return;
            }

            double amount = tute.getPrice();

            // Generate order ID with embedded identifiers so callback processing can recover them
            String orderId = "TUTE_" + studentId + "_" + tuteId + "_" + System.currentTimeMillis();

            // Format amount correctly
            String formattedAmount = new DecimalFormat("0.00").format(amount);

            // Get base URL
            String baseUrl = getBaseUrl();
            System.out.println("Base URL: " + baseUrl);

            // Get credentials from config
            String merchantId = payhereConfig.getMerchantId();
            String merchantSecret = payhereConfig.getMerchantSecret();
            
            // Calculate hash for PayHere using the same format as the class fee flow
            String merchantSecretMd5 = PayHere.generateMD5UpperCase(merchantSecret);
            String hashString = merchantId + orderId + formattedAmount + "LKR" + merchantSecretMd5;
            String hash = PayHere.generateMD5UpperCase(hashString);

            // Create payment data
            JsonObject paymentData = new JsonObject();
            paymentData.addProperty("sandbox", payhereConfig.isSandbox());
            paymentData.addProperty("checkout_url", payhereConfig.getCheckoutUrl());
            paymentData.addProperty("merchant_id", merchantId);
            paymentData.addProperty("return_url", "https://nextlvlict.com/dashboard?action=paymentReturn&studentId=" + studentId + "&order_id=" + orderId);
            paymentData.addProperty("cancel_url", "https://nextlvlict.com/dashboard?action=paymentCancel&studentId=" + studentId);
            paymentData.addProperty("notify_url", baseUrl + "/TutesPaymentServlet?action=paymentNotify");

            paymentData.addProperty("order_id", orderId);
            paymentData.addProperty("items", "Tute Purchase - " + tute.getTitle());
            paymentData.addProperty("amount", formattedAmount);
            paymentData.addProperty("currency", "LKR");
            paymentData.addProperty("hash", hash);

            paymentData.addProperty("first_name", student.getFirst_name());
            paymentData.addProperty("last_name", student.getLast_name());
            paymentData.addProperty("email", student.getEmail() != null ? student.getEmail() : "student@example.com");
            paymentData.addProperty("phone", student.getMobile() != null ? student.getMobile() : "0770000000");
            paymentData.addProperty("address", "Colombo");
            paymentData.addProperty("city", "Colombo");
            paymentData.addProperty("country", "Sri Lanka");

            // Custom parameters
            paymentData.addProperty("custom_1", studentId);
            paymentData.addProperty("custom_2", String.valueOf(tuteId));
            paymentData.addProperty("custom_3", orderId);

            jsonResponse.addProperty("success", true);
            jsonResponse.add("paymentData", paymentData);

            System.out.println("=== TUTE PAYMENT HASH CALCULATION ===");
            System.out.println("Merchant ID: " + merchantId);
            System.out.println("Order ID: " + orderId);
            System.out.println("Amount: " + formattedAmount);
            System.out.println("Currency: LKR");
            System.out.println("Final Hash (UPPERCASE): " + hash);

            System.out.println("Payment data sent to frontend:");
            System.out.println(paymentData.toString());

        } finally {
            // Session is closed in the finally block of doPost
        }
    }

    private void handlePaymentNotify(Session session, HttpServletRequest request, HttpServletResponse response) throws Exception {
        PrintWriter out = response.getWriter();
        response.setHeader("ngrok-skip-browser-warning", "true");

        // Get parameters from PayHere
        String merchantId = request.getParameter("merchant_id");
        String orderId = request.getParameter("order_id");
        String paymentStatus = request.getParameter("status_code");
        String payhereAmount = request.getParameter("payhere_amount");
        String payhereCurrency = request.getParameter("payhere_currency");
        String md5sig = request.getParameter("md5sig");
        String customStudentId = request.getParameter("custom_1");
        String customTuteId = request.getParameter("custom_2");

        // PayHere may omit custom fields on server-to-server callbacks, so recover from order_id when needed
        if (isBlank(customStudentId) || isBlank(customTuteId)) {
            String[] parsed = parseOrderId(orderId);
            if (isBlank(customStudentId)) {
                customStudentId = parsed[0];
            }
            if (isBlank(customTuteId)) {
                customTuteId = parsed[1];
            }
        }

        System.out.println("=== TUTE PAYMENT NOTIFICATION ===");
        System.out.println("Merchant ID: " + merchantId);
        System.out.println("Order ID: " + orderId);
        System.out.println("Status: " + paymentStatus);
        System.out.println("Amount: " + payhereAmount);
        System.out.println("Currency: " + payhereCurrency);
        System.out.println("MD5 Sig: " + md5sig);
        System.out.println("Student ID: " + customStudentId);
        System.out.println("Tute ID: " + customTuteId);

        // If payment status indicates success (2)
        if ("2".equals(paymentStatus)) {

            // Validate MD5 signature if provided (PayHere will send md5sig)
            if (md5sig != null && !md5sig.isEmpty()) {
                String merchantSecret = payhereConfig.getMerchantSecret();
                String md5Secret = PayHere.generateMD5UpperCase(merchantSecret);
                String expectedMd5 = PayHere.generateMD5UpperCase(
                        merchantId + orderId + payhereAmount + (payhereCurrency != null ? payhereCurrency : "LKR") + paymentStatus + md5Secret
                );

                System.out.println("Expected MD5: " + expectedMd5);
                System.out.println("Received MD5: " + md5sig);

                if (!expectedMd5.equals(md5sig)) {
                    System.err.println("❌ MD5 signature validation FAILED for tute payment. Possible tampering.");
                    // Respond OK to avoid retries (but do not process)
                    out.print("OK");
                    return;
                }
            }

            Transaction tx = session.beginTransaction();

            try {
                // Check idempotency: has this transactionId already been recorded?
                Query<PaymentTransactions> existingTxnQuery = session.createQuery(
                        "FROM PaymentTransactions WHERE transactionId = :txnId", PaymentTransactions.class);
                PaymentTransactions existingTxn = existingTxnQuery
                        .setParameter("txnId", orderId)
                        .uniqueResult();

                if (existingTxn != null) {
                    System.out.println("⚠️ Tute payment already processed for order: " + orderId);
                    tx.commit();
                    out.print("OK");
                    return;
                }

                // Get student and tute
                Students student = session.get(Students.class, customStudentId);
                Tutes tute = session.get(Tutes.class, Integer.parseInt(customTuteId));

                if (student != null && tute != null) {
                    // Create payment transaction record first (ensure payment is recorded)
                    PaymentTransactions paymentTransaction = new PaymentTransactions();
                    double receivedAmount = 0.0;
                    try {
                        receivedAmount = Double.parseDouble(payhereAmount);
                    } catch (Exception ex) {
                        System.err.println("Error parsing payhere_amount: " + ex.getMessage());
                    }

                    paymentTransaction.setStudent(student);
                    paymentTransaction.setAmount(receivedAmount);
                    paymentTransaction.setCurrency(payhereCurrency != null ? payhereCurrency : "LKR");
                    paymentTransaction.setPaymentMethod("PayHere");
                    paymentTransaction.setTransactionId(orderId);
                    paymentTransaction.setDescription("Tute purchase - " + tute.getTitle());
                    paymentTransaction.setCreatedAt(new Date());
                    paymentTransaction.setUpdatedAt(new Date());
                    paymentTransaction.setVerificationStatus("completed");

                    // Auto-verify PayHere tute payments (no admin verification needed)
                    paymentTransaction.setVerifiedBy("PAYHERE_SYSTEM");
                    paymentTransaction.setVerificationDate(new Date());
                    paymentTransaction.setVerificationNotes("Auto-verified by PayHere callback - Tute purchase");

                    session.save(paymentTransaction);

                    // Only create request if it doesn't already exist and payment has been recorded
                    Query<Tutes_Request> existingRequestQuery = session.createQuery(
                            "FROM Tutes_Request WHERE student.id = :studentId AND tutes.id = :tuteId", Tutes_Request.class);
                    Tutes_Request existingRequest = existingRequestQuery
                            .setParameter("studentId", customStudentId)
                            .setParameter("tuteId", Integer.parseInt(customTuteId))
                            .uniqueResult();

                    if (existingRequest == null) {
                        Tutes_Request tuteRequest = new Tutes_Request();
                        TutesStatus pendingStatus = session.get(TutesStatus.class, 1); // 1 = Pending

                        tuteRequest.setStudent(student);
                        tuteRequest.setTutes(tute);
                        tuteRequest.setTuteStatus(pendingStatus);
                        tuteRequest.setRequest_date(new Date());

                        session.save(tuteRequest);
                        System.out.println("✅ Tute request created after successful payment for student: " + customStudentId + " tute: " + customTuteId);
                    } else {
                        System.out.println("⚠️ Tute request already exists for student: " + customStudentId + " tute: " + customTuteId);
                    }

                    tx.commit();

                    System.out.println("✅ Tute payment successfully recorded and (if new) request created");
                } else {
                    System.out.println("❌ Student or Tute not found");
                    if (tx != null) tx.rollback();
                }
            } catch (Exception e) {
                if (tx != null) {
                    tx.rollback();
                }
                System.out.println("❌ Error recording tute payment: " + e.getMessage());
                System.err.println("Tute payment notify error: " + e.getMessage());
            } finally {
                // Session is closed in the finally block of doPost
            }
        } else {
            System.out.println("❌ Tute payment failed with status: " + paymentStatus);
        }

        // Always respond OK to PayHere to avoid retries
        out.print("OK");
    }

    private String getBaseUrl() {
        String baseUrl = payhereConfig.getBaseUrl();
        if (baseUrl != null && baseUrl.endsWith("/")) {
            baseUrl = baseUrl.substring(0, baseUrl.length() - 1);
        }
        return baseUrl;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String[] parseOrderId(String orderId) {
        String[] result = new String[]{null, null};
        if (orderId == null || !orderId.startsWith("TUTE_")) {
            return result;
        }

        // Expected format: TUTE_<studentId>_<tuteId>_<timestamp>
        String[] parts = orderId.split("_");
        if (parts.length >= 4) {
            result[0] = parts[1];
            result[1] = parts[2];
        }
        return result;
    }

    private void handlePaymentCompletionFallback(Session session, String studentId, String orderId) {
        try {
            System.out.println("=== TUTE PAYMENT COMPLETION FALLBACK ===");
            System.out.println("Order ID: " + orderId);
            System.out.println("Student ID: " + studentId);

            // Parse order_id to get tuteId
            String[] parsed = parseOrderId(orderId);
            if (parsed[0] == null || parsed[1] == null) {
                System.err.println("❌ Could not parse order_id: " + orderId);
                return;
            }
            String tuteId = parsed[1];

            // Check idempotency: has this transactionId already been recorded?
            Query<PaymentTransactions> existingTxnQuery = session.createQuery(
                    "FROM PaymentTransactions WHERE transactionId = :txnId", PaymentTransactions.class);
            PaymentTransactions existingTxn = existingTxnQuery
                    .setParameter("txnId", orderId)
                    .uniqueResult();

            if (existingTxn != null) {
                System.out.println("⚠️ Tute payment already processed for order: " + orderId);
                return;
            }

            // Get student and tute
            Students student = session.get(Students.class, studentId);
            Tutes tute = session.get(Tutes.class, Integer.parseInt(tuteId));

            if (student == null || tute == null) {
                System.err.println("❌ Student or Tute not found for fallback");
                return;
            }

            System.out.println("✅ Found student and tute for fallback processing");

            Transaction tx = session.beginTransaction();
            try {
                // Create payment transaction record
                PaymentTransactions paymentTransaction = new PaymentTransactions();
                paymentTransaction.setStudent(student);
                paymentTransaction.setAmount(tute.getPrice());
                paymentTransaction.setCurrency("LKR");
                paymentTransaction.setPaymentMethod("PayHere");
                paymentTransaction.setTransactionId(orderId);
                paymentTransaction.setDescription("Tute purchase - " + tute.getTitle() + " (fallback completion)");
                paymentTransaction.setCreatedAt(new Date());
                paymentTransaction.setUpdatedAt(new Date());
                paymentTransaction.setVerificationStatus("completed");
                paymentTransaction.setVerifiedBy("PAYHERE_RETURN_FALLBACK");
                paymentTransaction.setVerificationDate(new Date());
                paymentTransaction.setVerificationNotes("Auto-verified by paymentReturn callback - Tute purchase (notify_url may have failed)");

                session.save(paymentTransaction);

                // Check if request already exists
                Query<Tutes_Request> existingRequestQuery = session.createQuery(
                        "FROM Tutes_Request WHERE student.id = :studentId AND tutes.id = :tuteId", Tutes_Request.class);
                Tutes_Request existingRequest = existingRequestQuery
                        .setParameter("studentId", studentId)
                        .setParameter("tuteId", Integer.parseInt(tuteId))
                        .uniqueResult();

                if (existingRequest == null) {
                    Tutes_Request tuteRequest = new Tutes_Request();
                    TutesStatus pendingStatus = session.get(TutesStatus.class, 1); // 1 = Pending

                    tuteRequest.setStudent(student);
                    tuteRequest.setTutes(tute);
                    tuteRequest.setTuteStatus(pendingStatus);
                    tuteRequest.setRequest_date(new Date());

                    session.save(tuteRequest);
                    System.out.println("✅ Tute request created via fallback for student: " + studentId + " tute: " + tuteId);
                } else {
                    System.out.println("⚠️ Tute request already exists for student: " + studentId + " tute: " + tuteId);
                }

                tx.commit();
                System.out.println("✅ Tute payment successfully recorded via fallback for student: " + studentId);
                System.out.println("✅ Payment transaction ID: " + paymentTransaction.getTransactionId());

            } catch (Exception e) {
                if (tx != null) tx.rollback();
                System.err.println("❌ Error recording tute payment in fallback: " + e.getMessage());
                e.printStackTrace();
            }

        } catch (Exception e) {
            System.err.println("❌ Error in tute payment completion fallback: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private String getStudentId(HttpServletRequest request) {
        jakarta.servlet.http.HttpSession httpSession = request.getSession(false);
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

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doPost(request, response);
    }
}
