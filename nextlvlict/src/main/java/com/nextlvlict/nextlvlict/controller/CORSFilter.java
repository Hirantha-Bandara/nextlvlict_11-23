package com.nextlvlict.nextlvlict.controller;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Centralized CORS Filter for cross-origin request handling.
 * Provides environment-specific origin validation and standardized CORS headers.
 * Registered in web.xml.
 */
public class CORSFilter implements Filter {

    // Production origins
    private static final Set<String> PRODUCTION_ORIGINS = new HashSet<>(Arrays.asList(
        "https://nextlvlict.com",
        "https://portfolio.nextlvlict.com",
        "https://www.nextlvlict.com",
            "http://localhost:5173",
            "https://localhost:5173",
            "http://localhost:8081",
            "http://127.0.0.1:8081"
    ));

    // Development origins
    private static final Set<String> DEVELOPMENT_ORIGINS = new HashSet<>(Arrays.asList(
        "http://localhost:5173",
        "https://localhost:5173",
        "http://localhost:8081",
        "http://localhost:3000",
        "http://localhost:8080"
    ));

    // Ngrok patterns for development (disabled in production)
//    private static final Set<String> NGROK_PATTERNS = new HashSet<>(Arrays.asList(
//        "https://*.ngrok-free.app",
//        "http://*.ngrok-free.app"
//    ));

    // Environment flag - set to "production" to disable development origins
    private static final String ENVIRONMENT = System.getenv().getOrDefault("APP_ENV", "development");

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        String origin = request.getHeader("Origin");

        // Log origin for debugging (only in development)
        if ("development".equalsIgnoreCase(ENVIRONMENT)) {
            System.out.println("CORS: Origin = " + origin + ", Environment = " + ENVIRONMENT);
        }

        // Validate and set Access-Control-Allow-Origin
        if (origin != null && isAllowedOrigin(origin)) {
            response.setHeader("Access-Control-Allow-Origin", origin);
        }

        // Standardized CORS headers
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
        response.setHeader("Access-Control-Allow-Headers",
            "Content-Type, Authorization, X-Session-Id, X-Auth-Token, X-Requested-With");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Max-Age", "3600"); // 1 hour cache for preflight
        response.setHeader("Vary", "Origin"); // Important for caching

        // Handle preflight requests
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        chain.doFilter(req, res);
    }

    /**
     * Check if the origin is allowed based on environment configuration.
     * 
     * @param origin The origin to check
     * @return true if allowed, false otherwise
     */
    private boolean isAllowedOrigin(String origin) {
        // Check production origins (always allowed)
        if (PRODUCTION_ORIGINS.contains(origin)) {
            return true;
        }

        // In production mode, only allow production origins
        if ("production".equalsIgnoreCase(ENVIRONMENT)) {
            return false;
        }

        // In development mode, allow development origins
        if (DEVELOPMENT_ORIGINS.contains(origin)) {
            return true;
        }

        // Check ngrok patterns (development only)
//        for (String pattern : NGROK_PATTERNS) {
//            if (matchesPattern(origin, pattern)) {
//                return true;
//            }
//        }

        return false;
    }

    /**
     * Check if origin matches a wildcard pattern.
     * 
     * @param origin The origin to check
     * @param pattern The pattern (e.g., "https://*.ngrok-free.app")
     * @return true if matches, false otherwise
     */
    private boolean matchesPattern(String origin, String pattern) {
        if (!pattern.contains("*")) {
            return origin.equals(pattern);
        }

        String[] patternParts = pattern.split("\\.");
        String[] originParts = origin.split("\\.");

        if (patternParts.length != originParts.length) {
            return false;
        }

        for (int i = 0; i < patternParts.length; i++) {
            String patternPart = patternParts[i];
            String originPart = originParts[i];

            if (!patternPart.equals("*") && !patternPart.equals(originPart)) {
                return false;
            }
        }

        return true;
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // Log CORS configuration on startup
        System.out.println("CORS Filter initialized with environment: " + ENVIRONMENT);
        System.out.println("Production origins: " + PRODUCTION_ORIGINS);
        if ("development".equalsIgnoreCase(ENVIRONMENT)) {
            System.out.println("Development origins: " + DEVELOPMENT_ORIGINS);
//            System.out.println("Ngrok patterns: " + NGROK_PATTERNS);
        }
    }

    @Override
    public void destroy() {
        // Cleanup if needed
    }
}
