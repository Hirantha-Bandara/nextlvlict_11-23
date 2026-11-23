package com.nextlvlict.nextlvlict.controller;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.nextlvlict.nextlvlict.hibernate.ClassType;
import com.nextlvlict.nextlvlict.hibernate.HibernateUtil;
import org.hibernate.Session;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet(name = "ClassTypeServlet", urlPatterns = {"/ClassTypeServlet"})
public class ClassTypeServlet extends HttpServlet {

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

            // Get all active class types ordered by id
            @SuppressWarnings("unchecked")
            List<ClassType> classTypes = session.createQuery(
                "FROM ClassType WHERE isActive = 1 ORDER BY id ASC"
            ).list();

            JsonArray classTypesArray = new JsonArray();

            for (ClassType classType : classTypes) {
                JsonObject classTypeJson = new JsonObject();
                classTypeJson.addProperty("id", classType.getId());
                classTypeJson.addProperty("name", classType.getName());
                classTypesArray.add(classTypeJson);
            }

            jsonResponse.addProperty("success", true);
            jsonResponse.add("classTypes", classTypesArray);

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Failed to retrieve class types");
        } finally {
            if (session != null && session.isOpen()) {
                try {
                    session.close();
                } catch (Exception closeEx) {
                    closeEx.printStackTrace();
                }
            }
            out.print(jsonResponse.toString());
            out.flush();
        }
    }
}
