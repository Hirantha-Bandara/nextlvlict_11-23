package com.nextlvlict.nextlvlict.controller;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.nextlvlict.nextlvlict.hibernate.*;
import org.hibernate.Session;
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
import java.util.List;

@WebServlet(name = "RecordingsServlet", urlPatterns = {"/RecordingsServlet"})
public class RecordingsServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        JsonObject jsonResponse = new JsonObject();
        Session session = null;

        try {
            String action = request.getParameter("action");

            if ("getStudentRecordings".equals(action)) {
                // FLOW 1: Student Portal Resources
                // Used inside the Student Dashboard
                // Load resources that belong to the student's own registered grade
                String studentId = request.getParameter("studentId");
                String accessTypeFilter = request.getParameter("accessType"); // Optional: FREE, PAID, or ALL

                if (studentId == null || studentId.isEmpty()) {
                    jsonResponse.addProperty("success", false);
                    jsonResponse.addProperty("message", "Student ID is required");
                    out.print(jsonResponse.toString());
                    out.flush();
                    return;
                }

                session = HibernateUtil.getSessionFactory().openSession();

                // Load student and get their registered grade
                Students student = (Students) session.get(Students.class, studentId);

                if (student == null) {
                    jsonResponse.addProperty("success", false);
                    jsonResponse.addProperty("message", "Student not found");
                    out.print(jsonResponse.toString());
                    out.flush();
                    return;
                }

                if (student.getGrade() == null) {
                    jsonResponse.addProperty("success", false);
                    jsonResponse.addProperty("message", "Student does not have a grade assigned");
                    out.print(jsonResponse.toString());
                    out.flush();
                    return;
                }

                int studentGradeId = student.getGrade().getId();

                // Fetch recordings that match the student's grade (using ManyToMany relationship)
                CriteriaBuilder cb = session.getCriteriaBuilder();
                CriteriaQuery<Recordings> cq = cb.createQuery(Recordings.class);
                Root<Recordings> recordingsRoot = cq.from(Recordings.class);

                // Join with the grades collection (ManyToMany)
                jakarta.persistence.criteria.Join<Recordings, Grade> gradesJoin = recordingsRoot.join("grades");

                // Build where clause with optional accessType filter
                jakarta.persistence.criteria.Predicate basePredicate = cb.and(
                    cb.equal(recordingsRoot.get("is_active"), 1),
                    cb.equal(gradesJoin.get("id"), studentGradeId)
                );

                if (accessTypeFilter != null && !accessTypeFilter.isEmpty() && !"ALL".equalsIgnoreCase(accessTypeFilter)) {
                    try {
                        AccessType filterType = AccessType.valueOf(accessTypeFilter.toUpperCase());
                        cq.where(cb.and(basePredicate, cb.equal(recordingsRoot.get("accessType"), filterType)));
                    } catch (IllegalArgumentException e) {
                        // Invalid access type, ignore filter
                        cq.where(basePredicate);
                    }
                } else {
                    cq.where(basePredicate);
                }
                
                cq.orderBy(cb.desc(recordingsRoot.get("created_at")));

                Query<Recordings> recordingsQuery = session.createQuery(cq);
                List<Recordings> recordings = recordingsQuery.getResultList();

                // Fetch user's recording requests
                CriteriaQuery<Recording_Request> cq2 = cb.createQuery(Recording_Request.class);
                Root<Recording_Request> requestRoot = cq2.from(Recording_Request.class);
                Join<Recording_Request, Students> studentJoin = requestRoot.join("student");

                cq2.where(cb.equal(studentJoin.get("id"), studentId));

                Query<Recording_Request> requestsQuery = session.createQuery(cq2);
                List<Recording_Request> userRequests = requestsQuery.getResultList();

                JsonArray recordingsArray = new JsonArray();
                java.util.Date now = new java.util.Date();

                for (Recordings recording : recordings) {
                    JsonObject recordingJson = new JsonObject();
                    recordingJson.addProperty("id", recording.getId());
                    recordingJson.addProperty("title", recording.getTitle());
                    recordingJson.addProperty("subject", recording.getGrade() != null ? recording.getGrade().getName() : "General");
                    recordingJson.addProperty("date", recording.getCreated_at().toString());
                    recordingJson.addProperty("duration", "1:45:30"); // You might want to store this in database
                    recordingJson.addProperty("size", "250 MB"); // You might want to store this in database
                    recordingJson.addProperty("price", recording.getPrice());
                    recordingJson.addProperty("accessType", recording.getAccessType() != null ? recording.getAccessType().name() : "PAID");
                    recordingJson.addProperty("thumbnail_url", recording.getThumbnail_url());

                    // Check if recording is unlocked (approved) or requested
                    boolean isUnlocked = false;
                    boolean hasRequested = false;
                    boolean isExpired = false;
                    boolean isPaid = false;
                    java.util.Date expiresAt = null;

                    for (Recording_Request userRequest : userRequests) {
                        if (userRequest.getRecording().getId() == recording.getId()) {
                            hasRequested = true;
                            if (userRequest.getRecording_status().getId() == 2) { // 2 = Approved
                                isUnlocked = true;
                                isPaid = userRequest.getIs_paid() == 1;
                                // Check if expired (not paid and expiration time has passed)
                                if (userRequest.getIs_paid() == 0 && userRequest.getExpires_at() != null) {
                                    if (now.after(userRequest.getExpires_at())) {
                                        isExpired = true;
                                        isUnlocked = false; // Expired recordings are not unlocked
                                    } else {
                                        expiresAt = userRequest.getExpires_at();
                                    }
                                }
                            }
                            break;
                        }
                    }

                    // Include youtubeUrl if recording is unlocked OR if it's FREE
                    if (isUnlocked || recording.getAccessType() == AccessType.FREE) {
                        String youtubeUrl = recording.getYoutube_url();
                        if (youtubeUrl != null && !youtubeUrl.isEmpty()) {
                            recordingJson.addProperty("youtubeUrl", youtubeUrl);
                        }
                    }

                    recordingJson.addProperty("isUnlocked", isUnlocked);
                    recordingJson.addProperty("hasRequested", hasRequested);
                    recordingJson.addProperty("isExpired", isExpired);
                    recordingJson.addProperty("isPaid", isPaid);
                    if (expiresAt != null) {
                        recordingJson.addProperty("expiresAt", expiresAt.toString());
                    }

                    recordingsArray.add(recordingJson);
                }

                jsonResponse.addProperty("success", true);
                jsonResponse.add("recordings", recordingsArray);
                jsonResponse.addProperty("studentGrade", student.getGrade().getName());

            } else if ("getFreeRecordings".equals(action)) {
                // FLOW 2: Free Resources
                // Used only by the Welcome Popup
                // NO studentId - Load FREE resources only based on gradeId
                String gradeIdParam = request.getParameter("gradeId");

                if (gradeIdParam == null || gradeIdParam.isEmpty()) {
                    jsonResponse.addProperty("success", false);
                    jsonResponse.addProperty("message", "Grade ID is required");
                    out.print(jsonResponse.toString());
                    out.flush();
                    return;
                }

                session = HibernateUtil.getSessionFactory().openSession();

                int gradeId;
                try {
                    gradeId = Integer.parseInt(gradeIdParam);
                } catch (NumberFormatException e) {
                    jsonResponse.addProperty("success", false);
                    jsonResponse.addProperty("message", "Invalid Grade ID");
                    out.print(jsonResponse.toString());
                    out.flush();
                    return;
                }

                // Verify grade exists
                com.nextlvlict.nextlvlict.hibernate.Grade grade = session.get(com.nextlvlict.nextlvlict.hibernate.Grade.class, gradeId);
                if (grade == null) {
                    jsonResponse.addProperty("success", false);
                    jsonResponse.addProperty("message", "Grade not found");
                    out.print(jsonResponse.toString());
                    out.flush();
                    return;
                }

                // Fetch FREE recordings for the specified grade (using ManyToMany relationship)
                CriteriaBuilder cb = session.getCriteriaBuilder();
                CriteriaQuery<Recordings> cq = cb.createQuery(Recordings.class);
                Root<Recordings> recordingsRoot = cq.from(Recordings.class);

                // Join with the grades collection (ManyToMany)
                jakarta.persistence.criteria.Join<Recordings, Grade> gradesJoin = recordingsRoot.join("grades");

                // Only return FREE and active recordings for the specified grade
                cq.where(cb.and(
                    cb.equal(recordingsRoot.get("is_active"), 1),
                    cb.equal(recordingsRoot.get("accessType"), AccessType.FREE),
                    cb.equal(gradesJoin.get("id"), gradeId)
                ));
                
                cq.orderBy(cb.desc(recordingsRoot.get("created_at")));
                Query<Recordings> recordingsQuery = session.createQuery(cq);
                List<Recordings> recordings = recordingsQuery.getResultList();

                JsonArray recordingsArray = new JsonArray();
                for (Recordings recording : recordings) {
                    JsonObject recordingJson = new JsonObject();
                    recordingJson.addProperty("id", recording.getId());
                    recordingJson.addProperty("title", recording.getTitle());
                    recordingJson.addProperty("subject", recording.getGrade() != null ? recording.getGrade().getName() : "General");
                    recordingJson.addProperty("date", recording.getCreated_at().toString());
                    recordingJson.addProperty("duration", "1:45:30"); // You might want to store this in database
                    recordingJson.addProperty("size", "250 MB"); // You might want to store this in database
                    recordingJson.addProperty("price", recording.getPrice());
                    recordingJson.addProperty("accessType", "FREE");
                    
                    // FREE resources always include youtubeUrl
                    String youtubeUrl = recording.getYoutube_url();
                    if (youtubeUrl != null && !youtubeUrl.isEmpty()) {
                        recordingJson.addProperty("youtubeUrl", youtubeUrl);
                    }
                    
                    recordingJson.addProperty("isUnlocked", false);
                    recordingJson.addProperty("hasRequested", false);
                    
                    recordingsArray.add(recordingJson);
                }

                jsonResponse.addProperty("success", true);
                jsonResponse.add("recordings", recordingsArray);
                jsonResponse.addProperty("grade", grade.getName());

            } else if ("getRecordings".equals(action)) {
                // LEGACY: Keep for backward compatibility
                // This endpoint is deprecated - use getStudentRecordings or getFreeRecordings instead
                String studentId = request.getParameter("studentId");
                String accessTypeFilter = request.getParameter("accessType");

                if (studentId == null || studentId.isEmpty()) {
                    jsonResponse.addProperty("success", false);
                    jsonResponse.addProperty("message", "Student ID is required");
                    out.print(jsonResponse.toString());
                    out.flush();
                    return;
                }

                session = HibernateUtil.getSessionFactory().openSession();
                Students student = (Students) session.get(Students.class, studentId);

                if (student == null || student.getGrade() == null) {
                    jsonResponse.addProperty("success", false);
                    jsonResponse.addProperty("message", "Student or grade not found");
                    out.print(jsonResponse.toString());
                    out.flush();
                    return;
                }

                int studentGradeId = student.getGrade().getId();
                CriteriaBuilder cb = session.getCriteriaBuilder();
                CriteriaQuery<Recordings> cq = cb.createQuery(Recordings.class);
                Root<Recordings> recordingsRoot = cq.from(Recordings.class);

                // Join with the grades collection (ManyToMany)
                jakarta.persistence.criteria.Join<Recordings, Grade> gradesJoin = recordingsRoot.join("grades");

                jakarta.persistence.criteria.Predicate basePredicate = cb.and(
                    cb.equal(recordingsRoot.get("is_active"), 1),
                    cb.equal(gradesJoin.get("id"), studentGradeId)
                );

                if (accessTypeFilter != null && !accessTypeFilter.isEmpty() && !"ALL".equalsIgnoreCase(accessTypeFilter)) {
                    try {
                        AccessType filterType = AccessType.valueOf(accessTypeFilter.toUpperCase());
                        cq.where(cb.and(basePredicate, cb.equal(recordingsRoot.get("accessType"), filterType)));
                    } catch (IllegalArgumentException e) {
                        cq.where(basePredicate);
                    }
                } else {
                    cq.where(basePredicate);
                }
                
                cq.orderBy(cb.desc(recordingsRoot.get("created_at")));
                Query<Recordings> recordingsQuery = session.createQuery(cq);
                List<Recordings> recordings = recordingsQuery.getResultList();

                CriteriaQuery<Recording_Request> cq2 = cb.createQuery(Recording_Request.class);
                Root<Recording_Request> requestRoot = cq2.from(Recording_Request.class);
                Join<Recording_Request, Students> studentJoin = requestRoot.join("student");
                cq2.where(cb.equal(studentJoin.get("id"), studentId));
                Query<Recording_Request> requestsQuery = session.createQuery(cq2);
                List<Recording_Request> userRequests = requestsQuery.getResultList();

                JsonArray recordingsArray = new JsonArray();
                java.util.Date now = new java.util.Date();

                for (Recordings recording : recordings) {
                    JsonObject recordingJson = new JsonObject();
                    recordingJson.addProperty("id", recording.getId());
                    recordingJson.addProperty("title", recording.getTitle());
                    recordingJson.addProperty("subject", recording.getGrade() != null ? recording.getGrade().getName() : "General");
                    recordingJson.addProperty("date", recording.getCreated_at().toString());
                    recordingJson.addProperty("duration", "1:45:30");
                    recordingJson.addProperty("size", "250 MB");
                    recordingJson.addProperty("price", recording.getPrice());
                    recordingJson.addProperty("accessType", recording.getAccessType() != null ? recording.getAccessType().name() : "PAID");
                    recordingJson.addProperty("thumbnail_url", recording.getThumbnail_url());

                    boolean isUnlocked = false;
                    boolean hasRequested = false;
                    boolean isExpired = false;
                    boolean isPaid = false;
                    java.util.Date expiresAt = null;

                    for (Recording_Request userRequest : userRequests) {
                        if (userRequest.getRecording().getId() == recording.getId()) {
                            hasRequested = true;
                            if (userRequest.getRecording_status().getId() == 2) { // 2 = Approved
                                isUnlocked = true;
                                isPaid = userRequest.getIs_paid() == 1;
                                // Check if expired (not paid and expiration time has passed)
                                if (userRequest.getIs_paid() == 0 && userRequest.getExpires_at() != null) {
                                    if (now.after(userRequest.getExpires_at())) {
                                        isExpired = true;
                                        isUnlocked = false; // Expired recordings are not unlocked
                                    } else {
                                        expiresAt = userRequest.getExpires_at();
                                    }
                                }
                            }
                            break;
                        }
                    }

                    if (isUnlocked || recording.getAccessType() == AccessType.FREE) {
                        String youtubeUrl = recording.getYoutube_url();
                        if (youtubeUrl != null && !youtubeUrl.isEmpty()) {
                            recordingJson.addProperty("youtubeUrl", youtubeUrl);
                        }
                    }

                    recordingJson.addProperty("isUnlocked", isUnlocked);
                    recordingJson.addProperty("hasRequested", hasRequested);
                    recordingJson.addProperty("isExpired", isExpired);
                    recordingJson.addProperty("isPaid", isPaid);
                    if (expiresAt != null) {
                        recordingJson.addProperty("expiresAt", expiresAt.toString());
                    }
                    recordingsArray.add(recordingJson);
                }

                jsonResponse.addProperty("success", true);
                jsonResponse.add("recordings", recordingsArray);
                jsonResponse.addProperty("studentGrade", student.getGrade().getName());

            } else if ("getPublicRecordings".equals(action)) {
                // Public API: Return only FREE recordings (no authentication required)
                session = HibernateUtil.getSessionFactory().openSession();
                getPublicRecordings(request, out, jsonResponse, session);
                
            } else {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Invalid action parameter");
            }

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error fetching recordings: " + e.getMessage());
        } finally {
            if (session != null && session.isOpen()) {
                session.close();
            }
            out.print(jsonResponse.toString());
            out.flush();
        }
    }

    private String extractYoutubeId(String youtubeUrl) {
        if (youtubeUrl == null || youtubeUrl.isEmpty()) {
            return null;
        }

        // Extract YouTube ID from various URL formats
        String pattern = "(?<=watch\\?v=|/videos/|embed\\/|youtu.be\\/|\\/v\\/|\\/e\\/|watch\\?v%3D|watch\\?feature=player_embedded&v=|%2Fvideos%2F|embed%2F|youtu.be%2F|%2Fv%2F)[^#\\&\\?\\n]*";

        java.util.regex.Pattern compiledPattern = java.util.regex.Pattern.compile(pattern);
        java.util.regex.Matcher matcher = compiledPattern.matcher(youtubeUrl);

        if (matcher.find()) {
            return matcher.group();
        }
        return null;
    }

    // Method to get public FREE recordings (no authentication required)
    private void getPublicRecordings(HttpServletRequest request, PrintWriter out, JsonObject jsonResponse, Session session) {
        try {
            String gradeIdParam = request.getParameter("grade_id");
            
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Recordings> cq = cb.createQuery(Recordings.class);
            Root<Recordings> recordingsRoot = cq.from(Recordings.class);

            // Join with the grades collection (ManyToMany)
            jakarta.persistence.criteria.Join<Recordings, Grade> gradesJoin = recordingsRoot.join("grades");

            // Only return FREE and active recordings
            if (gradeIdParam != null && !gradeIdParam.isEmpty()) {
                try {
                    int gradeId = Integer.parseInt(gradeIdParam);
                    cq.where(cb.and(
                        cb.equal(recordingsRoot.get("is_active"), 1),
                        cb.equal(recordingsRoot.get("accessType"), AccessType.FREE),
                        cb.equal(gradesJoin.get("id"), gradeId)
                    ));
                } catch (NumberFormatException e) {
                    // Invalid grade ID, return all FREE recordings
                    cq.where(cb.and(
                        cb.equal(recordingsRoot.get("is_active"), 1),
                        cb.equal(recordingsRoot.get("accessType"), AccessType.FREE)
                    ));
                }
            } else {
                cq.where(cb.and(
                    cb.equal(recordingsRoot.get("is_active"), 1),
                    cb.equal(recordingsRoot.get("accessType"), AccessType.FREE)
                ));
            }
            
            cq.orderBy(cb.desc(recordingsRoot.get("created_at")));
            Query<Recordings> recordingsQuery = session.createQuery(cq);
            List<Recordings> recordings = recordingsQuery.getResultList();

            JsonArray recordingsArray = new JsonArray();
            for (Recordings recording : recordings) {
                JsonObject recordingJson = new JsonObject();
                recordingJson.addProperty("id", recording.getId());
                recordingJson.addProperty("title", recording.getTitle());
                recordingJson.addProperty("subject", recording.getGrade() != null ? recording.getGrade().getName() : "General");
                recordingJson.addProperty("date", recording.getCreated_at().toString());
                recordingJson.addProperty("duration", "1:45:30"); // You might want to store this in database
                recordingJson.addProperty("size", "250 MB"); // You might want to store this in database
                recordingJson.addProperty("price", recording.getPrice());
                recordingJson.addProperty("accessType", recording.getAccessType() != null ? recording.getAccessType().name() : "FREE");
                
                // FREE resources always include youtubeUrl
                String youtubeUrl = recording.getYoutube_url();
                if (youtubeUrl != null && !youtubeUrl.isEmpty()) {
                    recordingJson.addProperty("youtubeUrl", youtubeUrl);
                }
                
                recordingsArray.add(recordingJson);
            }

            jsonResponse.addProperty("success", true);
            jsonResponse.add("recordings", recordingsArray);
            
        } catch (Exception e) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error fetching public recordings: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response);
    }
}

