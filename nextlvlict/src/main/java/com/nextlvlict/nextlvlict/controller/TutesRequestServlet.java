package com.nextlvlict.nextlvlict.controller;

import com.google.gson.JsonObject;
import com.nextlvlict.nextlvlict.hibernate.*;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.query.Query;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Root;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "TutesRequestServlet", urlPatterns = {"/TutesRequestServlet"})
public class TutesRequestServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        JsonObject jsonResponse = new JsonObject();
        Session session = null;
        Transaction transaction = null;
        
        try {
            String action = request.getParameter("action");
            
            if ("createRequest".equals(action)) {
                String studentId = request.getParameter("studentId");
                int tuteId = Integer.parseInt(request.getParameter("tuteId"));
                String orderId = request.getParameter("orderId");

                session = HibernateUtil.getSessionFactory().openSession();

                // Check if request already exists (JPA Criteria)
                CriteriaBuilder cb = session.getCriteriaBuilder();
                CriteriaQuery<Tutes_Request> cq = cb.createQuery(Tutes_Request.class);
                Root<Tutes_Request> root = cq.from(Tutes_Request.class);
                Join<Tutes_Request, Students> studentJoin = root.join("student");
                Join<Tutes_Request, Tutes> tuteJoin = root.join("tutes");
                cq.where(cb.and(
                    cb.equal(studentJoin.get("id"), studentId),
                    cb.equal(tuteJoin.get("id"), tuteId)
                ));
                Query<Tutes_Request> q = session.createQuery(cq);
                Tutes_Request existingRequest = q.uniqueResult();

                if (existingRequest != null) {
                    // Idempotent response: if request already exists, treat as already completed flow.
                    jsonResponse.addProperty("success", true);
                    jsonResponse.addProperty("message", "Tute request already exists");
                } else {
                    Students student = (Students) session.get(Students.class, studentId);
                    Tutes tute = (Tutes) session.get(Tutes.class, tuteId);
                    
                    if (student != null && tute != null) {
                        // Check if tute is FREE - skip payment validation
                        if (tute.getAccessType() == AccessType.FREE) {
                            // FREE resources: auto-approve without payment
                            TutesStatus approvedStatus = (TutesStatus) session.get(TutesStatus.class, 2); // 2 = Approved
                            
                            transaction = session.beginTransaction();
                            Tutes_Request tuteRequest = new Tutes_Request();
                            tuteRequest.setStudent(student);
                            tuteRequest.setTutes(tute);
                            tuteRequest.setTuteStatus(approvedStatus);
                            tuteRequest.setRequest_date(new java.util.Date());
                            
                            session.save(tuteRequest);
                            transaction.commit();
                            
                            jsonResponse.addProperty("success", true);
                            jsonResponse.addProperty("message", "FREE tute accessed successfully");
                        } else {
                            // PAID resources: require payment validation
                            TutesStatus status = (TutesStatus) session.get(TutesStatus.class, 1); // 1 = Pending
                            
                            if (orderId == null || orderId.trim().isEmpty()) {
                                jsonResponse.addProperty("success", false);
                                jsonResponse.addProperty("message", "orderId is required after payment");
                                jsonResponse.addProperty("errorCode", "ORDER_ID_REQUIRED");
                                return;
                            }

                            // Enforce payment-first flow: a completed payment transaction must exist.
                            String expectedDescription = "Tute purchase - " + tute.getTitle();
                            PaymentTransactions paidTxn = session.createQuery(
                                    "FROM PaymentTransactions WHERE student.id = :studentId " +
                                            "AND transactionId = :transactionId " +
                                            "AND verificationStatus = :status AND description = :description",
                                    PaymentTransactions.class)
                                    .setParameter("studentId", studentId)
                                    .setParameter("transactionId", orderId.trim())
                                    .setParameter("status", "completed")
                                    .setParameter("description", expectedDescription)
                                    .uniqueResult();

                            if (paidTxn == null) {
                                jsonResponse.addProperty("success", false);
                                jsonResponse.addProperty("message", "Payment required before sending tute request");
                                jsonResponse.addProperty("errorCode", "PAYMENT_REQUIRED");
                                return;
                            }

                            transaction = session.beginTransaction();
                            // Create new request only after payment validation passed.
                            Tutes_Request tuteRequest = new Tutes_Request();
                            tuteRequest.setStudent(student);
                            tuteRequest.setTutes(tute);
                            tuteRequest.setTuteStatus(status);
                            tuteRequest.setRequest_date(new java.util.Date());
                            
                            session.save(tuteRequest);
                            transaction.commit();
                            
                            jsonResponse.addProperty("success", true);
                            jsonResponse.addProperty("message", "Purchase request created successfully");
                        }
                    } else {
                        jsonResponse.addProperty("success", false);
                        if (student == null) {
                            jsonResponse.addProperty("message", "Student not found with ID: " + studentId);
                        } else if (tute == null) {
                            jsonResponse.addProperty("message", "Tute not found with ID: " + tuteId);
                        } else {
                            jsonResponse.addProperty("message", "Status not found");
                        }
                    }
                }
            } else {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Invalid action parameter");
            }
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error: " + e.getMessage());
            e.printStackTrace();
        } finally {
            if (session != null && session.isOpen()) {
                session.close();
            }
            out.print(jsonResponse.toString());
            out.flush();
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response);
    }
}
