package com.nextlvlict.nextlvlict.controller;

import com.google.gson.Gson;
import com.nextlvlict.nextlvlict.hibernate.*;
import com.nextlvlict.nextlvlict.hibernate.ClassType;
import com.nextlvlict.nextlvlict.service.MonthlyFeeGenerationService;
import com.nextlvlict.nextlvlict.util.AuthorizationUtil;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.query.Query;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.*;

@WebServlet(name = "StudentManagement", urlPatterns = {"/StudentManagement"})
public class StudentManagement extends HttpServlet {

    private Gson gson = new Gson();

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String action = request.getParameter("action");

        // Action generateStudentReport is handled separately as it returns binary data
        if ("generateStudentReport".equals(action)) {
            if (!AuthorizationUtil.requireAdminAuthentication(request, response)) {
                return;
            }
            generateStudentReport(request, response);
            return;
        }

        response.setContentType("application/json;charset=UTF-8");
        PrintWriter out = response.getWriter();

        try {
            // Allow student portal actions without authentication
            // Require admin authentication for all other actions
            if (!"getStudentDetails".equals(action) && !"getStudentClassTypes".equals(action) && !"registerForClassType".equals(action)) {
                if (!AuthorizationUtil.requireAdminAuthentication(request, response)) {
                    return;
                }
            }

            if ("getAllStudents".equals(action)) {
                getAllStudents(request, response);

            } else if ("getStudentDetails".equals(action)) {
                getStudentDetails(request, response);

            } else if ("updateStudentStatus".equals(action)) {
                updateStudentStatus(request, response);

            } else if ("getRecordingRequests".equals(action)) {
                getRecordingRequests(request, response);

            } else if ("updateRecordingRequestStatus".equals(action)) {
                updateRecordingRequestStatus(request, response);

            } else if ("updateStudentClassType".equals(action)) {
                updateStudentClassType(request, response);

            } else if ("getStudentClassTypes".equals(action)) {
                getStudentClassTypes(request, response);

            } else if ("registerForClassType".equals(action)) {
                registerForClassType(request, response);

            } else if ("issueFreeCard".equals(action)) {
                issueFreeCard(request, response);

            } else if ("removeFreeCard".equals(action)) {
                removeFreeCard(request, response);

            } else {
                out.print(gson.toJson(
                        Collections.singletonMap("error", "Invalid action")
                ));
            }

        } catch (Exception e) {

            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);

