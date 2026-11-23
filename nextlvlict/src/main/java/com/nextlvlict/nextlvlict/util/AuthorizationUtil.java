package com.nextlvlict.nextlvlict.util;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

/**
 * Centralized Authorization Utility for standardized permission checks.
 * Provides consistent Student/Admin authorization validation across the application using X-Auth-Token and X-Session-Id.
 */
public class AuthorizationUtil {

    /**
     * Check if the current request has an authenticated admin via X-Auth-Token.
     *
     * @param request The HTTP request
     * @return true if admin is authenticated, false otherwise
     */
    public static boolean isAdminAuthenticated(HttpServletRequest request) {
        String authToken = request.getHeader("X-Auth-Token");
        return AdminAuthTokenStore.validate(authToken) != null;
    }

    /**
     * Check if the current session has an authenticated student.
     *
     * @param request The HTTP request
     * @return true if student is authenticated, false otherwise
     */
    public static boolean isStudentAuthenticated(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            return false;
        }
        return session.getAttribute("studentId") != null;
    }

    /**
     * Get the authenticated admin ID from the X-Auth-Token.
     *
     * @param request The HTTP request
     * @return The admin ID, or null if not authenticated
     */
    public static Integer getAdminId(HttpServletRequest request) {
        String authToken = request.getHeader("X-Auth-Token");
        AdminAuthTokenStore.AuthData authData = AdminAuthTokenStore.validate(authToken);
        if (authData != null) {
            return authData.getAdminId().intValue();
        }
        return null;
    }

    /**
     * Get the authenticated admin username from the X-Auth-Token.
     *
     * @param request The HTTP request
     * @return The admin username, or null if not authenticated
     */
    public static String getAdminUsername(HttpServletRequest request) {
        String authToken = request.getHeader("X-Auth-Token");
        AdminAuthTokenStore.AuthData authData = AdminAuthTokenStore.validate(authToken);
        if (authData != null) {
            return authData.getAdminUsername();
        }
        return null;
    }

    /**
     * Get the authenticated student ID from the session.
     *
     * @param request The HTTP request
     * @return The student ID, or null if not authenticated
     */
    public static String getStudentId(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            return null;
        }
        return (String) session.getAttribute("studentId");
    }

    /**
     * Check if the current request has either a student or admin authenticated.
     *
     * @param request The HTTP request
     * @return true if either student or admin is authenticated, false otherwise
     */
    public static boolean isAuthenticated(HttpServletRequest request) {
        return isStudentAuthenticated(request) || isAdminAuthenticated(request);
    }

    /**
     * Require student authentication. Returns error response if not authenticated.
     *
     * @param request The HTTP request
     * @param response The HTTP response
     * @return true if authenticated, false if not (error response already sent)
     */
    public static boolean requireStudentAuthentication(HttpServletRequest request,
                                                        jakarta.servlet.http.HttpServletResponse response)
            throws java.io.IOException {
        if (!isStudentAuthenticated(request)) {
            response.setStatus(jakarta.servlet.http.HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"success\":false,\"message\":\"Student authentication required\"}");
            return false;
        }
        return true;
    }

    /**
     * Require admin authentication. Returns error response if not authenticated.
     *
     * @param request The HTTP request
     * @param response The HTTP response
     * @return true if authenticated, false if not (error response already sent)
     */
    public static boolean requireAdminAuthentication(HttpServletRequest request,
                                                      jakarta.servlet.http.HttpServletResponse response)
            throws java.io.IOException {
        if (!isAdminAuthenticated(request)) {
            response.setStatus(jakarta.servlet.http.HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"success\":false,\"message\":\"Admin authentication required\"}");
            return false;
        }
        return true;
    }

    /**
     * Require any authentication (student or admin). Returns error response if not authenticated.
     *
     * @param request The HTTP request
     * @param response The HTTP response
     * @return true if authenticated, false if not (error response already sent)
     */
    public static boolean requireAuthentication(HttpServletRequest request,
                                                  jakarta.servlet.http.HttpServletResponse response)
            throws java.io.IOException {
        if (!isAuthenticated(request)) {
            response.setStatus(jakarta.servlet.http.HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"success\":false,\"message\":\"Authentication required\"}");
            return false;
        }
        return true;
    }

    /**
     * Logout by revoking the auth token and invalidating session.
     *
     * @param request The HTTP request
     */
    public static void logout(HttpServletRequest request) {
        String authToken = request.getHeader("X-Auth-Token");
        if (authToken != null) {
            AdminAuthTokenStore.revoke(authToken);
        }
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
    }

    /**
     * Check if the current user is the specified student.
     *
     * @param request The HTTP request
     * @param studentId The student ID to check against
     * @return true if the current session belongs to the specified student
     */
    public static boolean isCurrentStudent(HttpServletRequest request, String studentId) {
        String currentStudentId = getStudentId(request);
        return currentStudentId != null && currentStudentId.equals(studentId);
    }

    /**
     * Check if the current user is the specified admin.
     *
     * @param request The HTTP request
     * @param adminId The admin ID to check against
     * @return true if the current token belongs to the specified admin
     */
    public static boolean isCurrentAdmin(HttpServletRequest request, Integer adminId) {
        Integer currentAdminId = getAdminId(request);
        return currentAdminId != null && currentAdminId.equals(adminId);
    }
}
