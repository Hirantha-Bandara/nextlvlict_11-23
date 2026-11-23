package com.nextlvlict.nextlvlict.controller;

import com.google.gson.JsonObject;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Enumeration;

@WebServlet(name = "DebugServlet", urlPatterns = {"/DebugServlet"})
public class DebugServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        JsonObject jsonResponse = new JsonObject();
        
        try {
            // Log all parameters
            Enumeration<String> paramNames = request.getParameterNames();
            JsonObject params = new JsonObject();
            
            while (paramNames.hasMoreElements()) {
                String paramName = paramNames.nextElement();
                String paramValue = request.getParameter(paramName);
                params.addProperty(paramName, paramValue);
            }
            
            jsonResponse.addProperty("success", true);
            jsonResponse.addProperty("message", "Debug information");
            jsonResponse.add("parameters", params);
            
        } catch (Exception e) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error: " + e.getMessage());
        } finally {
            out.print(jsonResponse.toString());
            out.flush();
        }
    }
}
