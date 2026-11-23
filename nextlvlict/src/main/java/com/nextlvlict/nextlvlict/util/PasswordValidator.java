package com.nextlvlict.nextlvlict.util;

import java.util.regex.Pattern;

/**
 * Utility class for password complexity validation.
 * Enforces strong password requirements.
 */
public class PasswordValidator {

    // Minimum password length
    private static final int MIN_LENGTH = 8;
    
    // Maximum password length
    private static final int MAX_LENGTH = 128;
    
    // Regex patterns for password complexity
    private static final Pattern UPPERCASE_PATTERN = Pattern.compile("[A-Z]");
    private static final Pattern LOWERCASE_PATTERN = Pattern.compile("[a-z]");
    private static final Pattern DIGIT_PATTERN = Pattern.compile("[0-9]");
    private static final Pattern SPECIAL_CHAR_PATTERN = Pattern.compile("[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?]");

    /**
     * Validate password complexity.
     * 
     * @param password The password to validate
     * @return ValidationResult containing success status and error message
     */
    public static ValidationResult validatePassword(String password) {
        if (password == null || password.isEmpty()) {
            return new ValidationResult(false, "Password is required");
        }

        if (password.length() < MIN_LENGTH) {
            return new ValidationResult(false, 
                "Password must be at least " + MIN_LENGTH + " characters long");
        }

        if (password.length() > MAX_LENGTH) {
            return new ValidationResult(false, 
                "Password must not exceed " + MAX_LENGTH + " characters");
        }

        if (!UPPERCASE_PATTERN.matcher(password).find()) {
            return new ValidationResult(false, 
                "Password must contain at least one uppercase letter");
        }

        if (!LOWERCASE_PATTERN.matcher(password).find()) {
            return new ValidationResult(false, 
                "Password must contain at least one lowercase letter");
        }

        if (!DIGIT_PATTERN.matcher(password).find()) {
            return new ValidationResult(false, 
                "Password must contain at least one digit");
        }

        if (!SPECIAL_CHAR_PATTERN.matcher(password).find()) {
            return new ValidationResult(false, 
                "Password must contain at least one special character (!@#$%^&* etc.)");
        }

        // Check for common weak patterns
        if (containsCommonPattern(password)) {
            return new ValidationResult(false, 
                "Password contains common patterns and is too weak");
        }

        return new ValidationResult(true, "Password meets complexity requirements");
    }

    /**
     * Check if password contains common weak patterns.
     * 
     * @param password The password to check
     * @return true if password contains common patterns, false otherwise
     */
    private static boolean containsCommonPattern(String password) {
        String lowerPassword = password.toLowerCase();
        
        // Common sequences
        String[] commonPatterns = {
            "123456", "password", "qwerty", "abc123", "letmein",
            "admin", "welcome", "monkey", "dragon", "master"
        };
        
        for (String pattern : commonPatterns) {
            if (lowerPassword.contains(pattern)) {
                return true;
            }
        }
        
        // Check for sequential characters
        for (int i = 0; i < password.length() - 2; i++) {
            char c1 = password.charAt(i);
            char c2 = password.charAt(i + 1);
            char c3 = password.charAt(i + 2);
            
            if (isSequential(c1, c2, c3)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Check if three characters are sequential.
     * 
     * @param c1 First character
     * @param c2 Second character
     * @param c3 Third character
     * @return true if characters are sequential, false otherwise
     */
    private static boolean isSequential(char c1, char c2, char c3) {
        if (Character.isLetter(c1) && Character.isLetter(c2) && Character.isLetter(c3)) {
            return c2 == c1 + 1 && c3 == c2 + 1;
        }
        if (Character.isDigit(c1) && Character.isDigit(c2) && Character.isDigit(c3)) {
            return c2 == c1 + 1 && c3 == c2 + 1;
        }
        return false;
    }

    /**
     * Result class for password validation.
     */
    public static class ValidationResult {
        private final boolean valid;
        private final String message;

        public ValidationResult(boolean valid, String message) {
            this.valid = valid;
            this.message = message;
        }

        public boolean isValid() {
            return valid;
        }

        public String getMessage() {
            return message;
        }
    }
}
