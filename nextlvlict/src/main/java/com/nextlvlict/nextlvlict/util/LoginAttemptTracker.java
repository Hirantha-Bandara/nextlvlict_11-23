package com.nextlvlict.nextlvlict.util;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Tracks login attempts for rate limiting and account lockout.
 * Uses in-memory storage for failed login attempts.
 */
public class LoginAttemptTracker {

    // Maximum failed login attempts before lockout
    private static final int MAX_FAILED_ATTEMPTS = 5;
    
    // Lockout duration in milliseconds (15 minutes)
    private static final long LOCKOUT_DURATION_MS = 15 * 60 * 1000;
    
    // Rate limit: maximum login attempts per minute per IP
    private static final int MAX_ATTEMPTS_PER_MINUTE = 10;
    
    // Track failed attempts by identifier (mobile for students, username for admins)
    private static final Map<String, FailedAttemptInfo> failedAttempts = new ConcurrentHashMap<>();
    
    // Track rate limiting by IP address
    private static final Map<String, RateLimitInfo> rateLimitInfo = new ConcurrentHashMap<>();

    /**
     * Record a failed login attempt.
     * 
     * @param identifier The user identifier (mobile or username)
     * @return true if account should be locked out, false otherwise
     */
    public static boolean recordFailedAttempt(String identifier) {
        FailedAttemptInfo info = failedAttempts.computeIfAbsent(identifier, k -> new FailedAttemptInfo());
        
        synchronized (info) {
            info.incrementAttempts();
            info.setLastAttemptTime(System.currentTimeMillis());
            
            // Check if account should be locked out
            if (info.getAttemptCount() >= MAX_FAILED_ATTEMPTS) {
                info.setLockoutTime(System.currentTimeMillis());
                return true;
            }
        }
        
        return false;
    }

    /**
     * Check if an account is currently locked out.
     * 
     * @param identifier The user identifier (mobile or username)
     * @return true if account is locked out, false otherwise
     */
    public static boolean isLockedOut(String identifier) {
        FailedAttemptInfo info = failedAttempts.get(identifier);
        
        if (info == null) {
            return false;
        }
        
        synchronized (info) {
            long lockoutTime = info.getLockoutTime();
            
            if (lockoutTime == 0) {
                return false;
            }
            
            // Check if lockout period has expired
            long timeSinceLockout = System.currentTimeMillis() - lockoutTime;
            if (timeSinceLockout > LOCKOUT_DURATION_MS) {
                // Lockout expired, reset attempts
                resetAttempts(identifier);
                return false;
            }
            
            return true;
        }
    }

    /**
     * Get remaining lockout time in seconds.
     * 
     * @param identifier The user identifier (mobile or username)
     * @return Remaining lockout time in seconds, or 0 if not locked out
     */
    public static long getRemainingLockoutTime(String identifier) {
        FailedAttemptInfo info = failedAttempts.get(identifier);
        
        if (info == null) {
            return 0;
        }
        
        synchronized (info) {
            long lockoutTime = info.getLockoutTime();
            
            if (lockoutTime == 0) {
                return 0;
            }
            
            long timeSinceLockout = System.currentTimeMillis() - lockoutTime;
            long remainingTime = LOCKOUT_DURATION_MS - timeSinceLockout;
            
            return Math.max(0, remainingTime / 1000);
        }
    }

    /**
     * Reset failed login attempts after successful login.
     * 
     * @param identifier The user identifier (mobile or username)
     */
    public static void resetAttempts(String identifier) {
        failedAttempts.remove(identifier);
    }

    /**
     * Check if IP address has exceeded rate limit.
     * 
     * @param ipAddress The IP address
     * @return true if rate limit exceeded, false otherwise
     */
    public static boolean isRateLimited(String ipAddress) {
        RateLimitInfo info = rateLimitInfo.computeIfAbsent(ipAddress, k -> new RateLimitInfo());
        
        synchronized (info) {
            long currentTime = System.currentTimeMillis();
            
            // Reset counter if more than 1 minute has passed
            if (currentTime - info.getLastAttemptTime() > 60 * 1000) {
                info.resetAttempts();
                info.setLastAttemptTime(currentTime);
            }
            
            info.incrementAttempts();
            
            return info.getAttemptCount() > MAX_ATTEMPTS_PER_MINUTE;
        }
    }

    /**
     * Get remaining rate limit time in seconds.
     * 
     * @param ipAddress The IP address
     * @return Remaining time in seconds before rate limit resets, or 0 if not rate limited
     */
    public static long getRateLimitResetTime(String ipAddress) {
        RateLimitInfo info = rateLimitInfo.get(ipAddress);
        
        if (info == null) {
            return 0;
        }
        
        synchronized (info) {
            long timeSinceLastAttempt = System.currentTimeMillis() - info.getLastAttemptTime();
            long remainingTime = 60 * 1000 - timeSinceLastAttempt;
            
            return Math.max(0, remainingTime / 1000);
        }
    }

    /**
     * Inner class to track failed attempt information.
     */
    private static class FailedAttemptInfo {
        private final AtomicInteger attemptCount = new AtomicInteger(0);
        private volatile long lastAttemptTime = 0;
        private volatile long lockoutTime = 0;

        public int getAttemptCount() {
            return attemptCount.get();
        }

        public void incrementAttempts() {
            attemptCount.incrementAndGet();
        }

        public long getLastAttemptTime() {
            return lastAttemptTime;
        }

        public void setLastAttemptTime(long lastAttemptTime) {
            this.lastAttemptTime = lastAttemptTime;
        }

        public long getLockoutTime() {
            return lockoutTime;
        }

        public void setLockoutTime(long lockoutTime) {
            this.lockoutTime = lockoutTime;
        }
    }

    /**
     * Inner class to track rate limit information.
     */
    private static class RateLimitInfo {
        private final AtomicInteger attemptCount = new AtomicInteger(0);
        private volatile long lastAttemptTime = 0;

        public int getAttemptCount() {
            return attemptCount.get();
        }

        public void incrementAttempts() {
            attemptCount.incrementAndGet();
        }

        public void resetAttempts() {
            attemptCount.set(0);
        }

        public long getLastAttemptTime() {
            return lastAttemptTime;
        }

        public void setLastAttemptTime(long lastAttemptTime) {
            this.lastAttemptTime = lastAttemptTime;
        }
    }
}
