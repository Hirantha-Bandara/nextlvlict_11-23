package com.nextlvlict.nextlvlict.controller;

import com.google.gson.JsonObject;
import com.nextlvlict.nextlvlict.hibernate.*;
import com.nextlvlict.nextlvlict.model.PayHere;
import com.nextlvlict.nextlvlict.util.PayHereConfig;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.query.Query;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.DecimalFormat;
import java.util.Date;

@WebServlet(name = "BundlePaymentServlet", urlPatterns = {"/BundlePaymentServlet"})
public class BundlePaymentServlet extends HttpServlet {

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
            System.out.println("BundlePaymentServlet action: " + action);

            // Handle paymentNotify WITHOUT login check
            if ("paymentNotify".equals(action)) {
                response.setContentType("text/plain;charset=UTF-8");
                session = HibernateUtil.getSessionFactory().openSession();
                handlePaymentNotify(session, request, response);
                return;
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
                String orderId = request.getParameter("order_id");
                System.out.println("=== BUNDLE PAYMENT RETURN HANDLER CALLED ===");
                System.out.println("Student ID: " + studentId);
                System.out.println("Order ID: " + orderId);
                if (orderId != null && !orderId.trim().isEmpty()) {
                    handlePaymentCompletionFallback(session, studentId, orderId);
                } else {
                    System.out.println("WARNING: order_id is null or empty in paymentReturn");
                }
                // Redirect to frontend dashboard
                response.sendRedirect("https://nextlvlict.com/dashboard?action=paymentReturn&order_id=" + orderId);
                writeJsonResponse = false;
                return;
            } else if ("paymentCancel".equals(action)) {
                // Redirect to frontend dashboard with cancel indication
                response.sendRedirect("https://nextlvlict.com/dashboard?action=paymentCancel");
                writeJsonResponse = false;
                return;
            } else {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Invalid action parameter");
            }
        } catch (Exception e) {
            System.err.println("Error in BundlePaymentServlet: " + e.getMessage());
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
        int bundleId = Integer.parseInt(request.getParameter("bundleId"));

        try {
            // Get student and bundle details
            Students student = session.get(Students.class, studentId);
            RecordingBundle bundle = session.get(RecordingBundle.class, bundleId);

            if (student == null || bundle == null) {
                throw new Exception("Student or Bundle not found");
            }

            // Check if bundle is already purchased
            Query<BundlePurchase> existingPurchaseQuery = session.createQuery(
                    "FROM BundlePurchase WHERE studentsId = :studentId AND bundleId = :bundleId", BundlePurchase.class);
            BundlePurchase existingPurchase = existingPurchaseQuery
                    .setParameter("studentId", studentId)
                    .setParameter("bundleId", bundleId)
                    .uniqueResult();

            if (existingPurchase != null) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "You have already purchased this bundle");
                jsonResponse.addProperty("errorCode", "ALREADY_PURCHASED");
                return;
            }

            double amount = bundle.getPrice();

            // Generate order ID with embedded identifiers
            String orderId = "BUNDLE_" + studentId + "_" + bundleId + "_" + System.currentTimeMillis();

            // Format amount correctly
            String formattedAmount = new DecimalFormat("0.00").format(amount);

            // Get base URL
            String baseUrl = getBaseUrl();
            System.out.println("Base URL: " + baseUrl);

            // Get credentials from config
            String merchantId = payhereConfig.getMerchantId();
            String merchantSecret = payhereConfig.getMerchantSecret();
            
            // Calculate hash for PayHere
            String merchantSecretMd5 = PayHere.generateMD5UpperCase(merchantSecret);
            String hashString = merchantId + orderId + formattedAmount + "LKR" + merchantSecretMd5;
            String hash = PayHere.generateMD5UpperCase(hashString);

            // Create payment data
            JsonObject paymentData = new JsonObject();
            paymentData.addProperty("sandbox", payhereConfig.isSandbox());
            paymentData.addProperty("checkout_url", payhereConfig.getCheckoutUrl());
            paymentData.addProperty("merchant_id", merchantId);
            paymentData.addProperty("return_url", baseUrl + "/BundlePaymentServlet?action=paymentReturn&studentId=" + studentId + "&order_id=" + orderId);
            paymentData.addProperty("cancel_url", baseUrl + "/BundlePaymentServlet?action=paymentCancel&studentId=" + studentId);
            paymentData.addProperty("notify_url", baseUrl + "/BundlePaymentServlet?action=paymentNotify");

            paymentData.addProperty("order_id", orderId);
            paymentData.addProperty("items", "Bundle Purchase - " + bundle.getTitle());
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
            paymentData.addProperty("custom_2", String.valueOf(bundleId));
            paymentData.addProperty("custom_3", orderId);

            jsonResponse.addProperty("success", true);
            jsonResponse.add("paymentData", paymentData);

            System.out.println("=== BUNDLE PAYMENT HASH CALCULATION ===");
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
        String customBundleId = request.getParameter("custom_2");

        // Validate required parameters
        if (isBlank(orderId) || isBlank(paymentStatus)) {
            System.err.println("❌ Missing required parameters in payment notification");
            out.print("OK");
            return;
        }

        // Recover from order_id when custom fields are missing
        if (isBlank(customStudentId) || isBlank(customBundleId)) {
            String[] parsed = parseOrderId(orderId);
            if (isBlank(customStudentId)) {
                customStudentId = parsed[0];
            }
            if (isBlank(customBundleId)) {
                customBundleId = parsed[1];
            }
        }

        // Validate recovered parameters
        if (isBlank(customStudentId) || isBlank(customBundleId)) {
            System.err.println("❌ Could not extract studentId and bundleId from order_id: " + orderId);
            out.print("OK");
            return;
        }

        System.out.println("=== BUNDLE PAYMENT NOTIFICATION ===");
        System.out.println("Merchant ID: " + merchantId);
        System.out.println("Order ID: " + orderId);
        System.out.println("Status: " + paymentStatus);
        System.out.println("Amount: " + payhereAmount);
        System.out.println("Currency: " + payhereCurrency);
        System.out.println("MD5 Sig: " + md5sig);
        System.out.println("Student ID: " + customStudentId);
        System.out.println("Bundle ID: " + customBundleId);

        // If payment status indicates success (2)
        if ("2".equals(paymentStatus)) {

            // Validate MD5 signature if provided
            if (md5sig != null && !md5sig.isEmpty()) {
                String merchantSecret = payhereConfig.getMerchantSecret();
                String md5Secret = PayHere.generateMD5UpperCase(merchantSecret);
                String expectedMd5 = PayHere.generateMD5UpperCase(
                        merchantId + orderId + payhereAmount + (payhereCurrency != null ? payhereCurrency : "LKR") + paymentStatus + md5Secret
                );

                System.out.println("Expected MD5: " + expectedMd5);
                System.out.println("Received MD5: " + md5sig);

                if (!expectedMd5.equals(md5sig)) {
                    System.err.println("❌ MD5 signature validation FAILED for bundle payment. Possible tampering.");
                    out.print("OK");
                    return;
                }
            }

            Transaction tx = session.beginTransaction();

            try {
                // Check idempotency - prevent duplicate processing
                Query<PaymentTransactions> existingTxnQuery = session.createQuery(
                        "FROM PaymentTransactions WHERE transactionId = :txnId", PaymentTransactions.class);
                PaymentTransactions existingTxn = existingTxnQuery
                        .setParameter("txnId", orderId)
                        .uniqueResult();

                if (existingTxn != null) {
                    System.out.println("⚠️ Bundle payment already processed for order: " + orderId);
                    tx.commit();
                    out.print("OK");
                    return;
                }

                // Get student and bundle
                Students student = session.get(Students.class, customStudentId);
                RecordingBundle bundle = session.get(RecordingBundle.class, Integer.parseInt(customBundleId));

                if (student == null) {
                    System.err.println("❌ Student not found: " + customStudentId);
                    tx.rollback();
                    out.print("OK");
                    return;
                }

                if (bundle == null) {
                    System.err.println("❌ Bundle not found: " + customBundleId);
                    tx.rollback();
                    out.print("OK");
                    return;
                }

                // Validate amount matches expected
                double receivedAmount = 0.0;
                try {
                    receivedAmount = Double.parseDouble(payhereAmount);
                } catch (Exception ex) {
                    System.err.println("❌ Error parsing payhere_amount: " + ex.getMessage());
                    tx.rollback();
                    out.print("OK");
                    return;
                }

                double expectedAmount = bundle.getPrice();
                if (Math.abs(receivedAmount - expectedAmount) > 0.01) {
                    System.err.println("❌ Amount mismatch. Expected: " + expectedAmount + ", Received: " + receivedAmount);
                    tx.rollback();
                    out.print("OK");
                    return;
                }

                // Create payment transaction record
                PaymentTransactions paymentTransaction = new PaymentTransactions();
                paymentTransaction.setStudent(student);
                paymentTransaction.setAmount(receivedAmount);
                paymentTransaction.setCurrency(payhereCurrency != null ? payhereCurrency : "LKR");
                paymentTransaction.setPaymentMethod("PayHere");
                paymentTransaction.setTransactionId(orderId);
                paymentTransaction.setDescription("Bundle purchase - " + bundle.getTitle());
                paymentTransaction.setCreatedAt(new Date());
                paymentTransaction.setUpdatedAt(new Date());
                paymentTransaction.setVerificationStatus("completed");
                paymentTransaction.setVerifiedBy("PAYHERE_SYSTEM");
                paymentTransaction.setVerificationDate(new Date());
                paymentTransaction.setVerificationNotes("Auto-verified by PayHere callback - Bundle purchase");

                session.save(paymentTransaction);

                // Create bundle purchase record
                Query<BundlePurchase> existingPurchaseQuery = session.createQuery(
                        "FROM BundlePurchase WHERE studentsId = :studentId AND bundleId = :bundleId", BundlePurchase.class);
                BundlePurchase existingPurchase = existingPurchaseQuery
                        .setParameter("studentId", customStudentId)
                        .setParameter("bundleId", Integer.parseInt(customBundleId))
                        .uniqueResult();

                if (existingPurchase == null) {
                    BundlePurchase bundlePurchase = new BundlePurchase();
                    bundlePurchase.setBundleId(Integer.parseInt(customBundleId));
                    bundlePurchase.setStudentsId(customStudentId);
                    bundlePurchase.setPurchase_date(new Date());
                    bundlePurchase.setPayment_status("COMPLETED");
                    bundlePurchase.setOrder_id(orderId);
                    bundlePurchase.setAmount_paid(receivedAmount);

                    session.save(bundlePurchase);
                    System.out.println("✅ Bundle purchase created after successful payment for student: " + customStudentId + " bundle: " + customBundleId);
                } else {
                    System.out.println("⚠️ Bundle purchase already exists for student: " + customStudentId + " bundle: " + customBundleId);
                }

                tx.commit();
                System.out.println("✅ Bundle payment successfully recorded and purchase created");
            } catch (Exception e) {
                if (tx != null && tx.isActive()) {
                    tx.rollback();
                }
                System.out.println("❌ Error recording bundle payment: " + e.getMessage());
                System.err.println("Bundle payment notify error: " + e.getMessage());
                e.printStackTrace();
            } finally {
                // Session is closed in the finally block of doPost
            }
        } else {
            System.out.println("ℹ️ Bundle payment status: " + paymentStatus + " (not success)");
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
        if (orderId == null || !orderId.startsWith("BUNDLE_")) {
            return result;
        }

        // Expected format: BUNDLE_<studentId>_<bundleId>_<timestamp>
        String[] parts = orderId.split("_");
        if (parts.length >= 4) {
            result[0] = parts[1];
            result[1] = parts[2];
        }
        return result;
    }

    private void handlePaymentCompletionFallback(Session session, String studentId, String orderId) {
        try {
            System.out.println("=== BUNDLE PAYMENT COMPLETION FALLBACK ===");
            System.out.println("Order ID: " + orderId);
            System.out.println("Student ID: " + studentId);

            // Parse order_id to get bundleId
            String[] parsed = parseOrderId(orderId);
            if (parsed[0] == null || parsed[1] == null) {
                System.err.println("❌ Could not parse order_id: " + orderId);
                return;
            }
            String bundleId = parsed[1];

            // Check idempotency - prevent duplicate processing
            Query<PaymentTransactions> existingTxnQuery = session.createQuery(
                    "FROM PaymentTransactions WHERE transactionId = :txnId", PaymentTransactions.class);
            PaymentTransactions existingTxn = existingTxnQuery
                    .setParameter("txnId", orderId)
                    .uniqueResult();

            if (existingTxn != null) {
                System.out.println("⚠️ Bundle payment already processed for order: " + orderId);
                return;
            }

            // Get student and bundle
            Students student = session.get(Students.class, studentId);
            RecordingBundle bundle = session.get(RecordingBundle.class, Integer.parseInt(bundleId));

            if (student == null) {
                System.err.println("❌ Student not found for fallback: " + studentId);
                return;
            }

            if (bundle == null) {
                System.err.println("❌ Bundle not found for fallback: " + bundleId);
                return;
            }

            System.out.println("✅ Found student and bundle for fallback processing");

            Transaction tx = session.beginTransaction();
            try {
                // Create payment transaction record with fallback marker
                PaymentTransactions paymentTransaction = new PaymentTransactions();
                paymentTransaction.setStudent(student);
                paymentTransaction.setAmount(bundle.getPrice());
                paymentTransaction.setCurrency("LKR");
                paymentTransaction.setPaymentMethod("PayHere");
                paymentTransaction.setTransactionId(orderId);
                paymentTransaction.setDescription("Bundle purchase - " + bundle.getTitle() + " (fallback completion)");
                paymentTransaction.setCreatedAt(new Date());
                paymentTransaction.setUpdatedAt(new Date());
                paymentTransaction.setVerificationStatus("completed");
                paymentTransaction.setVerifiedBy("PAYHERE_RETURN_FALLBACK");
                paymentTransaction.setVerificationDate(new Date());
                paymentTransaction.setVerificationNotes("Auto-verified by paymentReturn callback - Bundle purchase (notify_url may have failed)");

                session.save(paymentTransaction);

                // Check if purchase already exists
                Query<BundlePurchase> existingPurchaseQuery = session.createQuery(
                        "FROM BundlePurchase WHERE studentsId = :studentId AND bundleId = :bundleId", BundlePurchase.class);
                BundlePurchase existingPurchase = existingPurchaseQuery
                        .setParameter("studentId", studentId)
                        .setParameter("bundleId", Integer.parseInt(bundleId))
                        .uniqueResult();

                if (existingPurchase == null) {
                    BundlePurchase bundlePurchase = new BundlePurchase();
                    bundlePurchase.setBundleId(Integer.parseInt(bundleId));
                    bundlePurchase.setStudentsId(studentId);
                    bundlePurchase.setPurchase_date(new Date());
                    bundlePurchase.setPayment_status("COMPLETED");
                    bundlePurchase.setOrder_id(orderId);
                    bundlePurchase.setAmount_paid(bundle.getPrice());

                    session.save(bundlePurchase);
                    System.out.println("✅ Bundle purchase created via fallback for student: " + studentId + " bundle: " + bundleId);
                } else {
                    System.out.println("⚠️ Bundle purchase already exists for student: " + studentId + " bundle: " + bundleId);
                }

                tx.commit();
                System.out.println("✅ Bundle payment successfully recorded via fallback for student: " + studentId);
                System.out.println("✅ Payment transaction ID: " + paymentTransaction.getTransactionId());

            } catch (Exception e) {
                if (tx != null && tx.isActive()) {
                    tx.rollback();
                }
                System.err.println("❌ Error recording bundle payment in fallback: " + e.getMessage());
                e.printStackTrace();
            }

        } catch (Exception e) {
            System.err.println("❌ Error in bundle payment completion fallback: " + e.getMessage());
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
