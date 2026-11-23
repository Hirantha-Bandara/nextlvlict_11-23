package com.nextlvlict.nextlvlict.filter;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Security Headers Filter for adding comprehensive security headers to all responses.
 * Implements OWASP recommended security headers for defense in depth.
 * Registered in web.xml.
 */
public class SecurityHeadersFilter implements Filter {

    // Environment flag - set to "production" to enable strict security headers
    private static final String ENVIRONMENT = System.getenv().getOrDefault("APP_ENV", "development");

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        System.out.println("Security Headers Filter initialized with environment: " + ENVIRONMENT);
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        if (response instanceof HttpServletResponse) {
            HttpServletResponse httpResponse = (HttpServletResponse) response;

            // Content Security Policy (CSP)
            // Restricts sources from which content can be loaded
            String cspPolicy;
            if ("production".equalsIgnoreCase(ENVIRONMENT)) {
                // Strict CSP for production
                cspPolicy = "default-src 'self'; " +
                           "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
                           "style-src 'self' 'unsafe-inline'; " +
                           "img-src 'self' data: https:; " +
                           "font-src 'self'; " +
                           "connect-src 'self'; " +
                           "frame-ancestors 'none'; " +
                           "base-uri 'self'; " +
                           "form-action 'self';";
            } else {
                // Relaxed CSP for development
                cspPolicy = "default-src 'self'; " +
                           "script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:*; " +
                           "style-src 'self' 'unsafe-inline' http://localhost:*; " +
                           "img-src 'self' data: https: http://localhost:*; " +
                           "font-src 'self'; " +
                           "connect-src 'self' http://localhost:* https://*.ngrok-free.app; " +
                           "frame-ancestors 'self'; " +
                           "base-uri 'self'; " +
                           "form-action 'self';";
            }
            httpResponse.setHeader("Content-Security-Policy", cspPolicy);

            // X-Frame-Options: Prevents clickjacking attacks
            // SAMEORIGIN allows framing only from same origin
            httpResponse.setHeader("X-Frame-Options", "SAMEORIGIN");

            // X-Content-Type-Options: Prevents MIME type sniffing
            // nosniff forces browser to respect declared content type
            httpResponse.setHeader("X-Content-Type-Options", "nosniff");

            // X-XSS-Protection: Enables browser XSS filter
            // 1; mode=block enables and blocks XSS attacks
            httpResponse.setHeader("X-XSS-Protection", "1; mode=block");

            // Referrer-Policy: Controls information sent in Referer header
            // strict-origin-when-cross-origin sends full URL to same origin, origin only to cross-origin
            httpResponse.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

            // Permissions-Policy (formerly Feature-Policy): Controls browser features
            // Disables unnecessary features for security
            String permissionsPolicy = "geolocation=(), " +
                                      "microphone=(), " +
                                      "camera=(), " +
                                      "payment=(), " +
                                      "usb=(), " +
                                      "magnetometer=(), " +
                                      "gyroscope=(), " +
                                      "accelerometer=()";
            httpResponse.setHeader("Permissions-Policy", permissionsPolicy);

            // Strict-Transport-Security (HSTS): Enforces HTTPS (only in production with HTTPS)
            if ("production".equalsIgnoreCase(ENVIRONMENT) && request.isSecure()) {
                // max-age=31536000 (1 year), includeSubDomains, preload
                httpResponse.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
            }

            // Cross-Origin-Opener-Policy: Controls cross-origin window access
            httpResponse.setHeader("Cross-Origin-Opener-Policy", "same-origin");

            // Cross-Origin-Embedder-Policy: Controls cross-origin resource embedding
            // require-corp requires CORP/COOP headers for cross-origin resources
            httpResponse.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
        }

        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
        // Cleanup if needed
    }
}
