package com.nextlvlict.nextlvlict.controller;

import com.google.gson.JsonArray;
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
import java.util.Date; // Import Date class
import java.util.List;

@WebServlet(name = "TutesServlet", urlPatterns = {"/TutesServlet"})
public class TutesServlet extends HttpServlet {

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

            if ("getStudentTutes".equals(action)) {
                // FLOW 1: Student Portal Resources
                // Used inside the Student Dashboard
                // Load resources that belong to the student's own registered grade
                String studentId = request.getParameter("studentId");
                String accessTypeFilter = request.getParameter("accessType"); // Optional: FREE, PAID, or ALL
                String tuteTypeIdFilter = request.getParameter("tuteTypeId"); // Optional: 1 for Tutes, 2 for Question Papers

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

                // Fetch only tutes that match the student's grade using JPA Criteria (ManyToMany)
                CriteriaBuilder cb = session.getCriteriaBuilder();
                CriteriaQuery<Tutes> cq = cb.createQuery(Tutes.class);
                Root<Tutes> root = cq.from(Tutes.class);

                // Join with the grades collection (ManyToMany)
                jakarta.persistence.criteria.Join<Tutes, Grade> gradesJoin = root.join("grades");

                // Build where clause with optional filters
                jakarta.persistence.criteria.Predicate predicate = cb.and(
                    cb.equal(root.get("isActive"), true),
                    cb.equal(gradesJoin.get("id"), studentGradeId)
                );
                
                // Add accessType filter
                if (accessTypeFilter != null && !accessTypeFilter.isEmpty() && !"ALL".equalsIgnoreCase(accessTypeFilter)) {
                    try {
                        AccessType filterType = AccessType.valueOf(accessTypeFilter.toUpperCase());
                        predicate = cb.and(predicate, cb.equal(root.get("accessType"), filterType));
                    } catch (IllegalArgumentException e) {
                        // Invalid access type, ignore filter
                    }
                }
                
                // Add tuteType filter
                if (tuteTypeIdFilter != null && !tuteTypeIdFilter.isEmpty()) {
                    try {
                        int tuteTypeId = Integer.parseInt(tuteTypeIdFilter);
                        predicate = cb.and(predicate, cb.equal(root.get("tuteType").get("id"), tuteTypeId));
                    } catch (NumberFormatException e) {
                        // Invalid tute type ID, ignore filter
                    }
                }
                
                cq.where(predicate);
                cq.orderBy(cb.desc(root.get("created_at")));
                Query<Tutes> tutesQuery = session.createQuery(cq);
                List<Tutes> tutes = tutesQuery.getResultList();

                // Fetch user's tute requests
                CriteriaQuery<Tutes_Request> cq2 = cb.createQuery(Tutes_Request.class);
                Root<Tutes_Request> reqRoot = cq2.from(Tutes_Request.class);
                Join<Tutes_Request, Students> studentJoin = reqRoot.join("student");
                cq2.where(cb.equal(studentJoin.get("id"), studentId));
                Query<Tutes_Request> reqQuery = session.createQuery(cq2);
                List<Tutes_Request> userRequests = reqQuery.getResultList();

                JsonArray tutesArray = new JsonArray();
                for (Tutes tute : tutes) {
                    JsonObject tuteJson = new JsonObject();
                    tuteJson.addProperty("id", tute.getId());
                    tuteJson.addProperty("title", tute.getTitle());
                    tuteJson.addProperty("subject", tute.getGrade() != null ? tute.getGrade().getName() : "General");
                    tuteJson.addProperty("date", tute.getCreated_at().toString());
                    tuteJson.addProperty("description", tute.getDescription());
                    tuteJson.addProperty("price", tute.getPrice());
                    tuteJson.addProperty("accessType", tute.getAccessType() != null ? tute.getAccessType().name() : "PAID");
                    
                    // Add tuteType information
                    if (tute.getTuteType() != null) {
                        JsonObject tuteTypeJson = new JsonObject();
                        tuteTypeJson.addProperty("id", tute.getTuteType().getId());
                        tuteTypeJson.addProperty("name", tute.getTuteType().getName());
                        tuteJson.add("tuteType", tuteTypeJson);
                        tuteJson.addProperty("tuteTypeId", tute.getTuteType().getId());
                        tuteJson.addProperty("tuteTypeName", tute.getTuteType().getName());
                    }

                    // Check if tute is purchased or requested
                    boolean isPurchased = false;
                    boolean hasRequested = false;

                    for (Tutes_Request userRequest : userRequests) {
                        if (userRequest.getTutes().getId() == tute.getId()) {
                            hasRequested = true;
                            if (userRequest.getTuteStatus().getId() == 2) { // 2 = Approved/Purchased
                                isPurchased = true;
                            }
                            break;
                        }
                    }

                    // Include link if tute is purchased OR if it's FREE
                    if (isPurchased || tute.getAccessType() == AccessType.FREE) {
                        tuteJson.addProperty("link", tute.getLink());
                    }

                    tuteJson.addProperty("isPurchased", isPurchased);
                    tuteJson.addProperty("hasRequested", hasRequested);

                    tutesArray.add(tuteJson);
                }

                jsonResponse.addProperty("success", true);
                jsonResponse.add("tutes", tutesArray);
                jsonResponse.addProperty("studentGrade", student.getGrade().getName());

            } else if ("getFreeTutes".equals(action)) {
                // FLOW 2: Free Resources
                // Used only by the Welcome Popup
                // NO studentId - Load FREE resources only based on gradeId
                String gradeIdParam = request.getParameter("gradeId");
                String accessTypeFilter = request.getParameter("accessType"); // Optional: FREE (default)
                String tuteTypeIdFilter = request.getParameter("tuteTypeId"); // Optional: 1 for Tutes, 2 for Question Papers

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
                Grade grade = session.get(Grade.class, gradeId);
                if (grade == null) {
                    jsonResponse.addProperty("success", false);
                    jsonResponse.addProperty("message", "Grade not found");
                    out.print(jsonResponse.toString());
                    out.flush();
                    return;
                }

                // Fetch FREE tutes for the specified grade using JPA Criteria (ManyToMany)
                CriteriaBuilder cb = session.getCriteriaBuilder();
                CriteriaQuery<Tutes> cq = cb.createQuery(Tutes.class);
                Root<Tutes> root = cq.from(Tutes.class);

                // Join with the grades collection (ManyToMany)
                jakarta.persistence.criteria.Join<Tutes, Grade> gradesJoin = root.join("grades");

                // Build where clause - only FREE resources
                jakarta.persistence.criteria.Predicate predicate = cb.and(
                    cb.equal(root.get("isActive"), true),
                    cb.equal(root.get("accessType"), AccessType.FREE),
                    cb.equal(gradesJoin.get("id"), gradeId)
                );
                
                // Add tuteType filter
                if (tuteTypeIdFilter != null && !tuteTypeIdFilter.isEmpty()) {
                    try {
                        int tuteTypeId = Integer.parseInt(tuteTypeIdFilter);
                        predicate = cb.and(predicate, cb.equal(root.get("tuteType").get("id"), tuteTypeId));
                    } catch (NumberFormatException e) {
                        // Invalid tute type ID, ignore filter
                    }
                }
                
                cq.where(predicate);
                cq.orderBy(cb.desc(root.get("created_at")));
                Query<Tutes> tutesQuery = session.createQuery(cq);
                List<Tutes> tutes = tutesQuery.getResultList();

                JsonArray tutesArray = new JsonArray();
                for (Tutes tute : tutes) {
                    JsonObject tuteJson = new JsonObject();
                    tuteJson.addProperty("id", tute.getId());
                    tuteJson.addProperty("title", tute.getTitle());
                    tuteJson.addProperty("subject", tute.getGrade() != null ? tute.getGrade().getName() : "General");
                    tuteJson.addProperty("date", tute.getCreated_at().toString());
                    tuteJson.addProperty("description", tute.getDescription());
                    tuteJson.addProperty("price", tute.getPrice());
                    tuteJson.addProperty("accessType", "FREE");
                    
                    // Add tuteType information
                    if (tute.getTuteType() != null) {
                        JsonObject tuteTypeJson = new JsonObject();
                        tuteTypeJson.addProperty("id", tute.getTuteType().getId());
                        tuteTypeJson.addProperty("name", tute.getTuteType().getName());
                        tuteJson.add("tuteType", tuteTypeJson);
                        tuteJson.addProperty("tuteTypeId", tute.getTuteType().getId());
                        tuteJson.addProperty("tuteTypeName", tute.getTuteType().getName());
                    }
                    
                    // FREE resources always include link
                    tuteJson.addProperty("link", tute.getLink());
                    tuteJson.addProperty("isPurchased", false);
                    tuteJson.addProperty("hasRequested", false);

                    tutesArray.add(tuteJson);
                }

                jsonResponse.addProperty("success", true);
                jsonResponse.add("tutes", tutesArray);
                jsonResponse.addProperty("grade", grade.getName());

            } else if ("getFreeQuestionPapers".equals(action)) {
                // FLOW 3: Free Question Papers
                // Used by Welcome Popup
                // Optional gradeId - if provided, load only that grade's question papers
                // If omitted, return ALL FREE Question Papers grouped by grade
                String gradeIdParam = request.getParameter("gradeId"); // Optional

                session = HibernateUtil.getSessionFactory().openSession();

                CriteriaBuilder cb = session.getCriteriaBuilder();
                CriteriaQuery<Tutes> cq = cb.createQuery(Tutes.class);
                Root<Tutes> root = cq.from(Tutes.class);

                // Join with the grades collection (ManyToMany)
                jakarta.persistence.criteria.Join<Tutes, Grade> gradesJoin = root.join("grades");

                // Build where clause - only FREE resources with tuteTypeId = 2 (Question Papers)
                jakarta.persistence.criteria.Predicate predicate = cb.and(
                    cb.equal(root.get("isActive"), true),
                    cb.equal(root.get("accessType"), AccessType.FREE),
                    cb.equal(root.get("tuteType").get("id"), 2)
                );

                // Add grade filter if provided
                if (gradeIdParam != null && !gradeIdParam.isEmpty()) {
                    try {
                        int gradeId = Integer.parseInt(gradeIdParam);
                        predicate = cb.and(predicate, cb.equal(gradesJoin.get("id"), gradeId));
                    } catch (NumberFormatException e) {
                        // Invalid grade ID, ignore filter
                    }
                }
                
                cq.where(predicate);
                cq.orderBy(cb.asc(gradesJoin.get("name")), cb.desc(root.get("created_at")));
                Query<Tutes> tutesQuery = session.createQuery(cq);
                List<Tutes> tutes = tutesQuery.getResultList();

                JsonArray tutesArray = new JsonArray();
                for (Tutes tute : tutes) {
                    JsonObject tuteJson = new JsonObject();
                    tuteJson.addProperty("id", tute.getId());
                    tuteJson.addProperty("title", tute.getTitle());
                    tuteJson.addProperty("subject", tute.getGrade() != null ? tute.getGrade().getName() : "General");
                    tuteJson.addProperty("date", tute.getCreated_at().toString());
                    tuteJson.addProperty("description", tute.getDescription());
                    tuteJson.addProperty("price", tute.getPrice());
                    tuteJson.addProperty("accessType", "FREE");
                    
                    // Add tuteType information
                    if (tute.getTuteType() != null) {
                        JsonObject tuteTypeJson = new JsonObject();
                        tuteTypeJson.addProperty("id", tute.getTuteType().getId());
                        tuteTypeJson.addProperty("name", tute.getTuteType().getName());
                        tuteJson.add("tuteType", tuteTypeJson);
                        tuteJson.addProperty("tuteTypeId", tute.getTuteType().getId());
                        tuteJson.addProperty("tuteTypeName", tute.getTuteType().getName());
                    }
                    
                    // FREE resources always include link
                    tuteJson.addProperty("link", tute.getLink());

                    tutesArray.add(tuteJson);
                }

                jsonResponse.addProperty("success", true);
                jsonResponse.add("questionPapers", tutesArray);

            } else if ("getTutes".equals(action)) {
                // LEGACY: Keep for backward compatibility
                // This endpoint is deprecated - use getStudentTutes or getFreeTutes instead
                String studentId = request.getParameter("studentId");
                String accessTypeFilter = request.getParameter("accessType");
                String tuteTypeIdFilter = request.getParameter("tuteTypeId");

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
                CriteriaQuery<Tutes> cq = cb.createQuery(Tutes.class);
                Root<Tutes> root = cq.from(Tutes.class);

                // Join with the grades collection (ManyToMany)
                jakarta.persistence.criteria.Join<Tutes, Grade> gradesJoin = root.join("grades");

                jakarta.persistence.criteria.Predicate predicate = cb.and(
                    cb.equal(root.get("isActive"), true),
                    cb.equal(gradesJoin.get("id"), studentGradeId)
                );
                
                if (accessTypeFilter != null && !accessTypeFilter.isEmpty() && !"ALL".equalsIgnoreCase(accessTypeFilter)) {
                    try {
                        AccessType filterType = AccessType.valueOf(accessTypeFilter.toUpperCase());
                        predicate = cb.and(predicate, cb.equal(root.get("accessType"), filterType));
                    } catch (IllegalArgumentException e) {}
                }
                
                if (tuteTypeIdFilter != null && !tuteTypeIdFilter.isEmpty()) {
                    try {
                        int tuteTypeId = Integer.parseInt(tuteTypeIdFilter);
                        predicate = cb.and(predicate, cb.equal(root.get("tuteType").get("id"), tuteTypeId));
                    } catch (NumberFormatException e) {}
                }
                
                cq.where(predicate);
                cq.orderBy(cb.desc(root.get("created_at")));
                Query<Tutes> tutesQuery = session.createQuery(cq);
                List<Tutes> tutes = tutesQuery.getResultList();

                CriteriaQuery<Tutes_Request> cq2 = cb.createQuery(Tutes_Request.class);
                Root<Tutes_Request> reqRoot = cq2.from(Tutes_Request.class);
                Join<Tutes_Request, Students> studentJoin = reqRoot.join("student");
                cq2.where(cb.equal(studentJoin.get("id"), studentId));
                Query<Tutes_Request> reqQuery = session.createQuery(cq2);
                List<Tutes_Request> userRequests = reqQuery.getResultList();

                JsonArray tutesArray = new JsonArray();
                for (Tutes tute : tutes) {
                    JsonObject tuteJson = new JsonObject();
                    tuteJson.addProperty("id", tute.getId());
                    tuteJson.addProperty("title", tute.getTitle());
                    tuteJson.addProperty("subject", tute.getGrade() != null ? tute.getGrade().getName() : "General");
                    tuteJson.addProperty("date", tute.getCreated_at().toString());
                    tuteJson.addProperty("description", tute.getDescription());
                    tuteJson.addProperty("price", tute.getPrice());
                    tuteJson.addProperty("accessType", tute.getAccessType() != null ? tute.getAccessType().name() : "PAID");
                    
                    if (tute.getTuteType() != null) {
                        JsonObject tuteTypeJson = new JsonObject();
                        tuteTypeJson.addProperty("id", tute.getTuteType().getId());
                        tuteTypeJson.addProperty("name", tute.getTuteType().getName());
                        tuteJson.add("tuteType", tuteTypeJson);
                        tuteJson.addProperty("tuteTypeId", tute.getTuteType().getId());
                        tuteJson.addProperty("tuteTypeName", tute.getTuteType().getName());
                    }

                    boolean isPurchased = false;
                    boolean hasRequested = false;
                    for (Tutes_Request userRequest : userRequests) {
                        if (userRequest.getTutes().getId() == tute.getId()) {
                            hasRequested = true;
                            if (userRequest.getTuteStatus().getId() == 2) {
                                isPurchased = true;
                            }
                            break;
                        }
                    }

                    if (isPurchased || tute.getAccessType() == AccessType.FREE) {
                        tuteJson.addProperty("link", tute.getLink());
                    }

                    tuteJson.addProperty("isPurchased", isPurchased);
                    tuteJson.addProperty("hasRequested", hasRequested);
                    tutesArray.add(tuteJson);
                }

                jsonResponse.addProperty("success", true);
                jsonResponse.add("tutes", tutesArray);
                jsonResponse.addProperty("studentGrade", student.getGrade().getName());

            } else if ("getTuteRequests".equals(action)) {
                // Get all tute requests for admin approval
                session = HibernateUtil.getSessionFactory().openSession();
                getTuteRequests(response, out, jsonResponse, session);
                
            } else if ("updateTuteRequestStatus".equals(action)) {
                // Update tute request status (approve/reject)
                session = HibernateUtil.getSessionFactory().openSession();
                updateTuteRequestStatus(request, out, jsonResponse, session);
                
            } else if ("getPublicTutes".equals(action)) {
                // Public API: Return only FREE tutes (no authentication required)
                session = HibernateUtil.getSessionFactory().openSession();
                getPublicTutes(request, out, jsonResponse, session);
                
            } else if ("getTuteTypes".equals(action)) {
                // Get all available tute types
                session = HibernateUtil.getSessionFactory().openSession();
                CriteriaBuilder cb = session.getCriteriaBuilder();
                CriteriaQuery<TuteType> cq = cb.createQuery(TuteType.class);
                Root<TuteType> root = cq.from(TuteType.class);
                cq.select(root);
                Query<TuteType> query = session.createQuery(cq);
                List<TuteType> tuteTypes = query.getResultList();

                JsonArray tuteTypesArray = new JsonArray();
                for (TuteType tuteType : tuteTypes) {
                    JsonObject tuteTypeJson = new JsonObject();
                    tuteTypeJson.addProperty("id", tuteType.getId());
                    tuteTypeJson.addProperty("name", tuteType.getName());
                    tuteTypesArray.add(tuteTypeJson);
                }
                jsonResponse.addProperty("success", true);
                jsonResponse.add("tuteTypes", tuteTypesArray);

            } else {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Invalid action parameter");
            }

        } catch (Exception e) {
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
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        JsonObject jsonResponse = new JsonObject();
        Session session = null;
        Transaction transaction = null;

        try {
            String action = request.getParameter("action");

            if ("addTute".equals(action)) {
                session = HibernateUtil.getSessionFactory().openSession();
                transaction = session.beginTransaction();

                String title = request.getParameter("title");
                String description = request.getParameter("description");
                double price = Double.parseDouble(request.getParameter("price"));
                String link = request.getParameter("link");
                int gradeId = Integer.parseInt(request.getParameter("gradeId"));
                int tuteTypeId = Integer.parseInt(request.getParameter("tuteTypeId"));
                String accessTypeStr = request.getParameter("accessType");
                boolean isActive = Boolean.parseBoolean(request.getParameter("isActive"));

                // Retrieve Grade and TuteType objects
                Grade grade = session.get(Grade.class, gradeId);
                TuteType tuteType = session.get(TuteType.class, tuteTypeId);
                AccessType accessType = AccessType.valueOf(accessTypeStr.toUpperCase());

                if (grade == null) {
                    jsonResponse.addProperty("success", false);
                    jsonResponse.addProperty("message", "Invalid Grade ID");
                    out.print(jsonResponse.toString());
                    out.flush();
                    return;
                }
                if (tuteType == null) {
                    jsonResponse.addProperty("success", false);
                    jsonResponse.addProperty("message", "Invalid Tute Type ID");
                    out.print(jsonResponse.toString());
                    out.flush();
                    return;
                }

                Tutes newTute = new Tutes();
                newTute.setTitle(title);
                newTute.setDescription(description);
                newTute.setPrice(price);
                newTute.setLink(link);
                newTute.setGrade(grade);
                newTute.setTuteType(tuteType);
                newTute.setAccessType(accessType);
                newTute.setIsActive(isActive);
                newTute.setCreated_at(new Date()); // Set current date/time

                session.save(newTute);
                transaction.commit();

                jsonResponse.addProperty("success", true);
                jsonResponse.addProperty("message", "Tute added successfully");

            } else {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Invalid action parameter for POST request");
            }

        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error processing POST request: " + e.getMessage());
        } finally {
            if (session != null && session.isOpen()) {
                session.close();
            }
            out.print(jsonResponse.toString());
            out.flush();
        }
    }

    // Method to get all tute requests for admin approval
    private void getTuteRequests(HttpServletResponse response, PrintWriter out, JsonObject jsonResponse, Session session) {
        try {
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Tutes_Request> cq = cb.createQuery(Tutes_Request.class);
            Root<Tutes_Request> root = cq.from(Tutes_Request.class);
            cq.select(root);
            cq.orderBy(cb.desc(root.get("request_date")));
            Query<Tutes_Request> query = session.createQuery(cq);
            List<Tutes_Request> requests = query.getResultList();

            JsonArray requestsArray = new JsonArray();
            for (Tutes_Request request : requests) {
                // Initialize lazy-loaded relationships
                org.hibernate.Hibernate.initialize(request.getStudent());
                org.hibernate.Hibernate.initialize(request.getTutes());
                org.hibernate.Hibernate.initialize(request.getTuteStatus());

                JsonObject requestJson = new JsonObject();
                requestJson.addProperty("requestId", request.getId());
                requestJson.addProperty("studentId", request.getStudent().getId());
                requestJson.addProperty("studentName", request.getStudent().getFirst_name() + " " + request.getStudent().getLast_name());
                requestJson.addProperty("tuteId", request.getTutes().getId());
                requestJson.addProperty("tuteTitle", request.getTutes().getTitle());
                requestJson.addProperty("price", request.getTutes().getPrice());
                requestJson.addProperty("requestDate", request.getRequest_date().toString());
                requestJson.addProperty("status", request.getTuteStatus().getValue());
                requestJson.addProperty("statusId", request.getTuteStatus().getId());

                requestsArray.add(requestJson);
            }

            jsonResponse.addProperty("success", true);
            jsonResponse.add("tuteRequests", requestsArray);

        } catch (Exception e) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error fetching tute requests: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // Method to update tute request status (approve/reject)
    private void updateTuteRequestStatus(HttpServletRequest request, PrintWriter out, JsonObject jsonResponse, Session session) {
        Transaction transaction = null;
        
        try {
            int requestId = Integer.parseInt(request.getParameter("requestId"));
            int statusId = Integer.parseInt(request.getParameter("statusId"));
            
            transaction = session.beginTransaction();
            
            Tutes_Request tuteRequest = (Tutes_Request) session.get(Tutes_Request.class, requestId);
            TutesStatus newStatus = (TutesStatus) session.get(TutesStatus.class, statusId);
            
            if (tuteRequest != null && newStatus != null) {
                tuteRequest.setTuteStatus(newStatus);
                session.update(tuteRequest);
                transaction.commit();
                
                jsonResponse.addProperty("success", true);
                jsonResponse.addProperty("message", "Tute request status updated successfully");
            } else {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Tute request or status not found");
            }
            
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error updating tute request: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // Method to get tute request status for a specific student and tute
    private void getStudentTuteRequestStatus(HttpServletRequest request, PrintWriter out, JsonObject jsonResponse, Session session) {
        try {
            String studentId = request.getParameter("studentId");
            int tuteId = Integer.parseInt(request.getParameter("tuteId"));
            
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
            Tutes_Request tuteRequest = q.uniqueResult();

            if (tuteRequest != null) {
                JsonObject requestJson = new JsonObject();
                requestJson.addProperty("requestId", tuteRequest.getId());
                requestJson.addProperty("status", tuteRequest.getTuteStatus().getValue());
                requestJson.addProperty("statusId", tuteRequest.getTuteStatus().getId());
                requestJson.addProperty("requestDate", tuteRequest.getRequest_date().toString());
                
                jsonResponse.addProperty("success", true);
                jsonResponse.add("requestInfo", requestJson);
            } else {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "No request found");
            }
            
        } catch (Exception e) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error fetching request status: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // Method to get pending tute requests count for admin dashboard
    private void getPendingTuteRequestsCount(PrintWriter out, JsonObject jsonResponse, Session session) {
        try {
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Tutes_Request> cq = cb.createQuery(Tutes_Request.class);
            Root<Tutes_Request> root = cq.from(Tutes_Request.class);
            cq.where(cb.equal(root.get("tuteStatus").get("id"), 1));
            Query<Tutes_Request> query = session.createQuery(cq);
            List<Tutes_Request> pendingRequests = query.getResultList();

            jsonResponse.addProperty("success", true);
            jsonResponse.addProperty("pendingCount", pendingRequests.size());
            
        } catch (Exception e) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error fetching pending count: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // Method to get public FREE tutes (no authentication required)
    private void getPublicTutes(HttpServletRequest request, PrintWriter out, JsonObject jsonResponse, Session session) {
        try {
            String gradeIdParam = request.getParameter("grade_id");
            String tuteTypeIdFilter = request.getParameter("tuteTypeId"); // Optional: 1 for Tutes, 2 for Question Papers
            
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Tutes> cq = cb.createQuery(Tutes.class);
            Root<Tutes> root = cq.from(Tutes.class);
            Join<Tutes, Grade> gradeJoin = root.join("grade");
            
            // Build where clause - only return FREE and active tutes
            jakarta.persistence.criteria.Predicate predicate = cb.and(
                cb.equal(root.get("isActive"), true),
                cb.equal(root.get("accessType"), AccessType.FREE)
            );
            
            // Add grade filter
            if (gradeIdParam != null && !gradeIdParam.isEmpty()) {
                try {
                    int gradeId = Integer.parseInt(gradeIdParam);
                    predicate = cb.and(predicate, cb.equal(gradeJoin.get("id"), gradeId));
                } catch (NumberFormatException e) {
                    // Invalid grade ID, ignore filter
                }
            }
            
            // Add tuteType filter
            if (tuteTypeIdFilter != null && !tuteTypeIdFilter.isEmpty()) {
                try {
                    int tuteTypeId = Integer.parseInt(tuteTypeIdFilter);
                    predicate = cb.and(predicate, cb.equal(root.get("tuteType").get("id"), tuteTypeId));
                } catch (NumberFormatException e) {
                    // Invalid tute type ID, ignore filter
                }
            }
            
            cq.where(predicate);
            cq.orderBy(cb.desc(root.get("created_at")));
            Query<Tutes> tutesQuery = session.createQuery(cq);
            List<Tutes> tutes = tutesQuery.getResultList();

            JsonArray tutesArray = new JsonArray();
            for (Tutes tute : tutes) {
                JsonObject tuteJson = new JsonObject();
                tuteJson.addProperty("id", tute.getId());
                tuteJson.addProperty("title", tute.getTitle());
                tuteJson.addProperty("subject", tute.getGrade() != null ? tute.getGrade().getName() : "General");
                tuteJson.addProperty("date", tute.getCreated_at().toString());
                tuteJson.addProperty("description", tute.getDescription());
                tuteJson.addProperty("price", tute.getPrice());
                tuteJson.addProperty("accessType", tute.getAccessType() != null ? tute.getAccessType().name() : "FREE");
                
                // Add tuteType information
                if (tute.getTuteType() != null) {
                    JsonObject tuteTypeJson = new JsonObject();
                    tuteTypeJson.addProperty("id", tute.getTuteType().getId());
                    tuteTypeJson.addProperty("name", tute.getTuteType().getName());
                    tuteJson.add("tuteType", tuteTypeJson);
                    tuteJson.addProperty("tuteTypeId", tute.getTuteType().getId());
                    tuteJson.addProperty("tuteTypeName", tute.getTuteType().getName());
                }
                
                tuteJson.addProperty("link", tute.getLink()); // FREE resources always include link
                
                tutesArray.add(tuteJson);
            }

            jsonResponse.addProperty("success", true);
            jsonResponse.add("tutes", tutesArray);
            
        } catch (Exception e) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error fetching public tutes: " + e.getMessage());
            e.printStackTrace();
        }
    }
}