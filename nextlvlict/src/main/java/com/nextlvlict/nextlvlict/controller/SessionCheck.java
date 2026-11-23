package com.nextlvlict.nextlvlict.controller;

import com.google.gson.JsonObject;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "SessionCheck", urlPatterns = {"/SessionCheck"})
public class SessionCheck extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        JsonObject jsonResponse = new JsonObject();
        
        HttpSession session = request.getSession(false);
        
        if (session != null) {
            String studentId = (String) session.getAttribute("studentId");
            jsonResponse.addProperty("success", true);
            jsonResponse.addProperty("sessionId", session.getId());
            jsonResponse.addProperty("studentId", studentId != null ? studentId : "null");
        } else {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "No active session");
        }
        
        out.print(jsonResponse.toString());
    }
}
