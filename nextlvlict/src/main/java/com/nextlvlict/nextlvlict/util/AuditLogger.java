package com.nextlvlict.nextlvlict.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.servlet.http.HttpServletRequest;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Audit Logger for security events and important actions.
 * Provides structured logging for authentication, authorization, and data changes.
 */
public class AuditLogger {

    private static final Logger logger = LoggerFactory.getLogger(AuditLogger.class);
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    // Event types
    public static final String AUTH_LOGIN_SUCCESS = "AUTH_LOGIN_SUCCESS";
    public static final String AUTH_LOGIN_FAILURE = "AUTH_LOGIN_FAILURE";
    public static final String AUTH_LOGOUT = "AUTH_LOGOUT";
    public static final String AUTH_ACCOUNT_LOCKOUT = "AUTH_ACCOUNT_LOCKOUT";
    public static final String AUTH_RATE_LIMIT_EXCEEDED = "AUTH_RATE_LIMIT_EXCEEDED";
    
    public static final String AUTHZ_ACCESS_DENIED = "AUTHZ_ACCESS_DENIED";
    public static final String AUTHZ_ACCESS_GRANTED = "AUTHZ_ACCESS_GRANTED";
    
    public static final String DATA_CREATE = "DATA_CREATE";
    public static final String DATA_UPDATE = "DATA_UPDATE";
    public static final String DATA_DELETE = "DATA_DELETE";
    public static final String DATA_READ = "DATA_READ";
    
    public static final String CSRF_VIOLATION = "CSRF_VIOLATION";
    public static final String SECURITY_ERROR = "SECURITY_ERROR";

    /**
     * Log an authentication event.
     * 
     * @param eventType The type of authentication event
     * @param userId The user ID (student ID or admin username)
     * @param userType The user type (STUDENT or ADMIN)
     * @param ipAddress The IP address of the request
     * @param details Additional details about the event
     */
    public static void logAuthEvent(String eventType, String userId, String userType, 
                                    String ipAddress, String details) {
        String logMessage = String.format("[%s] AUTH_EVENT | Type: %s | User: %s (%s) | IP: %s | Details: %s",
            LocalDateTime.now().format(formatter),
            eventType,
            userId != null ? userId : "UNKNOWN",
            userType,
            ipAddress != null ? ipAddress : "UNKNOWN",
            details != null ? details : "N/A"
        );
        
        switch (eventType) {
            case AUTH_LOGIN_SUCCESS:
            case AUTH_LOGOUT:
                logger.info(logMessage);
                break;
            case AUTH_LOGIN_FAILURE:
            case AUTH_ACCOUNT_LOCKOUT:
            case AUTH_RATE_LIMIT_EXCEEDED:
                logger.warn(logMessage);
                break;
            default:
                logger.info(logMessage);
        }
    }

    /**
     * Log an authorization event.
     * 
     * @param eventType The type of authorization event
     * @param userId The user ID
     * @param userType The user type (STUDENT or ADMIN)
     * @param resource The resource being accessed
     * @param ipAddress The IP address of the request
     * @param granted Whether access was granted
     */
    public static void logAuthzEvent(String eventType, String userId, String userType, 
                                     String resource, String ipAddress, boolean granted) {
        String logMessage = String.format("[%s] AUTHZ_EVENT | Type: %s | User: %s (%s) | Resource: %s | IP: %s | Granted: %s",
            LocalDateTime.now().format(formatter),
            eventType,
            userId != null ? userId : "UNKNOWN",
            userType,
            resource != null ? resource : "UNKNOWN",
            ipAddress != null ? ipAddress : "UNKNOWN",
            granted
        );
        
        if (!granted) {
            logger.warn(logMessage);
        } else {
            logger.info(logMessage);
        }
    }