            out.print(gson.toJson(
                    Collections.singletonMap("error", e.getMessage())
            ));
        }
    }

    private void getAllStudents(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Session session = HibernateUtil.getSessionFactory().openSession();
        PrintWriter out = response.getWriter();
        
        try {
            String gradeFilter = request.getParameter("gradeFilter");
            String statusFilter = request.getParameter("statusFilter");
            String searchTerm = request.getParameter("searchTerm");

            // Build JPA Criteria query with filters
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Students> cq = cb.createQuery(Students.class);
            Root<Students> root = cq.from(Students.class);
            List<Predicate> predicates = new ArrayList<>();

            // Apply grade filter
            if (gradeFilter != null && !gradeFilter.isEmpty()) {
                predicates.add(cb.equal(root.get("grade").get("id"), Integer.parseInt(gradeFilter)));
            }

            // Apply status filter
            if (statusFilter != null && !statusFilter.isEmpty()) {
                boolean isActive = "active".equals(statusFilter);
                predicates.add(cb.equal(root.get("is_active"), isActive ? 1 : 0));
            }

            // Apply search term filter
            if (searchTerm != null && !searchTerm.isEmpty()) {
                String searchLower = "%" + searchTerm.toLowerCase() + "%";
                predicates.add(cb.or(
                    cb.like(cb.lower(root.get("first_name")), searchLower),
                    cb.like(cb.lower(root.get("last_name")), searchLower),
                    cb.like(cb.lower(root.get("email")), searchLower),
                    cb.like(cb.lower(root.get("id")), searchLower)
                ));
            }

            if (!predicates.isEmpty()) {
                cq.where(cb.and(predicates.toArray(new Predicate[0])));
            }

            Query<Students> studentsQuery = session.createQuery(cq);
            List<Students> filteredStudents = studentsQuery.getResultList();

            // Create response with student details
            List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
            for (Students student : filteredStudents) {
                Map<String, Object> studentData = new HashMap<String, Object>();
                studentData.put("id", student.getId());
                studentData.put("firstName", student.getFirst_name());
                studentData.put("lastName", student.getLast_name());
                studentData.put("email", student.getEmail());
                studentData.put("mobile", student.getMobile());
                studentData.put("isActive", student.getIs_active() == 1);
                studentData.put("grade", student.getGrade() != null ? student.getGrade().getName() : "N/A");
                studentData.put("gradeId", student.getGrade() != null ? student.getGrade().getId() : null);
                
                // Get recording request counts using separate queries
                // Get recording requests for this student using JPA Criteria
                CriteriaQuery<Recording_Request> rq = cb.createQuery(Recording_Request.class);
                Root<Recording_Request> rroot = rq.from(Recording_Request.class);
                rq.where(cb.equal(rroot.get("student").get("id"), student.getId()));
                Query<Recording_Request> reqQuery = session.createQuery(rq);
                List<Recording_Request> studentRequests = reqQuery.getResultList();
                int totalRequests = studentRequests.size();
                int approvedRequests = 0;
                int pendingRequests = 0;
                
                for (Recording_Request req : studentRequests) {
                    if (req.getRecording_status() != null) {
                        if (req.getRecording_status().getId() == 2) {
                            approvedRequests++;
                        } else if (req.getRecording_status().getId() == 1) {
                            pendingRequests++;
                        }
                    }
                }
                
                studentData.put("totalRecordingRequests", totalRequests);
                studentData.put("approvedRecordingRequests", approvedRequests);
                studentData.put("pendingRecordingRequests", pendingRequests);
                
                // Calculate payment status based on monthly fees
                CriteriaQuery<StudentMonthlyFees> mq = cb.createQuery(StudentMonthlyFees.class);
                Root<StudentMonthlyFees> mroot = mq.from(StudentMonthlyFees.class);
                mq.where(cb.equal(mroot.get("student").get("id"), student.getId()));
                Query<StudentMonthlyFees> monthlyQuery = session.createQuery(mq);
                List<StudentMonthlyFees> fees = monthlyQuery.getResultList();
                boolean hasUnpaidFees = fees.stream().anyMatch(fee -> !fee.isPaid());
                studentData.put("paymentStatus", hasUnpaidFees ? "unpaid" : "paid");
                
                result.add(studentData);
            }

            out.print(gson.toJson(result));
            
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(Collections.singletonMap("error", "Error retrieving students: " + e.getMessage())));
        } finally {
            session.close();
        }
    }

    private void getStudentDetails(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Session session = HibernateUtil.getSessionFactory().openSession();
        PrintWriter out = response.getWriter();
        
        try {
            String studentId = request.getParameter("studentId");
            Students student = (Students) session.get(Students.class, studentId);

            if (student == null) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.print(gson.toJson(Collections.singletonMap("error", "Student not found")));
                return;
            }
            
            Map<String, Object> studentDetails = new HashMap<String, Object>();
            studentDetails.put("id", student.getId());
            studentDetails.put("firstName", student.getFirst_name());
            studentDetails.put("lastName", student.getLast_name());
            studentDetails.put("email", student.getEmail());
            studentDetails.put("mobile", student.getMobile());
            studentDetails.put("isActive", student.getIs_active() == 1);
            studentDetails.put("grade", student.getGrade() != null ? student.getGrade().getName() : "N/A");
            studentDetails.put("gradeId", student.getGrade() != null ? student.getGrade().getId() : null);
            studentDetails.put("createdAt", student.getCreated_at());
            studentDetails.put("dateOfBirth", student.getDate_of_birth());
            studentDetails.put("school", student.getSchool());
            studentDetails.put("nic", student.getNic());
            studentDetails.put("classType", student.getClassType() != null ? student.getClassType().getName() : "N/A");
            studentDetails.put("classTypeId", student.getClassType() != null ? student.getClassType().getId() : null);
            studentDetails.put("freeCard", student.getFree_card() == 1);

            // Get address details if available
            if (student.getAddress() != null) {
                Map<String, Object> addressData = new HashMap<String, Object>();
                String street = student.getAddress().getLine1();
                if (student.getAddress().getLine2() != null && !student.getAddress().getLine2().isEmpty()) {
                    street += ", " + student.getAddress().getLine2();
                }
                addressData.put("street", street);
                addressData.put("city", student.getAddress().getCity());
                addressData.put("district", student.getAddress().getDistricts() != null ? student.getAddress().getDistricts().getName() : "N/A");
                addressData.put("province", student.getAddress().getProvinces() != null ? student.getAddress().getProvinces().getName() : "N/A");
                studentDetails.put("address", addressData);
            }
            
            // Get recording requests with details using JPA Criteria
            List<Map<String, Object>> recordingRequests = new ArrayList<Map<String, Object>>();
            CriteriaBuilder cbReq = session.getCriteriaBuilder();
            CriteriaQuery<Recording_Request> rq = cbReq.createQuery(Recording_Request.class);
            Root<Recording_Request> rroot = rq.from(Recording_Request.class);
            rq.where(cbReq.equal(rroot.get("student").get("id"), student.getId()));
            Query<Recording_Request> requestsQuery = session.createQuery(rq);
            List<Recording_Request> requests = requestsQuery.getResultList();
            for (Recording_Request req : requests) {
                Map<String, Object> requestData = new HashMap<String, Object>();
                requestData.put("requestId", req.getId());
                requestData.put("recordingId", req.getRecording().getId());
                requestData.put("recordingTitle", req.getRecording().getTitle());
                requestData.put("status", req.getRecording_status().getValue());
                requestData.put("statusId", req.getRecording_status().getId());
                requestData.put("requestDate", req.getRequest_date());
                recordingRequests.add(requestData);
            }
            
            studentDetails.put("recordingRequests", recordingRequests);
            
            // Get payment transactions
            List<Map<String, Object>> paymentTransactions = new ArrayList<Map<String, Object>>();
            CriteriaBuilder cbPay = session.getCriteriaBuilder();
            CriteriaQuery<PaymentTransactions> pq = cbPay.createQuery(PaymentTransactions.class);
            Root<PaymentTransactions> proot = pq.from(PaymentTransactions.class);
            pq.where(cbPay.equal(proot.get("student").get("id"), student.getId()));
            Query<PaymentTransactions> paymentQuery = session.createQuery(pq);
            List<PaymentTransactions> payments = paymentQuery.getResultList();
            for (PaymentTransactions payment : payments) {
                Map<String, Object> paymentData = new HashMap<String, Object>();
                paymentData.put("id", payment.getId());
                paymentData.put("amount", payment.getAmount());
                paymentData.put("currency", payment.getCurrency());
                paymentData.put("paymentMethod", payment.getPaymentMethod());
                paymentData.put("transactionId", payment.getTransactionId());
                paymentData.put("description", payment.getDescription());
                paymentData.put("createdAt", payment.getCreatedAt());
                paymentData.put("verificationStatus", payment.getVerificationStatus());
                paymentData.put("verifiedBy", payment.getVerifiedBy());
                paymentData.put("verificationDate", payment.getVerificationDate());
                paymentData.put("verificationNotes", payment.getVerificationNotes());
                paymentTransactions.add(paymentData);
            }
            
            studentDetails.put("paymentTransactions", paymentTransactions);
            
            // Get monthly fees
            List<Map<String, Object>> monthlyFees = new ArrayList<Map<String, Object>>();
            CriteriaBuilder cbMonthly = session.getCriteriaBuilder();
            CriteriaQuery<StudentMonthlyFees> mq = cbMonthly.createQuery(StudentMonthlyFees.class);
            Root<StudentMonthlyFees> mroot = mq.from(StudentMonthlyFees.class);
            mq.where(cbMonthly.equal(mroot.get("student").get("id"), student.getId()));
            Query<StudentMonthlyFees> monthlyQuery = session.createQuery(mq);
            List<StudentMonthlyFees> fees = monthlyQuery.getResultList();
            for (StudentMonthlyFees fee : fees) {
                Map<String, Object> feeData = new HashMap<String, Object>();
                feeData.put("id", fee.getId());
                feeData.put("monthYear", fee.getMonthYear());
                feeData.put("feeAmount", fee.getFeeAmount());
                feeData.put("grade", fee.getGrade() != null ? fee.getGrade().getName() : "N/A");
                feeData.put("classType", fee.getClassType() != null ? fee.getClassType().getName() : "N/A");
                feeData.put("status", fee.getStatus() != null ? fee.getStatus().getValue() : "N/A");
                feeData.put("dueDate", fee.getDueDate());
                feeData.put("paidDate", fee.getPaidDate());
                feeData.put("transactionId", fee.getTransactionId());
                feeData.put("createdAt", fee.getCreatedAt());
                monthlyFees.add(feeData);
            }
            
            studentDetails.put("monthlyFees", monthlyFees);
            
            // Calculate overall payment status based on monthly fees
            boolean hasUnpaidFees = fees.stream().anyMatch(fee -> !fee.isPaid());
            studentDetails.put("paymentStatus", hasUnpaidFees ? "unpaid" : "paid");
            
            out.print(gson.toJson(studentDetails));
            
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(Collections.singletonMap("error", "Error retrieving student details: " + e.getMessage())));
        } finally {
            session.close();
        }
    }

    private void updateStudentStatus(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction transaction = null;
        PrintWriter out = response.getWriter();
        
        try {
            transaction = session.beginTransaction();

            String studentId = request.getParameter("studentId");
            boolean isActive = Boolean.parseBoolean(request.getParameter("isActive"));
            
            Students student = (Students) session.get(Students.class, studentId);
            if (student == null) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.print(gson.toJson(Collections.singletonMap("error", "Student not found")));
                return;
            }
            
            student.setIs_active(isActive ? 1 : 0);
            session.update(student);
            
            transaction.commit();
            
            out.print(gson.toJson(Collections.singletonMap("success", "Student status updated successfully")));
            
        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(Collections.singletonMap("error", "Error updating student status: " + e.getMessage())));
        } finally {
            session.close();
        }
    }

    private void getRecordingRequests(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Session session = HibernateUtil.getSessionFactory().openSession();
        PrintWriter out = response.getWriter();
        
        try {
            String statusFilter = request.getParameter("statusFilter");
            String gradeFilter = request.getParameter("gradeFilter");
            
            // Create criteria for recording requests using JPA Criteria
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Recording_Request> cq = cb.createQuery(Recording_Request.class);
            Root<Recording_Request> root = cq.from(Recording_Request.class);
            // joins
            Join<Recording_Request, Students> sJoin = root.join("student");
            Join<Recording_Request, Recordings> rJoin = root.join("recording");
            Join<Recording_Request, Recording_Status> rsJoin = root.join("recording_status");

            List<Predicate> preds = new ArrayList<>();
            // Apply status filter
            if (statusFilter != null && !statusFilter.isEmpty()) {
                preds.add(cb.equal(rsJoin.get("id"), Integer.parseInt(statusFilter)));
            }
            // Apply grade filter
            if (gradeFilter != null && !gradeFilter.isEmpty()) {
                preds.add(cb.equal(sJoin.get("grade").get("id"), Integer.parseInt(gradeFilter)));
            }

            if (!preds.isEmpty()) {
                cq.where(cb.and(preds.toArray(new Predicate[0])));
            }

            Query<Recording_Request> filteredQuery = session.createQuery(cq);
            List<Recording_Request> filteredRequests = filteredQuery.getResultList();

            // Prepare response
            List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
            for (Recording_Request req : filteredRequests) {
                Map<String, Object> requestData = new HashMap<String, Object>();
                requestData.put("requestId", req.getId());
                requestData.put("studentId", req.getStudent().getId());
                requestData.put("studentName", req.getStudent().getFirst_name() + " " + req.getStudent().getLast_name());
                requestData.put("recordingId", req.getRecording().getId());
                requestData.put("recordingTitle", req.getRecording().getTitle());
                requestData.put("status", req.getRecording_status().getValue());
                requestData.put("statusId", req.getRecording_status().getId());
                requestData.put("requestDate", req.getRequest_date());
                requestData.put("grade", req.getStudent().getGrade() != null ? req.getStudent().getGrade().getName() : "N/A");
                
                result.add(requestData);
            }

            out.print(gson.toJson(result));
            
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(Collections.singletonMap("error", "Error retrieving recording requests: " + e.getMessage())));
        } finally {
            session.close();
        }
    }

    private void updateRecordingRequestStatus(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction transaction = null;
        PrintWriter out = response.getWriter();

        try {
            transaction = session.beginTransaction();

            int requestId = Integer.parseInt(request.getParameter("requestId"));
            int newStatusId = Integer.parseInt(request.getParameter("newStatusId"));

            Recording_Request recordingRequest = (Recording_Request) session.get(Recording_Request.class, requestId);
            if (recordingRequest == null) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.print(gson.toJson(Collections.singletonMap("error", "Recording request not found")));
                return;
            }

            Recording_Status newStatus = (Recording_Status) session.get(Recording_Status.class, newStatusId);
            if (newStatus == null) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.print(gson.toJson(Collections.singletonMap("error", "Status not found")));
                return;
            }

            recordingRequest.setRecording_status(newStatus);

            // If approving (status ID 2) and not paid, set unlock time and expiration
            if (newStatusId == 2 && recordingRequest.getIs_paid() == 0) {
                java.util.Date now = new java.util.Date();
                recordingRequest.setUnlocked_at(now);

                // Set expiration to 48 hours from now
                java.util.Calendar calendar = java.util.Calendar.getInstance();
                calendar.setTime(now);
                calendar.add(java.util.Calendar.HOUR, 48);
                recordingRequest.setExpires_at(calendar.getTime());
            }

            session.update(recordingRequest);

            transaction.commit();

            out.print(gson.toJson(Collections.singletonMap("success", "Recording request status updated successfully")));

        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(Collections.singletonMap("error", "Error updating recording request status: " + e.getMessage())));
        } finally {
            session.close();
        }
    }

    private void updateStudentClassType(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction transaction = null;
        PrintWriter out = response.getWriter();

        try {
            transaction = session.beginTransaction();

            String studentId = request.getParameter("studentId");
            int classTypeId = Integer.parseInt(request.getParameter("classTypeId"));

            Students student = (Students) session.get(Students.class, studentId);
            if (student == null) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.print(gson.toJson(Collections.singletonMap("error", "Student not found")));
                return;
            }

            ClassType classType = (ClassType) session.get(ClassType.class, classTypeId);
            if (classType == null) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.print(gson.toJson(Collections.singletonMap("error", "Class type not found")));
                return;
            }

            student.setClassType(classType);
            session.update(student);

            transaction.commit();

            out.print(gson.toJson(Collections.singletonMap("success", "Student class type updated successfully")));

        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(Collections.singletonMap("error", "Error updating student class type: " + e.getMessage())));
        } finally {
            session.close();
        }
    }

    private void getStudentClassTypes(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Session session = HibernateUtil.getSessionFactory().openSession();
        PrintWriter out = response.getWriter();

        try {
            String studentId = request.getParameter("studentId");

            // Get student's primary class type from Students table
            Students student = (Students) session.get(Students.class, studentId);
            if (student == null) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.print(gson.toJson(Collections.singletonMap("error", "Student not found")));
                return;
            }

            List<Map<String, Object>> classTypes = new ArrayList<Map<String, Object>>();

            // Add primary class type if exists
            if (student.getClassType() != null) {
                Map<String, Object> classTypeData = new HashMap<String, Object>();
                classTypeData.put("id", 0); // Use 0 for primary class type
                classTypeData.put("classTypeId", student.getClassType().getId());
                classTypeData.put("classTypeName", student.getClassType().getName());
                classTypes.add(classTypeData);
            }

            // Get additional class types from StudentClass table
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<StudentClass> cq = cb.createQuery(StudentClass.class);
            Root<StudentClass> root = cq.from(StudentClass.class);
            cq.where(cb.and(
                cb.equal(root.get("student").get("id"), studentId),
                cb.equal(root.get("isActive"), 1)
            ));
            Query<StudentClass> query = session.createQuery(cq);
            List<StudentClass> studentClasses = query.getResultList();

            for (StudentClass sc : studentClasses) {
                // Skip if it's the same as primary class type
                if (student.getClassType() != null && sc.getClassType().getId().equals(student.getClassType().getId())) {
                    continue;
                }
                Map<String, Object> classTypeData = new HashMap<String, Object>();
                classTypeData.put("id", sc.getId());
                classTypeData.put("classTypeId", sc.getClassType().getId());
                classTypeData.put("classTypeName", sc.getClassType().getName());
                classTypes.add(classTypeData);
            }

            out.print(gson.toJson(classTypes));

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(Collections.singletonMap("error", "Error retrieving student class types: " + e.getMessage())));
        } finally {
            session.close();
        }
    }

    private void registerForClassType(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction transaction = null;
        PrintWriter out = response.getWriter();

        try {
            transaction = session.beginTransaction();

            String studentId = request.getParameter("studentId");
            int classTypeId = Integer.parseInt(request.getParameter("classTypeId"));

            Students student = (Students) session.get(Students.class, studentId);
            if (student == null) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.print(gson.toJson(Collections.singletonMap("error", "Student not found")));
                return;
            }

            ClassType classType = (ClassType) session.get(ClassType.class, classTypeId);
            if (classType == null) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.print(gson.toJson(Collections.singletonMap("error", "Class type not found")));
                return;
            }

            // Check if already registered for this class type
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<StudentClass> cq = cb.createQuery(StudentClass.class);
            Root<StudentClass> root = cq.from(StudentClass.class);
            cq.where(cb.and(
                cb.equal(root.get("student").get("id"), studentId),
                cb.equal(root.get("classType").get("id"), classTypeId),
                cb.equal(root.get("isActive"), 1)
            ));
            Query<StudentClass> query = session.createQuery(cq);
            List<StudentClass> existing = query.getResultList();

            if (!existing.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print(gson.toJson(Collections.singletonMap("error", "Already registered for this class type")));
                return;
            }

            // Check if this is the primary class type
            if (student.getClassType() != null && student.getClassType().getId().equals(classTypeId)) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print(gson.toJson(Collections.singletonMap("error", "Already registered for this class type as primary")));
                return;
            }

            // Create new StudentClass entry
            StudentClass studentClass = new StudentClass();
            studentClass.setStudent(student);
            studentClass.setClassType(classType);
            studentClass.setGrade(student.getGrade());
            studentClass.setIsActive(1);
            studentClass.setCreatedAt(new Date());

            session.save(studentClass);
            transaction.commit();

            // Generate monthly fee record for the newly registered class type
            // Use a new session for fee generation to ensure proper transactional context
            // The service handles its own transaction
            Session feeSession = null;
            try {
                feeSession = HibernateUtil.getSessionFactory().openSession();
                
                // Re-fetch the student in the new session
                Students studentForFee = (Students) feeSession.get(Students.class, studentId);
                
                String currentMonthYear = getCurrentMonthYear();
                int feesCreated = MonthlyFeeGenerationService.generateMonthlyFeesForStudentForMonth(
                    feeSession, studentForFee, currentMonthYear);
                if (feesCreated > 0) {
                    System.out.println("✅ Generated " + feesCreated + " monthly fee record(s) for student: " + studentId);
                }
            } catch (Exception feeEx) {
                System.err.println("⚠️  Failed to generate monthly fee for new class type: " + feeEx.getMessage());
                feeEx.printStackTrace();
                // Don't fail the registration if fee generation fails
            } finally {
                if (feeSession != null && feeSession.isOpen()) {
                    try {
                        feeSession.close();
                    } catch (Exception closeEx) {
                        System.err.println("Error closing fee session: " + closeEx.getMessage());
                    }
                }
            }

            out.print(gson.toJson(Collections.singletonMap("success", "Successfully registered for class type")));

        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(Collections.singletonMap("error", "Error registering for class type: " + e.getMessage())));
        } finally {
            session.close();
        }
    }

    private void issueFreeCard(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction transaction = null;
        PrintWriter out = response.getWriter();

        try {
            transaction = session.beginTransaction();

            String studentId = request.getParameter("studentId");

            Students student = (Students) session.get(Students.class, studentId);
            if (student == null) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.print(gson.toJson(Collections.singletonMap("error", "Student not found")));
                return;
            }

            student.setFree_card(1);
            session.update(student);

            transaction.commit();

            out.print(gson.toJson(Collections.singletonMap("success", "Free card issued successfully")));

        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(Collections.singletonMap("error", "Error issuing free card: " + e.getMessage())));
        } finally {
            session.close();
        }
    }

    private void removeFreeCard(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction transaction = null;
        PrintWriter out = response.getWriter();

        try {
            transaction = session.beginTransaction();

            String studentId = request.getParameter("studentId");

            Students student = (Students) session.get(Students.class, studentId);
            if (student == null) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.print(gson.toJson(Collections.singletonMap("error", "Student not found")));
                return;
            }

            student.setFree_card(0);
            session.update(student);

            transaction.commit();

            out.print(gson.toJson(Collections.singletonMap("success", "Free card removed successfully")));

        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(Collections.singletonMap("error", "Error removing free card: " + e.getMessage())));
        } finally {
            session.close();
        }
    }

    private void generateStudentReport(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Session session = HibernateUtil.getSessionFactory().openSession();

        try {
            String gradeFilter = request.getParameter("gradeFilter");
            String statusFilter = request.getParameter("statusFilter");
            String searchTerm = request.getParameter("searchTerm");

            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Students> cq = cb.createQuery(Students.class);
            Root<Students> root = cq.from(Students.class);
            List<Predicate> predicates = new ArrayList<>();

            if (gradeFilter != null && !gradeFilter.isEmpty()) {
                predicates.add(cb.equal(root.get("grade").get("id"), Integer.parseInt(gradeFilter)));
            }

            if (statusFilter != null && !statusFilter.isEmpty()) {
                boolean isActive = "active".equals(statusFilter);
                predicates.add(cb.equal(root.get("is_active"), isActive ? 1 : 0));
            }

            if (searchTerm != null && !searchTerm.isEmpty()) {
                String searchLower = "%" + searchTerm.toLowerCase() + "%";
                predicates.add(cb.or(
                    cb.like(cb.lower(root.get("first_name")), searchLower),
                    cb.like(cb.lower(root.get("last_name")), searchLower),
                    cb.like(cb.lower(root.get("email")), searchLower),
                    cb.like(cb.lower(root.get("id")), searchLower)
                ));
            }

            if (!predicates.isEmpty()) {
                cq.where(cb.and(predicates.toArray(new Predicate[0])));
            }

            Query<Students> studentsQuery = session.createQuery(cq);
            List<Students> filteredStudents = studentsQuery.getResultList();

            Workbook workbook = new XSSFWorkbook();
            Sheet sheet = workbook.createSheet("Students Report");

            Row headerRow = sheet.createRow(0);
            String[] headers = {"Student ID", "First Name", "Last Name", "Email", "Mobile", "Date of Birth",
                               "NIC", "School", "Grade", "Class Type", "Status", "Created At",
                               "Street Address", "City", "District", "Province",
                               "Total Recording Requests", "Approved Requests", "Pending Requests", "Payment Status"};

            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

            int rowNum = 1;
            for (Students student : filteredStudents) {
                Row row = sheet.createRow(rowNum++);

                row.createCell(0).setCellValue(student.getId());
                row.createCell(1).setCellValue(student.getFirst_name() != null ? student.getFirst_name() : "");
                row.createCell(2).setCellValue(student.getLast_name() != null ? student.getLast_name() : "");
                row.createCell(3).setCellValue(student.getEmail() != null ? student.getEmail() : "");
                row.createCell(4).setCellValue(student.getMobile() != null ? student.getMobile() : "");
                row.createCell(5).setCellValue(student.getDate_of_birth() != null ? student.getDate_of_birth().toString() : "");
                row.createCell(6).setCellValue(student.getNic() != null ? student.getNic() : "");
                row.createCell(7).setCellValue(student.getSchool() != null ? student.getSchool() : "");
                row.createCell(8).setCellValue(student.getGrade() != null ? student.getGrade().getName() : "N/A");
                row.createCell(9).setCellValue(student.getClassType() != null ? student.getClassType().getName() : "N/A");
                row.createCell(10).setCellValue(student.getIs_active() == 1 ? "Active" : "Inactive");
                row.createCell(11).setCellValue(student.getCreated_at() != null ? dateFormat.format(student.getCreated_at()) : "");

                String streetAddress = "";
                String city = "";
                String district = "";
                String province = "";

                if (student.getAddress() != null) {
                    streetAddress = student.getAddress().getLine1() != null ? student.getAddress().getLine1() : "";
                    if (student.getAddress().getLine2() != null && !student.getAddress().getLine2().isEmpty()) {
                        streetAddress += ", " + student.getAddress().getLine2();
                    }
                    city = student.getAddress().getCity() != null ? student.getAddress().getCity() : "";
                    district = student.getAddress().getDistricts() != null ? student.getAddress().getDistricts().getName() : "N/A";
                    province = student.getAddress().getProvinces() != null ? student.getAddress().getProvinces().getName() : "N/A";
                }

                row.createCell(12).setCellValue(streetAddress);
                row.createCell(13).setCellValue(city);
                row.createCell(14).setCellValue(district);
                row.createCell(15).setCellValue(province);

                CriteriaQuery<Recording_Request> rq = cb.createQuery(Recording_Request.class);
                Root<Recording_Request> rroot = rq.from(Recording_Request.class);
                rq.where(cb.equal(rroot.get("student").get("id"), student.getId()));
                Query<Recording_Request> reqQuery = session.createQuery(rq);
                List<Recording_Request> studentRequests = reqQuery.getResultList();
                int totalRequests = studentRequests.size();
                int approvedRequests = 0;
                int pendingRequests = 0;

                for (Recording_Request req : studentRequests) {
                    if (req.getRecording_status() != null) {
                        if (req.getRecording_status().getId() == 2) {
                            approvedRequests++;
                        } else if (req.getRecording_status().getId() == 1) {
                            pendingRequests++;
                        }
                    }
                }

                row.createCell(16).setCellValue(totalRequests);
                row.createCell(17).setCellValue(approvedRequests);
                row.createCell(18).setCellValue(pendingRequests);

                CriteriaQuery<StudentMonthlyFees> mq = cb.createQuery(StudentMonthlyFees.class);
                Root<StudentMonthlyFees> mroot = mq.from(StudentMonthlyFees.class);
                mq.where(cb.equal(mroot.get("student").get("id"), student.getId()));
                Query<StudentMonthlyFees> monthlyQuery = session.createQuery(mq);
                List<StudentMonthlyFees> fees = monthlyQuery.getResultList();
                boolean hasUnpaidFees = fees.stream().anyMatch(fee -> !fee.isPaid());
                row.createCell(19).setCellValue(hasUnpaidFees ? "Unpaid" : "Paid");
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.setHeader("Content-Disposition", "attachment; filename=students_report_" + System.currentTimeMillis() + ".xlsx");

            OutputStream outputStream = response.getOutputStream();
            workbook.write(outputStream);
            workbook.close();
            outputStream.close();

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType("application/json;charset=UTF-8");
            PrintWriter out = response.getWriter();
            out.print(gson.toJson(Collections.singletonMap("error", "Error generating report: " + e.getMessage())));
        } finally {
            session.close();
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

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setStatus(HttpServletResponse.SC_OK);
    }

    /**
     * Get current month-year in format "YYYY-MM".
     */
    private String getCurrentMonthYear() {
        Calendar calendar = Calendar.getInstance();
        return String.format("%04d-%02d",
                calendar.get(Calendar.YEAR),
                calendar.get(Calendar.MONTH) + 1);
    }
}
