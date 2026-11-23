package com.nextlvlict.nextlvlict.filter;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * CSRF Protection Filter for state-changing operations.
 * Validates Origin and Referer headers for POST, PUT, DELETE, PATCH requests.
 * Works in conjunction with SameSite cookie attribute for comprehensive CSRF protection.
 * Registered in web.xml.
 */
public class CSRFProtectionFilter implements Filter {

    // Allowed origins for CSRF protection
    private static final Set<String> ALLOWED_ORIGINS = new HashSet<>(Arrays.asList(
        "http://localhost:5173",
        "http://localhost:8081",
        "http://localhost:3000",
        "https://nextlvlict.com"
    ));

    // Allowed ngrok origins for development
    private static final Set<String> ALLOWED_NGROK_PATTERNS = new HashSet<>(Arrays.asList(
        "https://*.ngrok-free.app",
        "http://*.ngrok-free.app"
    ));

    // State-changing methods that require CSRF protection
    private static final Set<String> STATE_CHANGING_METHODS = new HashSet<>(Arrays.asList(
        "POST", "PUT", "DELETE", "PATCH"
    ));

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // Initialization if needed
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String method = httpRequest.getMethod();
        String requestURI = httpRequest.getRequestURI();

        // Skip CSRF check for GET, HEAD, OPTIONS, TRACE methods (safe methods)
        if (!STATE_CHANGING_METHODS.contains(method.toUpperCase())) {
            chain.doFilter(request, response);
            return;
        }

        // Skip CSRF check for login endpoints (they handle their own rate limiting)
        if (requestURI.equals("/LoginServlet") || requestURI.equals("/AdminLogin")) {
            chain.doFilter(request, response);
            return;
        }

        // Get Origin header (preferred) or Referer header (fallback)
        String origin = httpRequest.getHeader("Origin");
        String referer = httpRequest.getHeader("Referer");

        // Validate Origin header
        if (origin != null && !origin.isEmpty()) {
            if (!isAllowedOrigin(origin)) {
                httpResponse.setStatus(HttpServletResponse.SC_FORBIDDEN);
                httpResponse.setContentType("application/json");
                httpResponse.getWriter().write("{\"success\":false,\"message\":\"CSRF validation failed: Invalid Origin header\"}");
                return;
            }
        } else if (referer != null && !referer.isEmpty()) {
            // Fallback to Referer if Origin is not present
            if (!isAllowedOrigin(referer)) {
                httpResponse.setStatus(HttpServletResponse.SC_FORBIDDEN);
                httpResponse.setContentType("application/json");
                httpResponse.getWriter().write("{\"success\":false,\"message\":\"CSRF validation failed: Invalid Referer header\"}");
                return;
            }
        } else {
            // Neither Origin nor Referer present - reject for state-changing operations
            httpResponse.setStatus(HttpServletResponse.SC_FORBIDDEN);
            httpResponse.setContentType("application/json");
            httpResponse.getWriter().write("{\"success\":false,\"message\":\"CSRF validation failed: Missing Origin and Referer headers\"}");
            return;
        }

        chain.doFilter(request, response);
    }

    /**
     * Check if the origin is allowed.
     * 
     * @param origin The origin to check
     * @return true if allowed, false otherwise
     */
    private boolean isAllowedOrigin(String origin) {
        // Extract origin from URL if it's a full URL (for Referer header)
        String originToCheck = origin;
        if (origin.contains("://")) {
            try {
                originToCheck = origin.substring(0, origin.indexOf("/", origin.indexOf("://") + 3));
            } catch (Exception e) {
                // If parsing fails, use the original
                originToCheck = origin;
            }
        }

        // Check exact matches
        if (ALLOWED_ORIGINS.contains(originToCheck)) {
            return true;
        }

        // Check ngrok patterns
        for (String pattern : ALLOWED_NGROK_PATTERNS) {
            if (matchesPattern(originToCheck, pattern)) {
                return true;
            }
        }

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
    public void destroy() {
        // Cleanup if needed
    }
}
