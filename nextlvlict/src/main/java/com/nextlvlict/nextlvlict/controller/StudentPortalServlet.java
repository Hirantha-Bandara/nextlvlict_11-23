package com.nextlvlict.nextlvlict.controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.nextlvlict.nextlvlict.dto.WelcomeNavigationDTO;
import com.nextlvlict.nextlvlict.hibernate.AccessType;
import com.nextlvlict.nextlvlict.hibernate.Grade;
import com.nextlvlict.nextlvlict.hibernate.HibernateUtil;
import com.nextlvlict.nextlvlict.hibernate.Students;
import com.nextlvlict.nextlvlict.hibernate.Tutes;
import org.hibernate.Session;
import org.hibernate.query.Query;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

@WebServlet(name = "StudentPortalServlet", urlPatterns = {"/StudentPortal"})
public class StudentPortalServlet extends HttpServlet {

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

            if ("getWelcomeNavigation".equals(action)) {
                // Check if user is authenticated
                HttpSession httpSession = request.getSession(false);
                if (httpSession == null) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    jsonResponse.addProperty("success", false);
                    jsonResponse.addProperty("message", "No active session");
                    out.print(jsonResponse.toString());
                    return;
                }

                String studentId = (String) httpSession.getAttribute("studentId");
                if (studentId == null) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    jsonResponse.addProperty("success", false);
                    jsonResponse.addProperty("message", "Student not authenticated");
                    out.print(jsonResponse.toString());
                    return;
                }

                session = HibernateUtil.getSessionFactory().openSession();

                // Get student information
                Students student = (Students) session.get(Students.class, studentId);
                if (student == null) {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    jsonResponse.addProperty("success", false);
                    jsonResponse.addProperty("message", "Student not found");
                    out.print(jsonResponse.toString());
                    return;
                }

                // Get student's registered grade
                WelcomeNavigationDTO.GradeInfo registeredGrade = null;
                if (student.getGrade() != null) {
                    registeredGrade = new WelcomeNavigationDTO.GradeInfo(
                        student.getGrade().getId(),
                        student.getGrade().getName()
                    );
                }

                // Get all active grades
                List<WelcomeNavigationDTO.GradeInfo> allGrades = getActiveGrades(session);

                // Check if free resources are available
                boolean hasFreeResources = hasFreeResourcesAvailable(session);

                // Check if question papers are available
                boolean hasQuestionPapers = hasQuestionPapersAvailable(session);

                // Build response
                WelcomeNavigationDTO welcomeNav = new WelcomeNavigationDTO(
                    registeredGrade,
                    allGrades,
                    hasFreeResources,
                    hasQuestionPapers
                );

                Gson gson = new Gson();
                jsonResponse.addProperty("success", true);
                jsonResponse.add("data", gson.toJsonTree(welcomeNav));

            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
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
        doGet(request, response);
    }

    /**
     * Get all active grades from database, sorted naturally by name
     */
    private List<WelcomeNavigationDTO.GradeInfo> getActiveGrades(Session session) {
        List<WelcomeNavigationDTO.GradeInfo> grades = new ArrayList<>();

        try {
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Grade> cq = cb.createQuery(Grade.class);
            Root<Grade> root = cq.from(Grade.class);

            // Filter only active grades
            cq.where(cb.equal(root.get("is_active"), 1));
            
            // Sort naturally by name
            cq.orderBy(cb.asc(root.get("name")));

            Query<Grade> query = session.createQuery(cq);
            List<Grade> gradeList = query.getResultList();

            for (Grade grade : gradeList) {
                grades.add(new WelcomeNavigationDTO.GradeInfo(grade.getId(), grade.getName()));
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return grades;
    }

    /**
     * Check if there are any FREE resources available (tuteTypeId = 1 for Tutes)
     */
    private boolean hasFreeResourcesAvailable(Session session) {
        try {
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Long> cq = cb.createQuery(Long.class);
            Root<Tutes> root = cq.from(Tutes.class);

            // Count FREE and active tutes with tuteTypeId = 1 (Tutes)
            Predicate predicate = cb.and(
                cb.equal(root.get("isActive"), true),
                cb.equal(root.get("accessType"), AccessType.FREE),
                cb.equal(root.get("tuteType").get("id"), 1)
            );

            cq.select(cb.count(root));
            cq.where(predicate);

            Query<Long> query = session.createQuery(cq);
            Long count = query.uniqueResult();

            return count != null && count > 0;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Check if there are any FREE question papers available (tuteTypeId = 2 for Question Papers)
     */
    private boolean hasQuestionPapersAvailable(Session session) {
        try {
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Long> cq = cb.createQuery(Long.class);
            Root<Tutes> root = cq.from(Tutes.class);

            // Count FREE and active tutes with tuteTypeId = 2 (Question Papers)
            Predicate predicate = cb.and(
                cb.equal(root.get("isActive"), true),
                cb.equal(root.get("accessType"), AccessType.FREE),
                cb.equal(root.get("tuteType").get("id"), 2)
            );

            cq.select(cb.count(root));
            cq.where(predicate);

            Query<Long> query = session.createQuery(cq);
            Long count = query.uniqueResult();

            return count != null && count > 0;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
