package com.nextlvlict.nextlvlict.controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.nextlvlict.nextlvlict.hibernate.*;
import com.nextlvlict.nextlvlict.service.R2StorageService;
import com.nextlvlict.nextlvlict.util.AuthorizationUtil;
import com.nextlvlict.nextlvlict.util.FileUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.query.Query;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@WebServlet(name = "OfflinePayment", urlPatterns = {"/OfflinePayment"})
@MultipartConfig(
        fileSizeThreshold = 1024 * 1024, // 1MB
        maxFileSize = 1024 * 1024 * 10,   // 10MB
        maxRequestSize = 1024 * 1024 * 50 // 50MB
)
public class OfflinePayment extends HttpServlet {

    private final Gson gson = new Gson();
    private final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }

    private void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String action = request.getParameter("action");
        JsonObject jsonResponse = new JsonObject();
        response.setContentType("application/json");

        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            if ("getEligibleFees".equals(action)) {
                handleGetEligibleFees(session, request, jsonResponse);
            } else if ("submitSlip".equals(action)) {
                handleSubmitSlip(session, request, jsonResponse);
            } else if ("getMySubmissions".equals(action)) {
                handleGetMySubmissions(session, request, jsonResponse);
            } else if ("viewSlip".equals(action)) {
                handleViewSlip(session, request, response);
                return; // Response handled
            } else if ("getReviewQueue".equals(action)) {
                handleGetReviewQueue(session, request, jsonResponse);
            } else if ("getSubmissionDetails".equals(action)) {
                handleGetSubmissionDetails(session, request, jsonResponse);
            } else if ("approve".equals(action)) {
                handleApprove(session, request, jsonResponse);
            } else if ("reject".equals(action)) {
                handleReject(session, request, jsonResponse);
            } else {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Invalid action");
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
        } catch (Exception e) {
            e.printStackTrace();
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }

        if (!response.isCommitted()) {
            response.getWriter().write(gson.toJson(jsonResponse));
        }
    }

    private void handleGetEligibleFees(Session session, HttpServletRequest request, JsonObject jsonResponse) {
        String studentId = getStudentId(request);
        
        // If not authenticated via session, check for studentId in parameters
        if (studentId == null) {
            studentId = request.getParameter("studentId");
        }

        if (studentId == null) {
            jsonResponse.addProperty("success", true);
            jsonResponse.add("fees", new JsonArray());
            jsonResponse.addProperty("message", "No student ID provided; returning empty fees list");
            return;
        }

        // Get unpaid fees that don't have a pending offline submission
        String hql = "SELECT f FROM StudentMonthlyFees f " +
                "WHERE f.student.id = :studentId " +
                "AND f.status.id = :pendingStatus " + // Only PENDING (not yet made)
                "AND f.id NOT IN (SELECT s.monthlyFee.id FROM OfflinePaymentSubmission s WHERE s.submissionStatus = 'PENDING_REVIEW')";
        
        Query<StudentMonthlyFees> query = session.createQuery(hql, StudentMonthlyFees.class);
        query.setParameter("studentId", studentId);
        query.setParameter("pendingStatus", PaymentStatus.PENDING);
        List<StudentMonthlyFees> fees = query.getResultList();

        JsonArray feesArray = new JsonArray();
        for (StudentMonthlyFees fee : fees) {
            JsonObject feeJson = new JsonObject();
            feeJson.addProperty("id", fee.getId());
            feeJson.addProperty("monthYear", fee.getMonthYear());
            feeJson.addProperty("amount", fee.getFeeAmount());
            feeJson.addProperty("grade", fee.getGrade().getName());
            feeJson.addProperty("classType", fee.getClassType().getName());
            feeJson.addProperty("status", fee.getStatus().getValue());
            feesArray.add(feeJson);
        }

        jsonResponse.addProperty("success", true);
        jsonResponse.add("fees", feesArray);
    }

    private void handleSubmitSlip(Session session, HttpServletRequest request, JsonObject jsonResponse) throws Exception {
        String studentId = getStudentId(request);

        // If not authenticated via session, check for studentId in parameters
        if (studentId == null) {
            Part studentIdPart = request.getPart("studentId");
            if (studentIdPart != null) {
                studentId = new String(studentIdPart.getInputStream().readAllBytes()).trim();
            }
        }

        if (studentId == null) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Authentication required");
            return;
        }

        Part monthlyFeeIdPart = request.getPart("monthlyFeeId");
        Part paymentMethodPart = request.getPart("paymentMethod");
        Part amountPaidPart = request.getPart("amountPaid");
        Part paymentDatePart = request.getPart("paymentDate");
        Part transactionReferencePart = request.getPart("transactionReference");
        Part bankNamePart = request.getPart("bankName");

        int monthlyFeeId = Integer.parseInt(new String(monthlyFeeIdPart.getInputStream().readAllBytes()).trim());
        String paymentMethod = new String(paymentMethodPart.getInputStream().readAllBytes()).trim();
        double amountPaid = Double.parseDouble(new String(amountPaidPart.getInputStream().readAllBytes()).trim());
        Date paymentDate = dateFormat.parse(new String(paymentDatePart.getInputStream().readAllBytes()).trim());
        String transactionReference = transactionReferencePart != null ? new String(transactionReferencePart.getInputStream().readAllBytes()).trim() : null;
        String bankName = bankNamePart != null ? new String(bankNamePart.getInputStream().readAllBytes()).trim() : null;

        Part filePart = request.getPart("paymentSlip");
        if (filePart == null || filePart.getSize() == 0) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Payment slip file is required");
            return;
        }

        // Validate file
        FileUtil.ValidationResult validation = FileUtil.validatePaymentSlip(
                filePart.getInputStream(),
                filePart.getContentType(),
                filePart.getSize()
        );

        if (!validation.isValid()) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", validation.getMessage());
            return;
        }

        Transaction tx = null;
        try {
            tx = session.beginTransaction();

            Students student = session.get(Students.class, studentId);
            StudentMonthlyFees fee = session.get(StudentMonthlyFees.class, monthlyFeeId);

            if (fee == null || !fee.getStudent().getId().equals(studentId)) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Invalid fee record");
                return;
            }

            // Check if already paid or has pending submission
            if (fee.isPaid()) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Fee is already paid");
                return;
            }

            Query<Long> pendingQuery = session.createQuery(
                    "SELECT COUNT(s) FROM OfflinePaymentSubmission s WHERE s.monthlyFee.id = :feeId AND s.submissionStatus = 'PENDING_REVIEW'", 
                    Long.class);
            pendingQuery.setParameter("feeId", monthlyFeeId);
            if (pendingQuery.uniqueResult() > 0) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "A submission is already pending for this fee");
                return;
            }

            // Upload to R2
            R2StorageService r2Service = R2StorageService.getInstance();
            String format = validation.getDetectedType();
            String objectKey = r2Service.generatePaymentSlipKey(studentId + "_" + monthlyFeeId + "_" + System.currentTimeMillis(), format);
            
            r2Service.uploadFile(objectKey, filePart.getInputStream(), filePart.getSize(), filePart.getContentType());

            // Create submission record
            OfflinePaymentSubmission submission = new OfflinePaymentSubmission();
            submission.setStudent(student);
            submission.setMonthlyFee(fee);
            submission.setPaymentMethod(paymentMethod);
            submission.setAmountPaid(amountPaid);
            submission.setPaymentDate(paymentDate);
            submission.setTransactionReference(transactionReference);
            submission.setBankName(bankName);
            submission.setR2ObjectKey(objectKey);
            submission.setR2FileName(filePart.getSubmittedFileName());
            submission.setR2FileSize(filePart.getSize());
            submission.setR2ContentType(filePart.getContentType());
            submission.setSubmissionStatus("PENDING_REVIEW");
            submission.setSubmittedAt(new Date());

            session.save(submission);
            tx.commit();

            jsonResponse.addProperty("success", true);
            jsonResponse.addProperty("message", "Payment slip submitted successfully for review");

        } catch (Exception e) {
            if (tx != null) tx.rollback();
            throw e;
        }
    }

    private void handleGetMySubmissions(Session session, HttpServletRequest request, JsonObject jsonResponse) {
        String studentId = getStudentId(request);
        if (studentId == null) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Authentication required");
            return;
        }

        Query<OfflinePaymentSubmission> query = session.createQuery(
                "FROM OfflinePaymentSubmission s WHERE s.student.id = :studentId ORDER BY s.submittedAt DESC", 
                OfflinePaymentSubmission.class);
        query.setParameter("studentId", studentId);
        List<OfflinePaymentSubmission> submissions = query.getResultList();

        JsonArray subsArray = new JsonArray();
        for (OfflinePaymentSubmission s : submissions) {
            subsArray.add(serializeSubmission(s));
        }

        jsonResponse.addProperty("success", true);
        jsonResponse.add("submissions", subsArray);
    }

    private void handleViewSlip(Session session, HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Authenticate - either student owning the slip or an admin
        String studentId = getStudentId(request);
        boolean isAdmin = isAdmin(request);
        
        if (studentId == null && !isAdmin) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String submissionIdStr = request.getParameter("submissionId");
        if (submissionIdStr == null) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        int submissionId = Integer.parseInt(submissionIdStr);
        OfflinePaymentSubmission submission = session.get(OfflinePaymentSubmission.class, submissionId);

        if (submission == null) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        // Check ownership if not admin
        if (!isAdmin && !submission.getStudent().getId().equals(studentId)) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN);
            return;
        }

        R2StorageService r2Service = R2StorageService.getInstance();
        try (InputStream is = r2Service.downloadFile(submission.getR2ObjectKey());
             OutputStream os = response.getOutputStream()) {
            
            response.setContentType(submission.getR2ContentType());
            response.setHeader("Content-Disposition", "inline; filename=\"" + submission.getR2FileName() + "\"");
            
            byte[] buffer = new byte[8192];
            int bytesRead;
            while ((bytesRead = is.read(buffer)) != -1) {
                os.write(buffer, 0, bytesRead);
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    private void handleGetReviewQueue(Session session, HttpServletRequest request, JsonObject jsonResponse) {
        if (!isAdmin(request)) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Admin access required");
            return;
        }

        String status = request.getParameter("status");
        String studentId = request.getParameter("studentId");

        StringBuilder hql = new StringBuilder("FROM OfflinePaymentSubmission s WHERE 1=1");
        if (status != null && !status.isEmpty() && !"all".equals(status)) {
            hql.append(" AND s.submissionStatus = :status");
        }
        if (studentId != null && !studentId.isEmpty()) {
            hql.append(" AND s.student.id LIKE :studentId");
        }
        hql.append(" ORDER BY s.submittedAt ASC");

        Query<OfflinePaymentSubmission> query = session.createQuery(hql.toString(), OfflinePaymentSubmission.class);
        if (status != null && !status.isEmpty() && !"all".equals(status)) {
            query.setParameter("status", status);
        }
        if (studentId != null && !studentId.isEmpty()) {
            query.setParameter("studentId", "%" + studentId + "%");
        }

        List<OfflinePaymentSubmission> submissions = query.getResultList();
        JsonArray subsArray = new JsonArray();
        for (OfflinePaymentSubmission s : submissions) {
            subsArray.add(serializeSubmission(s));
        }

        jsonResponse.addProperty("success", true);
        jsonResponse.add("submissions", subsArray);
    }

    private void handleGetSubmissionDetails(Session session, HttpServletRequest request, JsonObject jsonResponse) {
        if (!isAdmin(request)) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Admin access required");
            return;
        }

        int submissionId = Integer.parseInt(request.getParameter("submissionId"));
        OfflinePaymentSubmission submission = session.get(OfflinePaymentSubmission.class, submissionId);

        if (submission == null) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Submission not found");
            return;
        }

        jsonResponse.addProperty("success", true);
        jsonResponse.add("submission", serializeSubmission(submission));
    }

    private void handleApprove(Session session, HttpServletRequest request, JsonObject jsonResponse) {
        if (!isAdmin(request)) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Admin access required");
            return;
        }

        int submissionId = Integer.parseInt(request.getParameter("submissionId"));
        int adminUserId = getAdminUserId(request);

        Transaction tx = null;
        try {
            tx = session.beginTransaction();

            OfflinePaymentSubmission submission = session.get(OfflinePaymentSubmission.class, submissionId);
            if (submission == null || !"PENDING_REVIEW".equals(submission.getSubmissionStatus())) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Invalid submission or already processed");
                return;
            }

            StudentMonthlyFees fee = submission.getMonthlyFee();
            if (fee.isPaid()) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Fee is already marked as paid");
                return;
            }

            Admin_Users admin = session.get(Admin_Users.class, adminUserId);
            PaymentStatus paidStatus = session.get(PaymentStatus.class, PaymentStatus.PAID); // ID 2 = PAID

            // 1. Create payment transaction
            PaymentTransactions transaction = new PaymentTransactions();
            transaction.setStudent(submission.getStudent());
            transaction.setAmount(submission.getAmountPaid());
            transaction.setTransactionId("OFFLINE_" + submission.getId() + "_" + submission.getTransactionReference());
            transaction.setCreatedAt(new Date());
            transaction.setVerificationStatus("verified");
            transaction.setDescription("Offline Payment: " + submission.getPaymentMethod() + " (" + submission.getBankName() + ")");
            session.save(transaction);

            // 2. Update monthly fee
            fee.setStatus(paidStatus);
            fee.setPaidDate(new Date());
            fee.setTransactionId(transaction.getTransactionId());
            session.update(fee);

            // 3. Update submission status
            submission.setSubmissionStatus("APPROVED");
            submission.setReviewedAt(new Date());
            submission.setReviewedBy(admin);
            submission.setPaymentTransaction(transaction);
            session.update(submission);

            tx.commit();
            jsonResponse.addProperty("success", true);
            jsonResponse.addProperty("message", "Submission approved successfully");

        } catch (Exception e) {
            if (tx != null) tx.rollback();
            e.printStackTrace();
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error: " + e.getMessage());
        }
    }

    private void handleReject(Session session, HttpServletRequest request, JsonObject jsonResponse) {
        if (!isAdmin(request)) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Admin access required");
            return;
        }

        int submissionId = Integer.parseInt(request.getParameter("submissionId"));
        String reason = request.getParameter("reason");
        int adminUserId = getAdminUserId(request);

        if (reason == null || reason.trim().isEmpty()) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Rejection reason is required");
            return;
        }

        Transaction tx = null;
        try {
            tx = session.beginTransaction();

            OfflinePaymentSubmission submission = session.get(OfflinePaymentSubmission.class, submissionId);
            if (submission == null || !"PENDING_REVIEW".equals(submission.getSubmissionStatus())) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Invalid submission or already processed");
                return;
            }

            Admin_Users admin = session.get(Admin_Users.class, adminUserId);

            submission.setSubmissionStatus("REJECTED");
            submission.setRejectionReason(reason);
            submission.setReviewedAt(new Date());
            submission.setReviewedBy(admin);
            session.update(submission);

            tx.commit();
            jsonResponse.addProperty("success", true);
            jsonResponse.addProperty("message", "Submission rejected");

        } catch (Exception e) {
            if (tx != null) tx.rollback();
            e.printStackTrace();
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error: " + e.getMessage());
        }
    }

    private JsonObject serializeSubmission(OfflinePaymentSubmission s) {
        JsonObject obj = new JsonObject();
        obj.addProperty("id", s.getId());
        obj.addProperty("studentId", s.getStudent().getId());
        obj.addProperty("studentName", s.getStudent().getFirst_name() + " " + s.getStudent().getLast_name());
        obj.addProperty("studentEmail", s.getStudent().getEmail());
        obj.addProperty("studentMobile", s.getStudent().getMobile());
        
        StudentMonthlyFees fee = s.getMonthlyFee();
        obj.addProperty("monthlyFeeId", fee.getId());
        obj.addProperty("gradeName", fee.getGrade().getName());
        obj.addProperty("classTypeName", fee.getClassType().getName());
        obj.addProperty("monthYear", fee.getMonthYear());
        obj.addProperty("feeAmount", fee.getFeeAmount());
        
        obj.addProperty("paymentMethod", s.getPaymentMethod());
        obj.addProperty("amountPaid", s.getAmountPaid());
        obj.addProperty("paymentDate", dateFormat.format(s.getPaymentDate()));
        obj.addProperty("transactionReference", s.getTransactionReference());
        obj.addProperty("bankName", s.getBankName());
        obj.addProperty("submissionStatus", s.getSubmissionStatus());
        obj.addProperty("rejectionReason", s.getRejectionReason());
        obj.addProperty("submittedAt", s.getSubmittedAt().toString());
        
        if (s.getReviewedAt() != null) {
            obj.addProperty("reviewedAt", s.getReviewedAt().toString());
        }
        if (s.getReviewedBy() != null) {
            obj.addProperty("reviewedBy", s.getReviewedBy().getUsername());
        }
        
        obj.addProperty("r2FileName", s.getR2FileName());
        obj.addProperty("r2FileSize", s.getR2FileSize());
        obj.addProperty("r2ContentType", s.getR2ContentType());
        
        // Add public CDN URL for direct access
        R2StorageService r2Service = R2StorageService.getInstance();
        obj.addProperty("publicUrl", r2Service.getPublicUrl(s.getR2ObjectKey()));
        
        return obj;
    }

    private String getStudentId(HttpServletRequest request) {
        return AuthorizationUtil.getStudentId(request);
    }

    private boolean isAdmin(HttpServletRequest request) {
        return AuthorizationUtil.isAdminAuthenticated(request);
    }

    private int getAdminUserId(HttpServletRequest request) {
        Integer adminId = AuthorizationUtil.getAdminId(request);
        return adminId != null ? adminId : 0;
    }
}
