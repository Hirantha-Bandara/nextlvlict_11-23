package com.nextlvlict.nextlvlict.controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.nextlvlict.nextlvlict.hibernate.EventRegistration;
import com.nextlvlict.nextlvlict.hibernate.HibernateUtil;
import com.nextlvlict.nextlvlict.hibernate.PortfolioEvent;
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
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.util.Date;
import java.util.Random;
import java.util.Base64;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import java.io.ByteArrayOutputStream;
import java.awt.image.BufferedImage;
import javax.imageio.ImageIO;

@WebServlet(name = "EventRegistrationServlet", urlPatterns = {"/EventRegistrationServlet"})
public class EventRegistrationServlet extends HttpServlet {

    private Gson gson = new Gson();
    private PayHereConfig payhereConfig;
    private static final String REGISTRATION_NUMBER_PREFIX = "EVT";

    @Override
    public void init() throws ServletException {
        payhereConfig = PayHereConfig.getInstance();
        payhereConfig.logConfig();
    }

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json;charset=UTF-8");
        PrintWriter out = response.getWriter();
        JsonObject jsonResponse = new JsonObject();

        Session session = null;
        try {
            String action = request.getParameter("action");
            System.out.println("EventRegistrationServlet action: " + action);

            // Handle paymentNotify WITHOUT login check
            if ("paymentNotify".equals(action)) {
                response.setContentType("text/plain;charset=UTF-8");
                session = HibernateUtil.getSessionFactory().openSession();
                handlePaymentNotify(session, request, response);
                return;
            }

            // Handle QR code download
            if ("downloadQRCode".equals(action)) {
                response.setContentType("image/png");
                session = HibernateUtil.getSessionFactory().openSession();
                handleDownloadQRCode(session, request, response);
                return;
            }

            session = HibernateUtil.getSessionFactory().openSession();

            if ("initiateRegistration".equals(action)) {
                handleInitiateRegistration(session, request, jsonResponse);
            } else if ("initiatePayment".equals(action)) {
                handleInitiatePayment(session, request, jsonResponse);
            } else if ("paymentReturn".equals(action)) {
                handlePaymentReturn(session, request, jsonResponse);
            } else if ("paymentCancel".equals(action)) {
                handlePaymentCancel(session, request, jsonResponse);
            } else if ("getRegistrationDetails".equals(action)) {
                handleGetRegistrationDetails(session, request, jsonResponse);
            } else {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Unknown action");
            }

        } catch (Exception e) {
            e.printStackTrace();
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Server error: " + e.getMessage());
            System.err.println("Error in EventRegistrationServlet: " + e.getMessage());
        } finally {
            if (session != null && session.isOpen()) {
                try {
                    session.close();
                } catch (Exception e) {
                    System.err.println("Error closing Hibernate session: " + e.getMessage());
                }
            }
            if (!"paymentNotify".equals(request.getParameter("action")) && 
                !"downloadQRCode".equals(request.getParameter("action"))) {
                out.print(jsonResponse.toString());
                out.flush();
            }
        }
    }

    private void handleInitiateRegistration(Session session, HttpServletRequest request, JsonObject jsonResponse) {
        try {
            String eventIdStr = request.getParameter("eventId");
            String name = request.getParameter("name");
            String contactNumber = request.getParameter("contactNumber");
            String grade = request.getParameter("grade");
            String nic = request.getParameter("nic");

            System.out.println("=== INITIATE REGISTRATION ===");
            System.out.println("Event ID: " + eventIdStr);
            System.out.println("Name: " + name);
            System.out.println("Contact: " + contactNumber);
            System.out.println("Grade: " + grade);

            // Validate required fields
            if (eventIdStr == null || eventIdStr.isEmpty()) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Event ID is required");
                System.out.println("ERROR: Event ID is required");
                return;
            }
            if (name == null || name.trim().isEmpty()) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Name is required");
                System.out.println("ERROR: Name is required");
                return;
            }
            if (contactNumber == null || contactNumber.trim().isEmpty()) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Contact number is required");
                System.out.println("ERROR: Contact number is required");
                return;
            }
            if (grade == null || grade.trim().isEmpty()) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Grade is required");
                System.out.println("ERROR: Grade is required");
                return;
            }

            int eventId = Integer.parseInt(eventIdStr);

            // Check if event exists
            PortfolioEvent event = session.get(PortfolioEvent.class, eventId);
            if (event == null) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Event not found");
                System.out.println("ERROR: Event not found with ID: " + eventId);
                return;
            }

            System.out.println("Event found: " + event.getTitle());

            // Generate unique registration number
            String registrationNumber = generateUniqueRegistrationNumber(session, eventId);
            System.out.println("Generated registration number: " + registrationNumber);

            // Create registration record
            Transaction tx = session.beginTransaction();
            try {
                EventRegistration registration = new EventRegistration();
                registration.setEventId(eventId);
                registration.setRegistrationNumber(registrationNumber);
                registration.setName(name.trim());
                registration.setContactNumber(contactNumber.trim());
                registration.setGrade(grade.trim());
                registration.setNic(nic != null ? nic.trim() : null);
                registration.setPaymentStatus("PENDING");
                registration.setCreatedAt(new Date());
                registration.setUpdatedAt(new Date());

                session.save(registration);
                tx.commit();

                System.out.println("Registration saved with ID: " + registration.getId());

                jsonResponse.addProperty("success", true);
                jsonResponse.addProperty("message", "Registration initiated successfully");
                jsonResponse.addProperty("registrationId", registration.getId());
                jsonResponse.addProperty("registrationNumber", registrationNumber);
                jsonResponse.addProperty("eventTitle", event.getTitle());
                jsonResponse.addProperty("eventFee", event.getFee());

                System.out.println("Response JSON: " + jsonResponse.toString());

            } catch (Exception e) {
                tx.rollback();
                System.out.println("ERROR saving registration: " + e.getMessage());
                e.printStackTrace();
                throw e;
            }

        } catch (NumberFormatException e) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Invalid event ID");
            System.out.println("ERROR: Invalid event ID format");
        } catch (Exception e) {
            e.printStackTrace();
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error initiating registration: " + e.getMessage());
            System.out.println("ERROR: " + e.getMessage());
        }
    }

    private void handleInitiatePayment(Session session, HttpServletRequest request, JsonObject jsonResponse) throws Exception {
        String registrationIdStr = request.getParameter("registrationId");
        if (registrationIdStr == null || registrationIdStr.isEmpty()) {
            throw new Exception("Registration ID is required");
        }

        int registrationId = Integer.parseInt(registrationIdStr);

        // Get registration record
        EventRegistration registration = session.get(EventRegistration.class, registrationId);
        if (registration == null) {
            throw new Exception("Registration not found");
        }

        // Check if payment is already in progress
        if (registration.getTransactionId() != null && registration.getTransactionId().length() > 0) {
            if ("PENDING".equals(registration.getPaymentStatus())) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Payment already in progress for this registration");
                return;
            }
            if ("PAID".equals(registration.getPaymentStatus())) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "This registration has already been paid");
                return;
            }
        }

        // Get event details
        PortfolioEvent event = session.get(PortfolioEvent.class, registration.getEventId());
        if (event == null) {
            throw new Exception("Event not found");
        }

        System.out.println("Event fee from database: " + event.getFee());

        // Parse fee amount
        double amount = parseEventFee(event.getFee());
        System.out.println("Parsed amount: " + amount);
        
        // Handle free events (fee = 0 or null)
        if (amount <= 0) {
            // For free events, mark as paid immediately without payment
            Transaction tx = session.beginTransaction();
            try {
                registration.setPaymentStatus("PAID");
                registration.setAmountPaid(BigDecimal.ZERO);
                registration.setPaymentDate(new Date());
                registration.setUpdatedAt(new Date());
                
                // Generate QR code for free event
                String qrCodeData = generateQRCodeBase64(registration.getRegistrationNumber());
                registration.setQrCodeData(qrCodeData);
                
                session.update(registration);
                tx.commit();
                
                System.out.println("Free event - registration marked as PAID without payment");
                
                jsonResponse.addProperty("success", true);
                jsonResponse.addProperty("message", "Registration completed successfully (free event)");
                jsonResponse.addProperty("registrationNumber", registration.getRegistrationNumber());
                jsonResponse.addProperty("qrCodeData", qrCodeData);
                return;
            } catch (Exception e) {
                tx.rollback();
                throw new Exception("Failed to complete free registration: " + e.getMessage());
            }
        }

        // Generate order ID
        String orderId = "EVT" + System.currentTimeMillis();

        // Save order ID to registration
        Transaction tx = session.beginTransaction();
        try {
            registration.setTransactionId(orderId);
            registration.setUpdatedAt(new Date());
            registration.setPaymentStatus("PENDING");
            session.update(registration);
            tx.commit();
            System.out.println("Saved order_id to registration: " + orderId);
        } catch (Exception e) {
            tx.rollback();
            throw new Exception("Failed to save order_id: " + e.getMessage());
        }

        // Format amount
        String formattedAmount = new DecimalFormat("0.00").format(amount);

        // Get base URL
        String baseUrl = getBaseUrl();

        // Generate PayHere hash
        String merchantId = payhereConfig.getMerchantId();
        String merchantSecret = payhereConfig.getMerchantSecret();
        String merchantSecretMd5 = PayHere.generateMD5UpperCase(merchantSecret);
        String hashString = merchantId + orderId + formattedAmount + "LKR" + merchantSecretMd5;
        String hash = PayHere.generateMD5UpperCase(hashString);

        System.out.println("=== PAYHERE HASH CALCULATION FOR EVENT REGISTRATION ===");
        System.out.println("Merchant ID: " + merchantId);
        System.out.println("Order ID: " + orderId);
        System.out.println("Amount: " + formattedAmount);
        System.out.println("Final Hash: " + hash);

        // Create payment data
        JsonObject paymentData = new JsonObject();
        paymentData.addProperty("sandbox", payhereConfig.isSandbox());
        paymentData.addProperty("checkout_url", payhereConfig.getCheckoutUrl());
        paymentData.addProperty("merchant_id", merchantId);
        paymentData.addProperty("return_url", baseUrl + "/EventRegistrationServlet?action=paymentReturn&registrationId=" + registrationId);
        paymentData.addProperty("cancel_url", baseUrl + "/EventRegistrationServlet?action=paymentCancel&registrationId=" + registrationId);
        paymentData.addProperty("notify_url", baseUrl + "/EventRegistrationServlet?action=paymentNotify");

        paymentData.addProperty("order_id", orderId);
        paymentData.addProperty("items", "Event Registration - " + event.getTitle());
        paymentData.addProperty("amount", formattedAmount);
        paymentData.addProperty("currency", "LKR");
        paymentData.addProperty("hash", hash);

        paymentData.addProperty("first_name", registration.getName());
        paymentData.addProperty("last_name", "");
        paymentData.addProperty("email", "student@example.com");
        paymentData.addProperty("phone", registration.getContactNumber());
        paymentData.addProperty("address", "Sri Lanka");
        paymentData.addProperty("city", "Colombo");
        paymentData.addProperty("country", "Sri Lanka");

        // Custom parameters
        paymentData.addProperty("custom_1", String.valueOf(registrationId));
        paymentData.addProperty("custom_2", registration.getRegistrationNumber());

        jsonResponse.addProperty("success", true);
        jsonResponse.add("paymentData", paymentData);
    }

    private void handlePaymentNotify(Session session, HttpServletRequest request, HttpServletResponse response) throws Exception {
        response.setHeader("ngrok-skip-browser-warning", "true");
        PrintWriter out = response.getWriter();

        String merchantId = request.getParameter("merchant_id");
        String orderId = request.getParameter("order_id");
        String paymentStatus = request.getParameter("status_code");
        String payhereAmount = request.getParameter("payhere_amount");
        String payhereCurrency = request.getParameter("payhere_currency");
        String md5sig = request.getParameter("md5sig");
        String customRegistrationId = request.getParameter("custom_1");
        String customRegistrationNumber = request.getParameter("custom_2");

        System.out.println("=== EVENT PAYMENT NOTIFICATION ===");
        System.out.println("Order ID: " + orderId);
        System.out.println("Status Code: " + paymentStatus);
        System.out.println("Registration ID: " + customRegistrationId);
        System.out.println("Registration Number: " + customRegistrationNumber);

        if (merchantId == null || !merchantId.equals(payhereConfig.getMerchantId())) {
            System.err.println("Invalid merchant_id");
            out.print("OK");
            return;
        }

        String callbackCurrency = payhereCurrency != null ? payhereCurrency : "LKR";
        String merchantSecretMd5 = PayHere.generateMD5UpperCase(payhereConfig.getMerchantSecret());
        String expectedHash = PayHere.generateMD5UpperCase(
                merchantId + orderId + payhereAmount + callbackCurrency + paymentStatus + merchantSecretMd5);

        if (md5sig == null || !expectedHash.equals(md5sig)) {
            System.err.println("MD5 Signature validation FAILED");
            out.print("OK");
            return;
        }

        System.out.println("MD5 Signature validated successfully");

        if ("2".equals(paymentStatus)) {
            Transaction tx = session.beginTransaction();
            try {
                int registrationId = Integer.parseInt(customRegistrationId);
                EventRegistration registration = session.get(EventRegistration.class, registrationId);

                if (registration == null) {
                    System.err.println("Registration not found: " + registrationId);
                    tx.rollback();
                    out.print("OK");
                    return;
                }

                // Update registration
                registration.setPaymentStatus("PAID");
                registration.setAmountPaid(new BigDecimal(payhereAmount));
                registration.setPaymentDate(new Date());
                registration.setTransactionId(orderId);
                registration.setUpdatedAt(new Date());

                // Generate QR code
                String qrCodeData = generateQRCodeBase64(registration.getRegistrationNumber());
                registration.setQrCodeData(qrCodeData);

                session.update(registration);
                tx.commit();

                System.out.println("Payment recorded successfully for registration: " + registration.getRegistrationNumber());

            } catch (Exception e) {
                if (tx != null) tx.rollback();
                System.err.println("Error recording payment: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("Payment failed with status: " + paymentStatus);
            
            // Handle failed/cancelled payments
            if ("0".equals(paymentStatus) || "-1".equals(paymentStatus) || "-2".equals(paymentStatus) || "-3".equals(paymentStatus)) {
                Transaction tx = session.beginTransaction();
                try {
                    int registrationId = Integer.parseInt(customRegistrationId);
                    EventRegistration registration = session.get(EventRegistration.class, registrationId);

                    if (registration != null) {
                        registration.setPaymentStatus("FAILED");
                        registration.setUpdatedAt(new Date());
                        session.update(registration);
                        System.out.println("Registration status updated to FAILED: " + registration.getRegistrationNumber());
                    }
                    
                    tx.commit();
                } catch (Exception e) {
                    if (tx != null) tx.rollback();
                    System.err.println("Error handling failed payment: " + e.getMessage());
                }
            }
        }

        out.print("OK");
    }

    private void handlePaymentReturn(Session session, HttpServletRequest request, JsonObject jsonResponse) {
        try {
            String registrationIdStr = request.getParameter("registrationId");
            System.out.println("=== PAYMENT RETURN HANDLER ===");
            System.out.println("Registration ID: " + registrationIdStr);

            if (registrationIdStr != null && !registrationIdStr.isEmpty()) {
                int registrationId = Integer.parseInt(registrationIdStr);
                EventRegistration registration = session.get(EventRegistration.class, registrationId);

                if (registration != null && "PAID".equals(registration.getPaymentStatus())) {
                    jsonResponse.addProperty("success", true);
                    jsonResponse.addProperty("message", "Payment completed successfully");
                    jsonResponse.addProperty("registrationNumber", registration.getRegistrationNumber());
                    jsonResponse.addProperty("qrCodeData", registration.getQrCodeData());
                    return;
                }
            }

            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Payment processing. Please check your email for confirmation.");

        } catch (Exception e) {
            e.printStackTrace();
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error processing payment return: " + e.getMessage());
        }
    }

    private void handlePaymentCancel(Session session, HttpServletRequest request, JsonObject jsonResponse) {
        try {
            String registrationIdStr = request.getParameter("registrationId");
            System.out.println("=== PAYMENT CANCEL HANDLER ===");

            if (registrationIdStr != null && !registrationIdStr.isEmpty()) {
                int registrationId = Integer.parseInt(registrationIdStr);
                EventRegistration registration = session.get(EventRegistration.class, registrationId);

                if (registration != null && "PENDING".equals(registration.getPaymentStatus())) {
                    Transaction tx = session.beginTransaction();
                    try {
                        registration.setPaymentStatus("CANCELLED");
                        registration.setUpdatedAt(new Date());
                        session.update(registration);
                        tx.commit();
                        System.out.println("Registration status updated to CANCELLED");
                    } catch (Exception e) {
                        if (tx != null) tx.rollback();
                        System.err.println("Error updating status: " + e.getMessage());
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

    private void handleGetRegistrationDetails(Session session, HttpServletRequest request, JsonObject jsonResponse) {
        try {
            String registrationNumber = request.getParameter("registrationNumber");
            if (registrationNumber == null || registrationNumber.isEmpty()) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Registration number is required");
                return;
            }

            Query<EventRegistration> query = session.createQuery(
                    "FROM EventRegistration WHERE registrationNumber = :regNum", EventRegistration.class);
            query.setParameter("regNum", registrationNumber);
            EventRegistration registration = query.uniqueResult();

            if (registration == null) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Registration not found");
                return;
            }

            PortfolioEvent event = session.get(PortfolioEvent.class, registration.getEventId());

            JsonObject details = new JsonObject();
            details.addProperty("registrationNumber", registration.getRegistrationNumber());
            details.addProperty("name", registration.getName());
            details.addProperty("contactNumber", registration.getContactNumber());
            details.addProperty("grade", registration.getGrade());
            details.addProperty("nic", registration.getNic());
            details.addProperty("paymentStatus", registration.getPaymentStatus());
            details.addProperty("eventTitle", event != null ? event.getTitle() : "Unknown");
            details.addProperty("eventDate", event != null ? event.getDate() : "");
            details.addProperty("eventLocation", event != null ? event.getLocation() : "");
            details.addProperty("amountPaid", registration.getAmountPaid() != null ? registration.getAmountPaid().toString() : "0.00");
            details.addProperty("qrCodeData", registration.getQrCodeData());

            jsonResponse.addProperty("success", true);
            jsonResponse.add("details", details);

        } catch (Exception e) {
            e.printStackTrace();
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error fetching registration details: " + e.getMessage());
        }
    }

    private void handleDownloadQRCode(Session session, HttpServletRequest request, HttpServletResponse response) {
        try {
            String registrationNumber = request.getParameter("registrationNumber");
            if (registrationNumber == null || registrationNumber.isEmpty()) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Registration number is required");
                return;
            }

            Query<EventRegistration> query = session.createQuery(
                    "FROM EventRegistration WHERE registrationNumber = :regNum", EventRegistration.class);
            query.setParameter("regNum", registrationNumber);
            EventRegistration registration = query.uniqueResult();

            if (registration == null || registration.getQrCodeData() == null) {
                response.sendError(HttpServletResponse.SC_NOT_FOUND, "QR code not found");
                return;
            }

            // Decode base64 and send as image
            String base64Data = registration.getQrCodeData();
            String[] parts = base64Data.split(",");
            byte[] imageBytes = Base64.getDecoder().decode(parts[1]);

            response.setContentType("image/png");
            response.setHeader("Content-Disposition", "attachment; filename=\"qr_" + registrationNumber + ".png\"");
            response.setContentLength(imageBytes.length);
            response.getOutputStream().write(imageBytes);
            response.getOutputStream().flush();

        } catch (Exception e) {
            e.printStackTrace();
            try {
                response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error generating QR code");
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        }
    }

    private String generateUniqueRegistrationNumber(Session session, int eventId) {
        // Format: EVT + EventID + Random 6 digits
        Random random = new Random();
        String registrationNumber;
        boolean isUnique = false;

        do {
            int randomDigits = 100000 + random.nextInt(900000);
            registrationNumber = REGISTRATION_NUMBER_PREFIX + eventId + randomDigits;

            Query<Long> query = session.createQuery(
                    "SELECT COUNT(*) FROM EventRegistration WHERE registrationNumber = :regNum", Long.class);
            query.setParameter("regNum", registrationNumber);
            Long count = query.uniqueResult();
            isUnique = count == 0;

        } while (!isUnique);

        return registrationNumber;
    }

    private String generateQRCodeBase64(String registrationNumber) throws WriterException, IOException {
        BitMatrix bitMatrix = new com.google.zxing.MultiFormatWriter()
                .encode(registrationNumber, BarcodeFormat.QR_CODE, 300, 300);

        BufferedImage bufferedImage = MatrixToImageWriter.toBufferedImage(bitMatrix);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(bufferedImage, "png", baos);
        byte[] imageBytes = baos.toByteArray();

        return "data:image/png;base64," + Base64.getEncoder().encodeToString(imageBytes);
    }

    private double parseEventFee(String fee) {
        if (fee == null || fee.trim().isEmpty()) {
            return 0.0;
        }

        // Remove currency symbols and extract numeric value
        String cleaned = fee.replaceAll("[^0-9.]", "").trim();
        try {
            return Double.parseDouble(cleaned);
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }

    private String getBaseUrl() {
        return payhereConfig.getBaseUrl();
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
