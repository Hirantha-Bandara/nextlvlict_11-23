package com.nextlvlict.nextlvlict.controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.nextlvlict.nextlvlict.hibernate.*;
import com.nextlvlict.nextlvlict.model.PayHere;
import com.nextlvlict.nextlvlict.service.MonthlyFeeGenerationService;
import org.hibernate.Session;
import org.hibernate.Transaction;
import com.nextlvlict.nextlvlict.util.PayHereConfig;
import org.hibernate.query.Query;
import org.hibernate.LockMode;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@WebServlet(name = "ClassFee", urlPatterns = {"/ClassFee"})
public class ClassFee extends HttpServlet {

    private Gson gson = new Gson();
    private PayHereConfig payhereConfig;

    @Override
    public void init() throws ServletException {
        payhereConfig = PayHereConfig.getInstance();
        payhereConfig.logConfig();

        // Validate database setup on startup
        validateDatabaseSetup();
    }

    private void validateDatabaseSetup() {
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            // Check payment_status table
            PaymentStatus pending = session.get(PaymentStatus.class, 1);
            PaymentStatus paid = session.get(PaymentStatus.class, 2);

            if (pending == null || paid == null) {
                System.err.println("❌ CRITICAL: PaymentStatus table is missing required records!");
                System.err.println("Please run the following SQL:");
                System.err.println("INSERT INTO payment_status (id, value) VALUES (1, 'PENDING'), (2, 'PAID'), (3, 'FAILED'), (4, 'REFUNDED');");
            } else {
                System.out.println("✅ PaymentStatus table verified: PENDING=" + pending.getValue() + ", PAID=" + paid.getValue());
            }

            // Check student_monthly_fees table structure
            try {
                session.createQuery("FROM StudentMonthlyFees", StudentMonthlyFees.class).setMaxResults(1).list();
                System.out.println("✅ StudentMonthlyFees entity mapping verified");
            } catch (Exception e) {
                System.err.println("❌ StudentMonthlyFees mapping error: " + e.getMessage());
            }

        } catch (Exception e) {
            System.err.println("❌ Database validation failed: " + e.getMessage());
        }
    }

    private void setNgrokHeaders(HttpServletResponse response) {
        response.setHeader("ngrok-skip-browser-warning", "true");
    }

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json;charset=UTF-8");

        PrintWriter out = response.getWriter();
        JsonObject jsonResponse = new JsonObject();

        Session session = null;
        try {
            String action = request.getParameter("action");
            System.out.println("ClassFee action: " + action);

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

            if ("getFeeDetails".equals(action)) {
                handleGetFeeDetails(session, studentId, jsonResponse);
            } else if ("initiatePayment".equals(action)) {
                handleInitiatePayment(session, studentId, request, jsonResponse);
            } else if ("paymentReturn".equals(action)) {
                // Handle payment completion as fallback if notify wasn't called
                String orderId = request.getParameter("order_id");
                System.out.println("=== PAYMENT RETURN HANDLER CALLED ===");
                System.out.println("Student ID: " + studentId);
                System.out.println("Order ID: " + orderId);
                if (orderId != null && !orderId.trim().isEmpty()) {
                    handlePaymentCompletionFallback(session, studentId, orderId);
                } else {
                    System.out.println("⚠️  WARNING: order_id is null or empty in paymentReturn");
                }
                jsonResponse.addProperty("success", true);
                jsonResponse.addProperty("message", "Payment completed successfully");
            } else if ("paymentCancel".equals(action)) {
                handlePaymentCancel(session, studentId, request, jsonResponse);
            } else {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Unknown action");
            }

        } catch (Exception e) {
            e.printStackTrace();
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "❌ Server error: " + e.getMessage());
            System.err.println("❌ Error in ClassFee processRequest: " + e.getMessage());
        } finally {
            if (session != null && session.isOpen()) {
                try {
                    session.close();
                } catch (Exception e) {
                    System.err.println("❌ Error closing Hibernate session: " + e.getMessage());
                }
            }
            if (!"paymentNotify".equals(request.getParameter("action"))) {
                out.print(jsonResponse.toString());
                out.flush();
            }
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

    private void handleGetFeeDetails(Session session, String studentId, JsonObject jsonResponse) {
        try {
            Students student = session.get(Students.class, studentId);
            if (student == null) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Student not found");
                return;
            }

            Grade grade = student.getGrade();
            if (grade == null) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Grade not assigned to student");
                return;
            }

            String currentMonthYear = getCurrentMonthYear();

            // Get all monthly fee records for the current month (one per class type)
            String hql = "FROM StudentMonthlyFees WHERE student.id = :studentId AND monthYear = :monthYear";
            Query<StudentMonthlyFees> query = session.createQuery(hql, StudentMonthlyFees.class);
            query.setParameter("studentId", studentId);
            query.setParameter("monthYear", currentMonthYear);
            List<StudentMonthlyFees> monthlyFees = query.list();

            // If no fee records exist, generate them
            if (monthlyFees.isEmpty()) {
                MonthlyFeeGenerationService.generateMonthlyFeesForStudentForMonth(session, student, currentMonthYear);
                // Reload the fee records
                monthlyFees = query.list();
            }

            JsonObject feeDetails = new JsonObject();
            feeDetails.addProperty("grade", grade.getName());
            feeDetails.addProperty("currency", "LKR");
            feeDetails.addProperty("monthYear", currentMonthYear);

            // Build fee details array with one entry per class type
            com.google.gson.JsonArray feeArray = new com.google.gson.JsonArray();
            for (StudentMonthlyFees monthlyFee : monthlyFees) {
                JsonObject feeEntry = new JsonObject();
                feeEntry.addProperty("feeId", monthlyFee.getId());
                feeEntry.addProperty("classTypeId", monthlyFee.getClassType() != null ? monthlyFee.getClassType().getId() : 0);
                feeEntry.addProperty("classTypeName", monthlyFee.getClassType() != null ? monthlyFee.getClassType().getName() : "Unknown");
                feeEntry.addProperty("feeAmount", monthlyFee.getFeeAmount());
                feeEntry.addProperty("status", monthlyFee.getStatus() != null ? monthlyFee.getStatus().getValue() : "PENDING");
                if (monthlyFee.getDueDate() != null) {
                    feeEntry.addProperty("dueDate", monthlyFee.getDueDate().toString());
                }
                if (monthlyFee.getPaidDate() != null) {
                    feeEntry.addProperty("paidDate", monthlyFee.getPaidDate().toString());
                }
                feeArray.add(feeEntry);
            }

            feeDetails.add("fees", feeArray);
            jsonResponse.addProperty("success", true);
            jsonResponse.add("feeDetails", feeDetails);

        } catch (Exception e) {
            e.printStackTrace();
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error fetching fee details: " + e.getMessage());
        }
    }

    private void handleInitiatePayment(Session session, String studentId,
                                       HttpServletRequest request, JsonObject jsonResponse) throws Exception {

        Students student = (Students) session.get(Students.class, studentId);
        if (student == null) {
            throw new Exception("Student not found");
        }

        // Get feeId from request to identify which class type fee is being paid
        String feeIdStr = request.getParameter("feeId");
        if (feeIdStr == null || feeIdStr.isEmpty()) {
            throw new Exception("feeId parameter is required");
        }

        Integer feeId;
        try {
            feeId = Integer.parseInt(feeIdStr);
        } catch (NumberFormatException e) {
            throw new Exception("Invalid feeId parameter");
        }

        // Get the specific monthly fee record with pessimistic locking
        StudentMonthlyFees monthlyFee = null;
        try {
            monthlyFee = session.get(StudentMonthlyFees.class, feeId, LockMode.PESSIMISTIC_WRITE);
        } catch (Exception e) {
            System.err.println("Warning: Could not acquire lock on fee record (another payment may be in progress)");
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Another payment for this fee is already in progress. Please wait.");
            return;
        }

        if (monthlyFee == null) {
            throw new Exception("Fee record not found");
        }

        // Verify the fee belongs to the student
        if (!monthlyFee.getStudent().getId().equals(studentId)) {
            throw new Exception("Fee record does not belong to this student");
        }

        // Check if an order is already in progress (transactionId is set but fee is still PENDING)
        // Allow retry if: status is CANCELLED/FAILED, or PENDING with expired transaction_id (>30 min old)
        if (monthlyFee.getTransactionId() != null && monthlyFee.getTransactionId().length() > 0) {
            if (monthlyFee.getStatus() != null && monthlyFee.getStatus().getId() == PaymentStatus.PENDING) {
                // Check if the pending payment has expired (30 minutes)
                if (!isPaymentExpired(monthlyFee.getUpdatedAt(), 30)) {
                    // PENDING and not expired: Order already in progress
                    System.out.println("⚠️  Payment already initiated for this fee and not expired");
                    jsonResponse.addProperty("success", false);
                    jsonResponse.addProperty("message", "Payment already in progress for this fee. Please check your email or complete the payment.");
                    return;
                }
                // PENDING but expired: Allow retry, will clear transaction_id below
                System.out.println("✅ Previous payment attempt expired, allowing retry");
            } else if (monthlyFee.getStatus() != null && monthlyFee.getStatus().getId() == PaymentStatus.PAID) {
                // Already paid: Cannot retry
                System.out.println("⚠️  Fee already paid");
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "This fee has already been paid.");
                return;
            }
            // CANCELLED or FAILED: Allow retry, will clear transaction_id below
            System.out.println("✅ Previous payment was " + monthlyFee.getStatus().getValue() + ", allowing retry");
        }

        // Use the existing fee amount from the record (never calculate from Grade.fee)
        double amount = monthlyFee.getFeeAmount();
        String currentMonthYear = monthlyFee.getMonthYear();
        Grade grade = monthlyFee.getGrade();
        ClassType classType = monthlyFee.getClassType();

        // Generate order ID (must be unique)
        String orderId = "FEE" + System.currentTimeMillis();

        // Save the order_id to the fee record BEFORE sending to PayHere
        // Clear any old transaction_id if retrying after cancellation/failure/expiry
        Transaction tx = session.beginTransaction();
        try {
            monthlyFee.setTransactionId(orderId);
            monthlyFee.setUpdatedAt(new Date());
            // Reset status to PENDING if it was CANCELLED or FAILED
            if (monthlyFee.getStatus() == null || 
                monthlyFee.getStatus().getId() == PaymentStatus.CANCELLED || 
                monthlyFee.getStatus().getId() == PaymentStatus.FAILED) {
                PaymentStatus pendingStatus = session.get(PaymentStatus.class, PaymentStatus.PENDING);
                monthlyFee.setStatus(pendingStatus);
            }
            session.update(monthlyFee);
            tx.commit();
            System.out.println("✅ Saved order_id to fee record: " + orderId);
        } catch (Exception e) {
            tx.rollback();
            throw new Exception("Failed to save order_id: " + e.getMessage());
        }

        // Format amount correctly
        String formattedAmount = new DecimalFormat("0.00").format(amount);

        // Get base URL
        String baseUrl = getBaseUrl();
        System.out.println("Base URL: " + baseUrl);

        // CRITICAL FIX: PayHere requires UPPERCASE hash
        String merchantId = payhereConfig.getMerchantId();
        String merchantSecret = payhereConfig.getMerchantSecret();

        // Step 1: Generate UPPERCASE MD5 of merchant secret
        String merchantSecretMd5 = PayHere.generateMD5UpperCase(merchantSecret);
        System.out.println("Merchant Secret MD5 (UPPERCASE): " + merchantSecretMd5);

        // Step 2: Build hash string
        String hashString = merchantId + orderId + formattedAmount + "LKR" + merchantSecretMd5;

        // Step 3: Generate final hash in UPPERCASE
        String hash = PayHere.generateMD5UpperCase(hashString);

        System.out.println("=== PAYHERE HASH CALCULATION ===");
        System.out.println("Merchant ID: " + merchantId);
        System.out.println("Order ID: " + orderId);
        System.out.println("Amount: " + formattedAmount);
        System.out.println("Currency: LKR");
        System.out.println("Final Hash (UPPERCASE): " + hash);

        // Create payment data for PayHere
        JsonObject paymentData = new JsonObject();
        paymentData.addProperty("sandbox", payhereConfig.isSandbox());
        paymentData.addProperty("checkout_url", payhereConfig.getCheckoutUrl());
        paymentData.addProperty("merchant_id", merchantId);
        paymentData.addProperty("return_url", "https://nextlvlict.com/dashboard?action=paymentReturn&studentId=" + studentId + "&order_id=" + orderId);
        paymentData.addProperty("cancel_url", "https://nextlvlict.com/dashboard?action=paymentCancel&studentId=" + studentId + "&order_id=" + orderId);
        paymentData.addProperty("notify_url", baseUrl + "/ClassFee?action=paymentNotify");

        paymentData.addProperty("order_id", orderId);
        String itemDescription = "Monthly Class Fee - " + grade.getName() + 
                " (" + (classType != null ? classType.getName() : "General") + ") - " + currentMonthYear;
        paymentData.addProperty("items", itemDescription);
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

        // Custom parameters for tracking
        paymentData.addProperty("custom_1", studentId);
        paymentData.addProperty("custom_2", currentMonthYear);
        paymentData.addProperty("custom_3", String.valueOf(monthlyFee.getId()));

        jsonResponse.addProperty("success", true);
        jsonResponse.add("paymentData", paymentData);

        System.out.println("Payment data sent to frontend:");
        System.out.println(gson.toJson(paymentData));
    }

    private void handlePaymentNotify(Session session, HttpServletRequest request,
                                     HttpServletResponse response) throws Exception {

        response.setHeader("ngrok-skip-browser-warning", "true");
        PrintWriter out = response.getWriter();

        String merchantId = request.getParameter("merchant_id");
        String orderId = request.getParameter("order_id");
        String paymentStatus = request.getParameter("status_code");
        String payhereAmount = request.getParameter("payhere_amount");
        String payhereCurrency = request.getParameter("payhere_currency");
        String md5sig = request.getParameter("md5sig");
        String customStudentId = request.getParameter("custom_1");
        String customMonthYear = request.getParameter("custom_2");
        String customFeeId = request.getParameter("custom_3");

        System.out.println("=== PAYMENT NOTIFICATION ===");
        System.out.println("Merchant ID: " + merchantId);
        System.out.println("Order ID: " + orderId);
        System.out.println("Status Code: " + paymentStatus);
        System.out.println("Amount: " + payhereAmount);
        System.out.println("Currency: " + payhereCurrency);
        System.out.println("MD5 Sig: " + md5sig);
        System.out.println("Student ID: " + customStudentId);
        System.out.println("Month Year: " + customMonthYear);
        System.out.println("Fee ID: " + customFeeId);

        if (isBlank(merchantId) || !merchantId.equals(payhereConfig.getMerchantId())) {
            System.err.println("Invalid PayHere merchant_id received: " + merchantId);
            out.print("OK");
            return;
        }

        String callbackCurrency = isBlank(payhereCurrency) ? "LKR" : payhereCurrency;
        String merchantSecretMd5 = PayHere.generateMD5UpperCase(payhereConfig.getMerchantSecret());
        String expectedHash = PayHere.generateMD5UpperCase(
                merchantId + orderId + payhereAmount + callbackCurrency + paymentStatus + merchantSecretMd5);

        System.out.println("Expected MD5: " + expectedHash);
        System.out.println("Received MD5: " + md5sig);

        if (isBlank(md5sig) || !expectedHash.equals(md5sig)) {
            System.err.println("MD5 Signature validation FAILED!");
            out.print("OK");
            return;
        }

        System.out.println("MD5 Signature validated successfully!");

        if ("2".equals(paymentStatus)) {
            Transaction tx = session.beginTransaction();
            try {
                Query<PaymentTransactions> existingTxnQuery = session.createQuery(
                        "FROM PaymentTransactions WHERE transactionId = :txnId", PaymentTransactions.class);
                PaymentTransactions existingTxn = existingTxnQuery
                        .setParameter("txnId", orderId)
                        .uniqueResult();

                if (existingTxn != null) {
                    System.out.println("Payment already recorded for order: " + orderId);
                    tx.commit();
                    out.print("OK");
                    return;
                }

                StudentMonthlyFees monthlyFee = findMonthlyFeeForCallback(
                        session, orderId, customFeeId, customStudentId, customMonthYear);

                if (monthlyFee == null) {
                    System.err.println("Could not find fee record for order: " + orderId);
                    tx.rollback();
                    out.print("OK");
                    return;
                }

                PaymentStatus paidStatus = session.get(PaymentStatus.class, 2);
                if (paidStatus == null) {
                    throw new Exception("PaymentStatus with ID 2 not found!");
                }

                monthlyFee.setStatus(paidStatus);
                monthlyFee.setPaidDate(new Date());
                monthlyFee.setTransactionId(orderId);
                monthlyFee.setUpdatedAt(new Date());
                session.update(monthlyFee);

                PaymentTransactions paymentTransaction = new PaymentTransactions();
                paymentTransaction.setStudent(monthlyFee.getStudent());
                paymentTransaction.setAmount(parseAmount(payhereAmount, monthlyFee.getFeeAmount()));
                paymentTransaction.setCurrency(callbackCurrency);
                paymentTransaction.setPaymentMethod("PayHere");
                paymentTransaction.setTransactionId(orderId);
                paymentTransaction.setDescription("Monthly fee payment for " + monthlyFee.getMonthYear());
                paymentTransaction.setCreatedAt(new Date());
                paymentTransaction.setUpdatedAt(new Date());
                paymentTransaction.setVerificationStatus("completed");
                paymentTransaction.setVerifiedBy("PAYHERE_SYSTEM");
                paymentTransaction.setVerificationDate(new Date());
                paymentTransaction.setVerificationNotes("Auto-verified by PayHere callback - Class fee payment");

                session.save(paymentTransaction);

                tx.commit();
                System.out.println("Payment successfully recorded for student: " + monthlyFee.getStudent().getId());

            } catch (Exception e) {
                if (tx != null) tx.rollback();
                System.err.println("Error recording payment: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("Payment failed with status: " + paymentStatus);
            
            // Handle failed/cancelled payments from PayHere
            if ("0".equals(paymentStatus) || "-1".equals(paymentStatus) || "-2".equals(paymentStatus) || "-3".equals(paymentStatus)) {
                Transaction tx = session.beginTransaction();
                try {
                    StudentMonthlyFees monthlyFee = findMonthlyFeeForCallback(
                            session, orderId, customFeeId, customStudentId, customMonthYear);

                    if (monthlyFee != null) {
                        PaymentStatus cancelledStatus = session.get(PaymentStatus.class, PaymentStatus.CANCELLED);
                        if (cancelledStatus != null) {
                            monthlyFee.setStatus(cancelledStatus);
                            monthlyFee.setUpdatedAt(new Date());
                            session.update(monthlyFee);
                            System.out.println("✅ Fee status updated to CANCELLED for order: " + orderId);
                        }
                    }
                    
                    // Log the failed/cancelled payment transaction
                    logFailedPayment(session, orderId, paymentStatus, customStudentId);
                    
                    tx.commit();
                } catch (Exception e) {
                    if (tx != null) tx.rollback();
                    System.err.println("Error handling failed payment: " + e.getMessage());
                }
            }
        }

        out.print("OK");
    }

    private void handlePaymentCancel(Session session, String studentId,
                                       HttpServletRequest request, JsonObject jsonResponse) {
        try {
            String orderId = request.getParameter("order_id");
            System.out.println("=== PAYMENT CANCEL HANDLER CALLED ===");
            System.out.println("Student ID: " + studentId);
            System.out.println("Order ID: " + orderId);

            if (orderId != null && !orderId.trim().isEmpty()) {
                // Look up the fee record by order_id
                Query<StudentMonthlyFees> query = session.createQuery(
                        "FROM StudentMonthlyFees WHERE transactionId = :orderId", StudentMonthlyFees.class);
                query.setParameter("orderId", orderId);
                StudentMonthlyFees monthlyFee = query.uniqueResult();

                if (monthlyFee != null) {
                    // Verify the fee belongs to the student
                    if (!monthlyFee.getStudent().getId().equals(studentId)) {
                        jsonResponse.addProperty("success", false);
                        jsonResponse.addProperty("message", "Invalid request");
                        return;
                    }

                    // Update status to CANCELLED only if still PENDING
                    if (monthlyFee.getStatus() != null && monthlyFee.getStatus().getId() == PaymentStatus.PENDING) {
                        Transaction tx = session.beginTransaction();
                        try {
                            PaymentStatus cancelledStatus = session.get(PaymentStatus.class, PaymentStatus.CANCELLED);
                            if (cancelledStatus != null) {
                                monthlyFee.setStatus(cancelledStatus);
                                monthlyFee.setUpdatedAt(new Date());
                                session.update(monthlyFee);
                                System.out.println("✅ Fee status updated to CANCELLED for order: " + orderId);
                            }
                            tx.commit();
                        } catch (Exception e) {
                            if (tx != null) tx.rollback();
                            System.err.println("Error updating fee status to CANCELLED: " + e.getMessage());
                        }
                    }
                }
            }

            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Payment was cancelled. You can try again.");

        } catch (Exception e) {
            e.printStackTrace();
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error processing cancellation: " + e.getMessage());
        }
    }

    private void handlePaymentCompletionFallback(Session session, String studentId, String orderId) {
        try {
            System.out.println("=== PAYMENT COMPLETION FALLBACK ===");
            System.out.println("Order ID: " + orderId);
            System.out.println("Student ID: " + studentId);

            // Look up the fee record by order_id
            Query<StudentMonthlyFees> query = session.createQuery(
                    "FROM StudentMonthlyFees WHERE transactionId = :orderId", StudentMonthlyFees.class);
            query.setParameter("orderId", orderId);
            StudentMonthlyFees monthlyFee = query.uniqueResult();

            if (monthlyFee == null) {
                System.err.println("❌ Could not find fee record for order: " + orderId);
                System.err.println("This means the order_id was not saved during initiatePayment");
                return;
            }

            System.out.println("✅ Found fee record: ID=" + monthlyFee.getId() + ", Status=" +
                    (monthlyFee.getStatus() != null ? monthlyFee.getStatus().getValue() : "NULL"));

            // Check if already paid
            if (monthlyFee.getStatus() != null && monthlyFee.getStatus().getId() == 2) {
                System.out.println("Payment already recorded for order: " + orderId);
                return;
            }

            Transaction tx = session.beginTransaction();
            try {
                PaymentStatus paidStatus = session.get(PaymentStatus.class, 2);
                if (paidStatus == null) {
                    System.err.println("❌ PaymentStatus with ID 2 not found!");
                    tx.rollback();
                    return;
                }

                System.out.println("Updating fee record to PAID status...");
                monthlyFee.setStatus(paidStatus);
                monthlyFee.setPaidDate(new Date());
                monthlyFee.setUpdatedAt(new Date());
                session.update(monthlyFee);

                PaymentTransactions paymentTransaction = new PaymentTransactions();
                paymentTransaction.setStudent(monthlyFee.getStudent());
                paymentTransaction.setAmount(monthlyFee.getFeeAmount());
                paymentTransaction.setCurrency("LKR");
                paymentTransaction.setPaymentMethod("PayHere");
                paymentTransaction.setTransactionId(orderId);
                paymentTransaction.setDescription("Monthly fee payment for " + monthlyFee.getMonthYear() + " (fallback completion)");
                paymentTransaction.setCreatedAt(new Date());
                paymentTransaction.setUpdatedAt(new Date());
                paymentTransaction.setVerificationStatus("completed");
                paymentTransaction.setVerifiedBy("PAYHERE_RETURN_FALLBACK");
                paymentTransaction.setVerificationDate(new Date());
                paymentTransaction.setVerificationNotes("Auto-verified by paymentReturn callback - Class fee payment (notify_url may have failed)");

                session.save(paymentTransaction);

                tx.commit();
                System.out.println("✅ Payment successfully recorded via fallback for student: " + monthlyFee.getStudent().getId());
                System.out.println("✅ Payment transaction ID: " + paymentTransaction.getTransactionId());

            } catch (Exception e) {
                if (tx != null) tx.rollback();
                System.err.println("❌ Error recording payment in fallback: " + e.getMessage());
                e.printStackTrace();
            }

        } catch (Exception e) {
            System.err.println("❌ Error in payment completion fallback: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private StudentMonthlyFees findMonthlyFeeForCallback(Session session, String orderId,
                                                         String customFeeId, String customStudentId,
                                                         String customMonthYear) {
        StudentMonthlyFees monthlyFee = null;

        // Primary lookup: by order_id
        if (!isBlank(orderId)) {
            Query<StudentMonthlyFees> query = session.createQuery(
                    "FROM StudentMonthlyFees WHERE transactionId = :orderId", StudentMonthlyFees.class);
            query.setParameter("orderId", orderId);
            query.setMaxResults(1);
            monthlyFee = query.uniqueResult();
            System.out.println("Looking up by order_id: " + orderId + " - Found: " + (monthlyFee != null));
        }

        // Secondary lookup: by fee ID
        if (monthlyFee == null && !isBlank(customFeeId)) {
            try {
                monthlyFee = session.get(StudentMonthlyFees.class, Integer.parseInt(customFeeId));
                System.out.println("Looking up by custom fee id: " + customFeeId + " - Found: " + (monthlyFee != null));
            } catch (NumberFormatException e) {
                System.err.println("Invalid custom_3 fee id received: " + customFeeId);
            }
        }

        // Fallback lookup: by student and month (may return multiple, take first)
        // Note: With the new architecture, this is less reliable since a student can have multiple fees per month
        if (monthlyFee == null && !isBlank(customStudentId) && !isBlank(customMonthYear)) {
            Query<StudentMonthlyFees> query = session.createQuery(
                    "FROM StudentMonthlyFees WHERE student.id = :studentId AND monthYear = :monthYear",
                    StudentMonthlyFees.class);
            query.setParameter("studentId", customStudentId);
            query.setParameter("monthYear", customMonthYear);
            query.setMaxResults(1);
            monthlyFee = query.uniqueResult();
            System.out.println("Looking up by student/month: " + customStudentId + "/" + customMonthYear
                    + " - Found: " + (monthlyFee != null));
        }

        return monthlyFee;
    }

    private double parseAmount(String payhereAmount, Double fallbackAmount) {
        try {
            return Double.parseDouble(payhereAmount);
        } catch (Exception e) {
            System.err.println("Error parsing payhere_amount: " + e.getMessage());
            return fallbackAmount != null ? fallbackAmount : 0.0;
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    // Helper method for MD5 signature generation (same as PayHere expects)
    private String generatePayHereMd5Sig(String merchantId, String orderId,
                                         String amount, String currency, String merchantSecret) {
        String md5Secret = PayHere.generateMD5(merchantSecret).toLowerCase();
        String hash = PayHere.generateMD5(
                merchantId + orderId + amount + currency + md5Secret
        ).toLowerCase();
        return hash;
    }

    // Helper method to log failed payments
    private void logFailedPayment(Session session, String orderId,
                                  String statusCode, String studentId) {
        Transaction tx = session.beginTransaction();
        try {
            PaymentTransactions failedTransaction = new PaymentTransactions();
            failedTransaction.setTransactionId(orderId);
            failedTransaction.setDescription("Failed payment - Status: " + statusCode);
            failedTransaction.setCreatedAt(new Date());
            failedTransaction.setUpdatedAt(new Date());
            failedTransaction.setVerificationStatus("failed");
            
            // Set student if studentId is provided
            if (studentId != null && !studentId.isEmpty()) {
                Students student = session.get(Students.class, studentId);
                if (student != null) {
                    failedTransaction.setStudent(student);
                }
            }
            
            session.save(failedTransaction);
            tx.commit();
            System.out.println("Logged failed payment for order: " + orderId);
        } catch (Exception e) {
            if (tx != null) tx.rollback();
            System.err.println("Error logging failed payment: " + e.getMessage());
        }
    }

    // Helper method to check if a payment has expired
    private boolean isPaymentExpired(Date updatedAt, int expiryMinutes) {
        if (updatedAt == null) {
            return true; // No timestamp, consider expired
        }
        long expiryMillis = expiryMinutes * 60 * 1000L;
        long ageMillis = System.currentTimeMillis() - updatedAt.getTime();
        return ageMillis > expiryMillis;
    }

    // Helper methods
    private StudentMonthlyFees getCurrentMonthFee(Session session, String studentId, String monthYear) {
        try {
            // Note: This method is deprecated. Use MonthlyFeeGenerationService instead.
            // Kept for backward compatibility if needed.
            String hql = "FROM StudentMonthlyFees WHERE student.id = :studentId AND monthYear = :monthYear";
            Query<StudentMonthlyFees> query = session.createQuery(hql, StudentMonthlyFees.class);
            query.setParameter("studentId", studentId);
            query.setParameter("monthYear", monthYear);
            return query.uniqueResult();
        } catch (Exception e) {
            System.err.println("Error getting current month fee: " + e.getMessage());
            return null;
        }
    }

//    private String getBaseUrl() {
//        return payhereConfig.getBaseUrl();
//    }

    public String getBaseUrl() {
        String baseUrl = payhereConfig.getBaseUrl();
        // Remove trailing slash if present
        if (baseUrl.endsWith("/")) {
            baseUrl = baseUrl.substring(0, baseUrl.length() - 1);
        }
        return baseUrl;
    }

    private String getCurrentMonthYear() {
        Calendar cal = Calendar.getInstance();
        return String.format("%04d-%02d", cal.get(Calendar.YEAR), cal.get(Calendar.MONTH) + 1);
    }

    private String getNextDueDate() {
        Calendar cal = getNextDueDateCalendar();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        return sdf.format(cal.getTime());
    }

    private Calendar getNextDueDateCalendar() {
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.DAY_OF_MONTH, 10);
        return cal;
    }

    private String formatDate(Date date) {
        if (date == null) {
            return "";
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        return sdf.format(date);
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
}
