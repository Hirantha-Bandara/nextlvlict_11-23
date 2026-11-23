package com.nextlvlict.nextlvlict.controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Enumeration;

@WebServlet(name = "SessionDebug", urlPatterns = {"/SessionDebug"})
public class SessionDebug extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/plain");
        PrintWriter out = response.getWriter();

        HttpSession session = request.getSession();

        out.println("=== SESSION DEBUG ===");
        out.println("Session ID: " + session.getId());
        out.println("Is New Session: " + session.isNew());

        // Print all session attributes
        out.println("Session Attributes:");
        Enumeration<String> attrNames = session.getAttributeNames();
        while (attrNames.hasMoreElements()) {
            String name = attrNames.nextElement();
            out.println(name + " = " + session.getAttribute(name));
        }

        // JSESSIONID cookie setting removed - using X-Auth-Token and X-Session-Id instead
    }
}

