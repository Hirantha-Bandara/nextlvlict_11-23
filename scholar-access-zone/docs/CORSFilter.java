package com.nextlvlict.nextlvlict.controller;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebFilter("/*")
public class CORSFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // no-op
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        System.out.println("CORS FILTER RUNNING");
        System.out.println("Origin = " + request.getHeader("Origin"));

        String origin = request.getHeader("Origin");
        if (origin != null && !origin.trim().isEmpty()) {
            response.setHeader("Access-Control-Allow-Origin", origin);
            response.setHeader("Vary", "Origin");
        }
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept, Origin, X-Auth-Token, X-Admin-Token, X-Session-Id, ngrok-skip-browser-warning");
        response.setHeader("Access-Control-Expose-Headers", "X-Session-Id, X-Auth-Token");

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }
        chain.doFilter(req, res);
    }

    @Override
    public void destroy() {
        // no-op
    }
}
