package com.nextlvlict.nextlvlict.controller;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.nextlvlict.nextlvlict.hibernate.Grade;
import com.nextlvlict.nextlvlict.hibernate.HibernateUtil;
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

@WebServlet(name = "GradeServlet", urlPatterns = {"/GradeServlet"})
public class GradeServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        JsonObject jsonResponse = new JsonObject();

        Session session = null;

        try {
            String olAlIdParam = request.getParameter("olAlId");
            
            session = HibernateUtil.getSessionFactory().openSession();

            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Grade> cq = cb.createQuery(Grade.class);
            Root<Grade> root = cq.from(Grade.class);

            // Add is_active filter
            cq.where(cb.equal(root.get("is_active"), 1));

            // Add OL/AL filter if provided
            if (olAlIdParam != null && !olAlIdParam.isEmpty()) {
                try {
                    int olAlId = Integer.parseInt(olAlIdParam);
                    Join<Grade, Object> olAlJoin = root.join("ol_or_al");
                    cq.where(cb.and(
                        cb.equal(root.get("is_active"), 1),
                        cb.equal(olAlJoin.get("id"), olAlId)
                    ));
                } catch (NumberFormatException e) {
                    // If olAlId is not a valid number, ignore the filter
                }
            }
            
            // Add ordering and execute query
            cq.orderBy(cb.asc(root.get("name")));

            Query<Grade> query = session.createQuery(cq);
            List<Grade> grades = query.getResultList();

            JsonArray gradesArray = new JsonArray();
            for (Grade grade : grades) {
                JsonObject gradeJson = new JsonObject();
                gradeJson.addProperty("id", grade.getId());
                gradeJson.addProperty("name", grade.getName());
                gradeJson.addProperty("fee", grade.getFee());
                gradesArray.add(gradeJson);
            }

            jsonResponse.addProperty("success", true);
            jsonResponse.add("grades", gradesArray);

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error fetching grades: " + e.getMessage());
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
