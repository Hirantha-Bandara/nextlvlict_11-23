// TutesUploading.java
package com.nextlvlict.nextlvlict.controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.nextlvlict.nextlvlict.hibernate.AccessType;
import com.nextlvlict.nextlvlict.hibernate.Grade;
import com.nextlvlict.nextlvlict.hibernate.HibernateUtil;
import com.nextlvlict.nextlvlict.hibernate.Tutes;
import com.nextlvlict.nextlvlict.hibernate.TuteType;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.query.Query;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet(name = "TutesUploading", urlPatterns = {"/TutesUploading"})
public class TutesUploading extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json;charset=UTF-8");
        
        String action = request.getParameter("action");
        JsonObject jsonResponse = new JsonObject();
        
        try (PrintWriter out = response.getWriter()) {
            try {
                if (action != null) {
                    switch (action) {
                        case "getAll":
                            getAllTutes(request, out, jsonResponse);
                            break;
                        case "save":
                            saveTute(request, out, jsonResponse);
                            break;
                        case "update":
                            updateTute(request, out, jsonResponse);
                            break;
                        case "delete":
                            deleteTute(request, out, jsonResponse);
                            break;
                        case "getTuteTypes":
                            getTuteTypes(out, jsonResponse);
                            break;
                        default:
                            jsonResponse.addProperty("success", false);
                            jsonResponse.addProperty("message", "Invalid action specified");
                            out.print(jsonResponse.toString());
                            break;
                    }
                } else {
                    jsonResponse.addProperty("success", false);
                    jsonResponse.addProperty("message", "No action specified");
                    out.print(jsonResponse.toString());
                }
            } catch (Exception e) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Error processing request: " + e.getMessage());
                out.print(jsonResponse.toString());
                e.printStackTrace();
            }
        }
    }

    private void getAllTutes(HttpServletRequest request, PrintWriter out, JsonObject jsonResponse) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        try {
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Tutes> cq = cb.createQuery(Tutes.class);
            Root<Tutes> root = cq.from(Tutes.class);
            
            // Build where clause with optional filters
            jakarta.persistence.criteria.Predicate predicate = cb.equal(root.get("isActive"), true);
            
            // Filter by grade_id
            String gradeIdParam = request.getParameter("grade_id");
            if (gradeIdParam != null && !gradeIdParam.isEmpty()) {
                try {
                    int gradeId = Integer.parseInt(gradeIdParam);
                    predicate = cb.and(predicate, cb.equal(root.get("grade").get("id"), gradeId));
                } catch (NumberFormatException e) {
                    // Invalid grade ID, ignore filter
                }
            }
            
            // Filter by access_type
            String accessTypeParam = request.getParameter("access_type");
            if (accessTypeParam != null && !accessTypeParam.isEmpty()) {
                try {
                    AccessType accessType = AccessType.valueOf(accessTypeParam.toUpperCase());
                    predicate = cb.and(predicate, cb.equal(root.get("accessType"), accessType));
                } catch (IllegalArgumentException e) {
                    // Invalid access type, ignore filter
                }
            }
            
            // Filter by tute_type_id
            String tuteTypeIdParam = request.getParameter("tute_type_id");
            if (tuteTypeIdParam != null && !tuteTypeIdParam.isEmpty()) {
                try {
                    int tuteTypeId = Integer.parseInt(tuteTypeIdParam);
                    predicate = cb.and(predicate, cb.equal(root.get("tuteType").get("id"), tuteTypeId));
                } catch (NumberFormatException e) {
                    // Invalid tute type ID, ignore filter
                }
            }
            
            // Filter by status
            String statusParam = request.getParameter("status");
            if (statusParam != null && !statusParam.isEmpty()) {
                boolean isActive = Boolean.parseBoolean(statusParam);
                predicate = cb.and(predicate, cb.equal(root.get("isActive"), isActive));
            }
            
            // Search by title or description
            String searchParam = request.getParameter("search");
            if (searchParam != null && !searchParam.isEmpty()) {
                String searchPattern = "%" + searchParam.toLowerCase() + "%";
                predicate = cb.and(predicate, cb.or(
                    cb.like(cb.lower(root.get("title")), searchPattern),
                    cb.like(cb.lower(root.get("description")), searchPattern)
                ));
            }
            
            cq.select(root);
            cq.where(predicate);
            cq.orderBy(cb.desc(root.get("created_at")));

            Query<Tutes> query = session.createQuery(cq);
            List<Tutes> tutes = query.getResultList();

            // Build JSON manually to avoid Hibernate proxy serialization issues
            com.google.gson.JsonArray tutesArray = new com.google.gson.JsonArray();
            for (Tutes tute : tutes) {
                com.google.gson.JsonObject tuteJson = new com.google.gson.JsonObject();
                tuteJson.addProperty("id", tute.getId());
                tuteJson.addProperty("title", tute.getTitle());
                tuteJson.addProperty("description", tute.getDescription());
                tuteJson.addProperty("link", tute.getLink());
                tuteJson.addProperty("coverImageUrl", tute.getCoverImageUrl());
                tuteJson.addProperty("price", tute.getPrice());
                tuteJson.addProperty("accessType", tute.getAccessType() != null ? tute.getAccessType().name() : "PAID");
                tuteJson.addProperty("created_at", tute.getCreated_at() != null ? tute.getCreated_at().toString() : "");
                tuteJson.addProperty("isActive", tute.isIsActive());

                if (tute.getGrade() != null) {
                    com.google.gson.JsonObject gradeJson = new com.google.gson.JsonObject();
                    gradeJson.addProperty("id", tute.getGrade().getId());
                    gradeJson.addProperty("name", tute.getGrade().getName());
                    tuteJson.add("grade", gradeJson);
                }

                if (tute.getTuteType() != null) {
                    com.google.gson.JsonObject tuteTypeJson = new com.google.gson.JsonObject();
                    tuteTypeJson.addProperty("id", tute.getTuteType().getId());
                    tuteTypeJson.addProperty("name", tute.getTuteType().getName());
                    tuteJson.add("tuteType", tuteTypeJson);
                }

                tutesArray.add(tuteJson);
            }

            jsonResponse.addProperty("success", true);
            jsonResponse.add("data", tutesArray);
            out.print(jsonResponse.toString());
        } catch (Exception e) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error fetching tutes: " + e.getMessage());
            out.print(jsonResponse.toString());
            e.printStackTrace();
        } finally {
            session.close();
        }
    }

    private void saveTute(HttpServletRequest request, PrintWriter out, JsonObject jsonResponse) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction transaction = null;
        
        try {
            // Validate input before proceeding
            String validationError = validateTuteRequest(request, session);
            if (validationError != null) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", validationError);
                out.print(jsonResponse.toString());
                return;
            }
            
            transaction = session.beginTransaction();
            
            Tutes tute = new Tutes();
            setTutePropertiesFromRequest(tute, request, session);
            
            session.persist(tute);
            transaction.commit();
            
            jsonResponse.addProperty("success", true);
            jsonResponse.addProperty("message", "Tute saved successfully");
            out.print(jsonResponse.toString());
            
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error saving tute: " + e.getMessage());
            out.print(jsonResponse.toString());
            e.printStackTrace();
        } finally {
            session.close();
        }
    }

    private void updateTute(HttpServletRequest request, PrintWriter out, JsonObject jsonResponse) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction transaction = null;
        
        try {
            String idParam = request.getParameter("id");
            if (idParam == null || idParam.isEmpty()) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "ID parameter is required for update");
                out.print(jsonResponse.toString());
                return;
            }
            
            // Validate input before proceeding
            String validationError = validateTuteRequest(request, session);
            if (validationError != null) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", validationError);
                out.print(jsonResponse.toString());
                return;
            }
            
            int id = Integer.parseInt(idParam);
            transaction = session.beginTransaction();
            
            Tutes tute = (Tutes) session.get(Tutes.class, id);
            if (tute != null) {
                setTutePropertiesFromRequest(tute, request, session);
                session.merge(tute);
                transaction.commit();
                
                jsonResponse.addProperty("success", true);
                jsonResponse.addProperty("message", "Tute updated successfully");
                out.print(jsonResponse.toString());
            } else {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Tute not found with ID: " + id);
                out.print(jsonResponse.toString());
            }
            
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error updating tute: " + e.getMessage());
            out.print(jsonResponse.toString());
            e.printStackTrace();
        } finally {
            session.close();
        }
    }

    private void deleteTute(HttpServletRequest request, PrintWriter out, JsonObject jsonResponse) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction transaction = null;
        
        try {
            String idParam = request.getParameter("id");
            if (idParam == null || idParam.isEmpty()) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "ID parameter is required for delete");
                out.print(jsonResponse.toString());
                return;
            }
            
            int id = Integer.parseInt(idParam);
            transaction = session.beginTransaction();
            
            Tutes tute = (Tutes) session.get(Tutes.class, id);
            if (tute != null) {
                // Soft delete by setting isActive to false
                tute.setIsActive(false);
                session.update(tute);
                transaction.commit();
                
                jsonResponse.addProperty("success", true);
                jsonResponse.addProperty("message", "Tute deleted successfully");
                out.print(jsonResponse.toString());
            } else {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Tute not found with ID: " + id);
                out.print(jsonResponse.toString());
            }
            
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error deleting tute: " + e.getMessage());
            out.print(jsonResponse.toString());
            e.printStackTrace();
        } finally {
            session.close();
        }
    }

    private void getTuteTypes(PrintWriter out, JsonObject jsonResponse) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        try {
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
            out.print(jsonResponse.toString());

        } catch (Exception e) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error fetching tute types: " + e.getMessage());
            out.print(jsonResponse.toString());
            e.printStackTrace();
        } finally {
            if (session != null && session.isOpen()) {
                session.close();
            }
        }
    }

    private void setTutePropertiesFromRequest(Tutes tute, HttpServletRequest request, Session session) {
        tute.setTitle(request.getParameter("title"));
        tute.setDescription(request.getParameter("description"));
        tute.setLink(request.getParameter("download_url"));
        
        // Set access type (default to PAID if not specified)
        String accessTypeParam = request.getParameter("access_type");
        if (accessTypeParam != null && !accessTypeParam.isEmpty()) {
            try {
                tute.setAccessType(AccessType.valueOf(accessTypeParam.toUpperCase()));
            } catch (IllegalArgumentException e) {
                tute.setAccessType(AccessType.PAID); // Default to PAID if invalid
            }
        } else {
            tute.setAccessType(AccessType.PAID); // Default to PAID
        }
        
        // Set price based on access type
        if (tute.getAccessType() == AccessType.FREE) {
            // FREE resources must have price = 0
            tute.setPrice(0.0);
        } else {
            // PAID resources: validate price >= 0
            String priceParam = request.getParameter("price");
            if (priceParam != null && !priceParam.isEmpty()) {
                try {
                    double price = Double.parseDouble(priceParam);
                    if (price >= 0) {
                        tute.setPrice(price);
                    } else {
                        tute.setPrice(0.0); // Default to 0 if negative
                    }
                } catch (NumberFormatException e) {
                    tute.setPrice(0.0);
                }
            } else {
                tute.setPrice(0.0); // Default to 0 if not specified
            }
        }
        
        // Set grades (support multiple grades)
        String gradeIdsParam = request.getParameter("grade_ids");
        if (gradeIdsParam != null && !gradeIdsParam.isEmpty()) {
            String[] gradeIdArray = gradeIdsParam.split(",");
            java.util.Set<Grade> grades = new java.util.HashSet<>();
            Integer firstGradeId = null;

            for (String gradeIdStr : gradeIdArray) {
                try {
                    int gradeId = Integer.parseInt(gradeIdStr.trim());
                    Grade grade = (Grade) session.get(Grade.class, gradeId);
                    if (grade != null) {
                        grades.add(grade);
                        if (firstGradeId == null) {
                            firstGradeId = gradeId;
                        }
                    }
                } catch (NumberFormatException e) {
                    // Skip invalid grade IDs
                }
            }

            if (!grades.isEmpty()) {
                tute.setGrades(grades);
                // Set legacy single grade field for backward compatibility
                if (firstGradeId != null) {
                    Grade firstGrade = (Grade) session.get(Grade.class, firstGradeId);
                    tute.setGrade(firstGrade);
                }
            }
        } else {
            // Fallback to single grade_id parameter for backward compatibility
            String gradeIdParam = request.getParameter("grade_id");
            if (gradeIdParam != null && !gradeIdParam.isEmpty()) {
                try {
                    Grade grade = (Grade) session.get(Grade.class, Integer.parseInt(gradeIdParam));
                    if (grade != null) {
                        tute.setGrade(grade);
                        tute.getGrades().add(grade);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        
        // Set tute type (default to Tute - id=1 if not specified)
        String tuteTypeIdParam = request.getParameter("tute_type_id");
        if (tuteTypeIdParam != null && !tuteTypeIdParam.isEmpty()) {
            try {
                TuteType tuteType = (TuteType) session.get(TuteType.class, Integer.parseInt(tuteTypeIdParam));
                if (tuteType != null && tuteType.isIsActive()) {
                    tute.setTuteType(tuteType);
                } else {
                    // Default to Tute (id=1) if invalid or inactive
                    TuteType defaultTuteType = (TuteType) session.get(TuteType.class, 1);
                    if (defaultTuteType != null) {
                        tute.setTuteType(defaultTuteType);
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
                // Default to Tute (id=1) on error
                TuteType defaultTuteType = (TuteType) session.get(TuteType.class, 1);
                if (defaultTuteType != null) {
                    tute.setTuteType(defaultTuteType);
                }
            }
        } else {
            // Default to Tute (id=1)
            TuteType defaultTuteType = (TuteType) session.get(TuteType.class, 1);
            if (defaultTuteType != null) {
                tute.setTuteType(defaultTuteType);
            }
        }
    }

    // Validation method for tute requests
    private String validateTuteRequest(HttpServletRequest request, Session session) {
        // Validate title
        String title = request.getParameter("title");
        if (title == null || title.trim().isEmpty()) {
            return "Title is required";
        }
        
        // Validate grades (support multiple grades via grade_ids parameter)
        String gradeIdsParam = request.getParameter("grade_ids");
        String gradeIdParam = request.getParameter("grade_id");
        
        if (gradeIdsParam != null && !gradeIdsParam.trim().isEmpty()) {
            // Validate multiple grades
            String[] gradeIdArray = gradeIdsParam.split(",");
            boolean hasValidGrade = false;
            for (String gradeIdStr : gradeIdArray) {
                try {
                    int gradeId = Integer.parseInt(gradeIdStr.trim());
                    Grade grade = (Grade) session.get(Grade.class, gradeId);
                    if (grade != null) {
                        hasValidGrade = true;
                    }
                } catch (NumberFormatException e) {
                    // Skip invalid grade IDs
                }
            }
            if (!hasValidGrade) {
                return "No valid grade IDs provided";
            }
        } else if (gradeIdParam != null && !gradeIdParam.trim().isEmpty()) {
            // Fallback to single grade validation for backward compatibility
            try {
                int gradeId = Integer.parseInt(gradeIdParam);
                Grade grade = (Grade) session.get(Grade.class, gradeId);
                if (grade == null) {
                    return "Invalid grade ID";
                }
            } catch (NumberFormatException e) {
                return "Invalid grade ID format";
            }
        } else {
            return "Grade is required";
        }
        
        // Validate access type
        String accessTypeParam = request.getParameter("access_type");
        if (accessTypeParam != null && !accessTypeParam.trim().isEmpty()) {
            try {
                AccessType.valueOf(accessTypeParam.toUpperCase());
            } catch (IllegalArgumentException e) {
                return "Invalid access type. Must be FREE or PAID";
            }
        }
        
        // Validate tute type
        String tuteTypeIdParam = request.getParameter("tute_type_id");
        if (tuteTypeIdParam == null || tuteTypeIdParam.trim().isEmpty()) {
            return "Tute Type is required";
        }
        try {
            int tuteTypeId = Integer.parseInt(tuteTypeIdParam);
            TuteType tuteType = (TuteType) session.get(TuteType.class, tuteTypeId);
            if (tuteType == null) {
                return "Invalid tute type ID";
            }
            if (!tuteType.isIsActive()) {
                return "Selected tute type is not active";
            }
        } catch (NumberFormatException e) {
            return "Invalid tute type ID format";
        }
        
        // Validate price based on access type
        String accessType = (accessTypeParam != null && !accessTypeParam.trim().isEmpty()) 
            ? accessTypeParam.toUpperCase() : "PAID";
        
        if ("FREE".equals(accessType)) {
            // FREE resources must have price = 0 (will be enforced in setTutePropertiesFromRequest)
            // No validation needed here
        } else {
            // PAID resources: price must be >= 0
            String priceParam = request.getParameter("price");
            if (priceParam != null && !priceParam.trim().isEmpty()) {
                try {
                    double price = Double.parseDouble(priceParam);
                    if (price < 0) {
                        return "Price cannot be negative";
                    }
                } catch (NumberFormatException e) {
                    return "Invalid price format";
                }
            }
        }
        
        // Validate file/link
        String downloadUrl = request.getParameter("download_url");
        if (downloadUrl == null || downloadUrl.trim().isEmpty()) {
            return "Download URL is required";
        }
        
        return null; // No validation errors
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
    public String getServletInfo() {
        return "Tutes Management Servlet";
    }
}