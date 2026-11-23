package com.nextlvlict.nextlvlict.controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.nextlvlict.nextlvlict.hibernate.HibernateUtil;
import com.nextlvlict.nextlvlict.hibernate.Provinces;
import org.hibernate.Session;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet(name = "ProvincesServlet", urlPatterns = {"/ProvincesServlet"})
public class ProvincesServlet extends HttpServlet {

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

            // Get all provinces
            String query = "FROM Provinces ORDER BY name";
            @SuppressWarnings("unchecked")
            List<Provinces> provinces = session.createQuery(query).list();

            Gson gson = new Gson();
            jsonResponse.addProperty("success", true);
            jsonResponse.add("provinces", gson.toJsonTree(provinces));

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error loading provinces: " + e.getMessage());
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

