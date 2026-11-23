package com.nextlvlict.nextlvlict.controller;

import com.google.gson.Gson;
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

@WebServlet(name = "RecordingRequestServlet", urlPatterns = {"/RecordingRequestServlet"})
public class RecordingRequestServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        JsonObject jsonResponse = new JsonObject();
        Session session = null;
        Transaction transaction = null;

        try {
            // Read JSON data from request body
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = request.getReader().readLine()) != null) {
                sb.append(line);
            }
            String requestBody = sb.toString();
            
            Gson gson = new Gson();
            JsonObject requestData = gson.fromJson(requestBody, JsonObject.class);
            
            String action = requestData.has("action") ? requestData.get("action").getAsString() : null;
            
            if ("createRequest".equals(action)) {
                String studentId = requestData.get("studentId").getAsString(); // Keep as String
                int recordingId = requestData.get("recordingId").getAsInt();
                
                session = HibernateUtil.getSessionFactory().openSession();
                transaction = session.beginTransaction();
                
                // Check if request already exists (JPA Criteria)
                CriteriaBuilder cb = session.getCriteriaBuilder();
                CriteriaQuery<Recording_Request> cq = cb.createQuery(Recording_Request.class);
                Root<Recording_Request> root = cq.from(Recording_Request.class);
                Join<Recording_Request, Students> studentJoin = root.join("student");
                Join<Recording_Request, Recordings> recordingJoin = root.join("recording");
                cq.where(cb.and(
                    cb.equal(studentJoin.get("id"), studentId),
                    cb.equal(recordingJoin.get("id"), recordingId)
                ));
                Query<Recording_Request> q = session.createQuery(cq);
                Recording_Request existingRequest = q.uniqueResult();

                if (existingRequest != null) {
                    jsonResponse.addProperty("success", false);
                    jsonResponse.addProperty("message", "Request already exists for this recording");
                } else {
                    // Create new request
                    Recording_Request recordingRequest = new Recording_Request();
                    
                    Students student = (Students) session.get(Students.class, studentId); // Use String ID
                    Recordings recording = (Recordings) session.get(Recordings.class, recordingId);
                    
                    if (student != null && recording != null) {
                        // Check if recording is FREE - auto-approve without payment
                        if (recording.getAccessType() == AccessType.FREE) {
                            // FREE resources: auto-approve
                            Recording_Status approvedStatus = (Recording_Status) session.get(Recording_Status.class, 2); // 2 = Approved

                            java.util.Date now = new java.util.Date();
                            // Set expiration to 48 hours from now
                            java.util.Calendar calendar = java.util.Calendar.getInstance();
                            calendar.setTime(now);
                            calendar.add(java.util.Calendar.HOUR, 48);
                            java.util.Date expiresAt = calendar.getTime();

                            recordingRequest.setStudent(student);
                            recordingRequest.setRecording(recording);
                            recordingRequest.setRecording_status(approvedStatus);
                            recordingRequest.setRequest_date(now);
                            recordingRequest.setUnlocked_at(now);
                            recordingRequest.setIs_paid(0); // Not paid
                            recordingRequest.setExpires_at(expiresAt);

                            session.save(recordingRequest);
                            transaction.commit();

                            jsonResponse.addProperty("success", true);
                            jsonResponse.addProperty("message", "FREE recording accessed successfully");
                        } else {
                            // PAID resources: create pending request for admin approval
                            Recording_Status pendingStatus = (Recording_Status) session.get(Recording_Status.class, 1); // 1 = Pending

                            recordingRequest.setStudent(student);
                            recordingRequest.setRecording(recording);
                            recordingRequest.setRecording_status(pendingStatus);
                            recordingRequest.setRequest_date(new java.util.Date());
                            recordingRequest.setIs_paid(0); // Not paid yet

                            session.save(recordingRequest);
                            transaction.commit();

                            jsonResponse.addProperty("success", true);
                            jsonResponse.addProperty("message", "Request submitted successfully. Waiting for admin approval.");
                        }
                    } else {
                        jsonResponse.addProperty("success", false);
                        if (student == null) {
                            jsonResponse.addProperty("message", "Student not found with ID: " + studentId);
                        } else if (recording == null) {
                            jsonResponse.addProperty("message", "Recording not found with ID: " + recordingId);
                        } else {
                            jsonResponse.addProperty("message", "Status not found");
                        }
                    }
                }
            } else {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Invalid action parameter: " + action);
            }

        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error processing request: " + e.getMessage());
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
        // Handle GET requests with URL parameters
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        JsonObject jsonResponse = new JsonObject();
        Session session = null;
        Transaction transaction = null;
        
        try {
            String action = request.getParameter("action");
            
            if ("createRequest".equals(action)) {
                String studentId = request.getParameter("studentId"); // Keep as String
                int recordingId = Integer.parseInt(request.getParameter("recordingId"));
                
                session = HibernateUtil.getSessionFactory().openSession();
                transaction = session.beginTransaction();
                
                // Check if request already exists (JPA Criteria)
                CriteriaBuilder cb = session.getCriteriaBuilder();
                CriteriaQuery<Recording_Request> cq = cb.createQuery(Recording_Request.class);
                Root<Recording_Request> root = cq.from(Recording_Request.class);
                Join<Recording_Request, Students> studentJoin = root.join("student");
                Join<Recording_Request, Recordings> recordingJoin = root.join("recording");
                cq.where(cb.and(
                    cb.equal(studentJoin.get("id"), studentId),
                    cb.equal(recordingJoin.get("id"), recordingId)
                ));
                Query<Recording_Request> q = session.createQuery(cq);
                Recording_Request existingRequest = q.uniqueResult();

                if (existingRequest != null) {
                    jsonResponse.addProperty("success", false);
                    jsonResponse.addProperty("message", "Request already exists for this recording");
                } else {
                    // Create new request
                    Recording_Request recordingRequest = new Recording_Request();
                    
                    Students student = (Students) session.get(Students.class, studentId); // Use String ID
                    Recordings recording = (Recordings) session.get(Recordings.class, recordingId);
                    
                    if (student != null && recording != null) {
                        // Check if recording is FREE - auto-approve without payment
                        if (recording.getAccessType() == AccessType.FREE) {
                            // FREE resources: auto-approve
                            Recording_Status approvedStatus = (Recording_Status) session.get(Recording_Status.class, 2); // 2 = Approved

                            java.util.Date now = new java.util.Date();
                            // Set expiration to 48 hours from now
                            java.util.Calendar calendar = java.util.Calendar.getInstance();
                            calendar.setTime(now);
                            calendar.add(java.util.Calendar.HOUR, 48);
                            java.util.Date expiresAt = calendar.getTime();

                            recordingRequest.setStudent(student);
                            recordingRequest.setRecording(recording);
                            recordingRequest.setRecording_status(approvedStatus);
                            recordingRequest.setRequest_date(now);
                            recordingRequest.setUnlocked_at(now);
                            recordingRequest.setIs_paid(0); // Not paid
                            recordingRequest.setExpires_at(expiresAt);

                            session.save(recordingRequest);
                            transaction.commit();

                            jsonResponse.addProperty("success", true);
                            jsonResponse.addProperty("message", "FREE recording accessed successfully");
                        } else {
                            // PAID resources: create pending request for admin approval
                            Recording_Status pendingStatus = (Recording_Status) session.get(Recording_Status.class, 1); // 1 = Pending

                            recordingRequest.setStudent(student);
                            recordingRequest.setRecording(recording);
                            recordingRequest.setRecording_status(pendingStatus);
                            recordingRequest.setRequest_date(new java.util.Date());
                            recordingRequest.setIs_paid(0); // Not paid yet

                            session.save(recordingRequest);
                            transaction.commit();

                            jsonResponse.addProperty("success", true);
                            jsonResponse.addProperty("message", "Request submitted successfully. Waiting for admin approval.");
                        }
                    } else {
                        jsonResponse.addProperty("success", false);
                        if (student == null) {
                            jsonResponse.addProperty("message", "Student not found with ID: " + studentId);
                        } else if (recording == null) {
                            jsonResponse.addProperty("message", "Recording not found with ID: " + recordingId);
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
}
