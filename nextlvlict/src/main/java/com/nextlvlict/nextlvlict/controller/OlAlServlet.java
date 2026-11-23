package com.nextlvlict.nextlvlict.controller;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.nextlvlict.nextlvlict.hibernate.HibernateUtil;
import com.nextlvlict.nextlvlict.hibernate.Ol_or_Al;
import org.hibernate.Session;
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

@WebServlet(name = "OlAlServlet", urlPatterns = {"/OlAlServlet"})
public class OlAlServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        JsonObject jsonResponse = new JsonObject();

        Session session = null;

        try {
            session = HibernateUtil.getSessionFactory().openSession();

            // Fetch all OL/AL options using JPA Criteria
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Ol_or_Al> cq = cb.createQuery(Ol_or_Al.class);
            Root<Ol_or_Al> root = cq.from(Ol_or_Al.class);
            cq.select(root);
            cq.orderBy(cb.asc(root.get("id")));

            Query<Ol_or_Al> query = session.createQuery(cq);
            List<Ol_or_Al> olAlOptions = query.getResultList();

            JsonArray olAlArray = new JsonArray();
            for (Ol_or_Al olAl : olAlOptions) {
                JsonObject olAlJson = new JsonObject();
                olAlJson.addProperty("id", olAl.getId());
                olAlJson.addProperty("name", olAl.getName());
                olAlArray.add(olAlJson);
            }

            jsonResponse.addProperty("success", true);
            jsonResponse.add("olAlOptions", olAlArray);

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error fetching OL/AL options: " + e.getMessage());
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
