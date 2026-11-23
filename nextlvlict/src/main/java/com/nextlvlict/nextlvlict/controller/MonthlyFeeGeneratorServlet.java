// MonthlyFeeGeneratorServlet.java
package com.nextlvlict.nextlvlict.controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "MonthlyFeeGeneratorServlet", urlPatterns = {"/MonthlyFeeGeneratorServlet"})
public class MonthlyFeeGeneratorServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        try {
            MonthlyFeeService.generateMonthlyFees();
            response.getWriter().write("{\"success\": true, \"message\": \"Monthly fees generated successfully\"}");
            
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"success\": false, \"message\": \"Error generating monthly fees: " + e.getMessage() + "\"}");
        }
    }
}