    /**
     * Log a data modification event.
     * 
     * @param eventType The type of data event (CREATE, UPDATE, DELETE, READ)
     * @param userId The user ID performing the action
     * @param userType The user type (STUDENT or ADMIN)
     * @param entityType The type of entity being modified
     * @param entityId The ID of the entity
     * @param ipAddress The IP address of the request
     */
    public static void logDataEvent(String eventType, String userId, String userType, 
                                    String entityType, String entityId, String ipAddress) {
        String logMessage = String.format("[%s] DATA_EVENT | Type: %s | User: %s (%s) | Entity: %s | ID: %s | IP: %s",
            LocalDateTime.now().format(formatter),
            eventType,
            userId != null ? userId : "UNKNOWN",
            userType,
            entityType != null ? entityType : "UNKNOWN",
            entityId != null ? entityId : "UNKNOWN",
            ipAddress != null ? ipAddress : "UNKNOWN"
        );
        
        logger.info(logMessage);
    }

    /**
     * Log a security violation.
     * 
     * @param eventType The type of security violation
     * @param ipAddress The IP address of the request
     * @param details Additional details about the violation
     */
    public static void logSecurityViolation(String eventType, String ipAddress, String details) {
        String logMessage = String.format("[%s] SECURITY_VIOLATION | Type: %s | IP: %s | Details: %s",
            LocalDateTime.now().format(formatter),
            eventType,
            ipAddress != null ? ipAddress : "UNKNOWN",
            details != null ? details : "N/A"
        );
        
        logger.error(logMessage);
    }

    /**
     * Log a general security event.
     * 
     * @param eventType The type of security event
     * @param details Additional details about the event
     */
    public static void logSecurityEvent(String eventType, String details) {
        String logMessage = String.format("[%s] SECURITY_EVENT | Type: %s | Details: %s",
            LocalDateTime.now().format(formatter),
            eventType,
            details != null ? details : "N/A"
        );
        
        logger.info(logMessage);
    }

    /**
     * Extract IP address from request, handling proxy headers.
     * 
     * @param request The HTTP request
     * @return The IP address
     */
    public static String getClientIpAddress(HttpServletRequest request) {
        String ipAddress = request.getHeader("X-Forwarded-For");
        
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader("Proxy-Client-IP");
        }
        
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader("WL-Proxy-Client-IP");
        }
        
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getRemoteAddr();
        }
        
        // Handle multiple IPs in X-Forwarded-For (take the first one)
        if (ipAddress != null && ipAddress.contains(",")) {
            ipAddress = ipAddress.split(",")[0].trim();
        }
        
        return ipAddress;
    }

    /**
     * Log a successful login.
     * 
     * @param request The HTTP request
     * @param userId The user ID
     * @param userType The user type (STUDENT or ADMIN)
     */
    public static void logLoginSuccess(HttpServletRequest request, String userId, String userType) {
        String ipAddress = getClientIpAddress(request);
        logAuthEvent(AUTH_LOGIN_SUCCESS, userId, userType, ipAddress, "Login successful");
    }

    /**
     * Log a failed login attempt.
     * 
     * @param request The HTTP request
     * @param userId The user ID (may be null if user doesn't exist)
     * @param userType The user type (STUDENT or ADMIN)
     * @param reason The reason for failure
     */
    public static void logLoginFailure(HttpServletRequest request, String userId, String userType, String reason) {
        String ipAddress = getClientIpAddress(request);
        logAuthEvent(AUTH_LOGIN_FAILURE, userId, userType, ipAddress, reason);
    }

    /**
     * Log a logout event.
     * 
     * @param request The HTTP request
     * @param userId The user ID
     * @param userType The user type (STUDENT or ADMIN)
     */
    public static void logLogout(HttpServletRequest request, String userId, String userType) {
        String ipAddress = getClientIpAddress(request);
        logAuthEvent(AUTH_LOGOUT, userId, userType, ipAddress, "User logged out");
    }

    /**
     * Log an account lockout.
     * 
     * @param request The HTTP request
     * @param userId The user ID
     * @param userType The user type (STUDENT or ADMIN)
     */
    public static void logAccountLockout(HttpServletRequest request, String userId, String userType) {
        String ipAddress = getClientIpAddress(request);
        logAuthEvent(AUTH_ACCOUNT_LOCKOUT, userId, userType, ipAddress, "Account locked due to too many failed attempts");
    }
}
