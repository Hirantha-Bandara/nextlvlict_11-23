package com.nextlvlict.nextlvlict.util;

/**
 * Configuration Utility for reading environment variables and system properties.
 * Provides secure access to configuration values with fallback to defaults.
 */
public class ConfigUtil {

    // Database configuration keys
    public static final String DB_URL = "DB_URL";
    public static final String DB_USERNAME = "DB_USERNAME";
    public static final String DB_PASSWORD = "DB_PASSWORD";
    
    // Environment configuration
    public static final String APP_ENV = "APP_ENV";
    
    // Default values (for development only)
    private static final String DEFAULT_DB_URL = "jdbc:mysql://localhost:3306/nextlvlict";
    private static final String DEFAULT_DB_USERNAME = "root";
    private static final String DEFAULT_DB_PASSWORD = "";
    private static final String DEFAULT_APP_ENV = "development";

    /**
     * Get a configuration value from environment variable or system property.
     * Environment variables take precedence over system properties.
     * 
     * @param key The configuration key
     * @return The configuration value, or null if not found
     */
    public static String getConfig(String key) {
        // Try environment variable first
        String value = System.getenv(key);
        if (value != null && !value.isEmpty()) {
            return value;
        }
        
        // Try system property second
        value = System.getProperty(key);
        if (value != null && !value.isEmpty()) {
            return value;
        }
        
        return null;
    }

    /**
     * Get a configuration value with a default fallback.
     * 
     * @param key The configuration key
     * @param defaultValue The default value if not found
     * @return The configuration value, or default if not found
     */
    public static String getConfig(String key, String defaultValue) {
        String value = getConfig(key);
        return value != null ? value : defaultValue;
    }

    /**
     * Get the database URL.
     * 
     * @return The database URL
     */
    public static String getDatabaseUrl() {
        return getConfig(DB_URL, DEFAULT_DB_URL);
    }

    /**
     * Get the database username.
     * 
     * @return The database username
     */
    public static String getDatabaseUsername() {
        return getConfig(DB_USERNAME, DEFAULT_DB_USERNAME);
    }

    /**
     * Get the database password.
     * 
     * @return The database password
     */
    public static String getDatabasePassword() {
        return getConfig(DB_PASSWORD, DEFAULT_DB_PASSWORD);
    }

    /**
     * Get the application environment (development/production).
     * 
     * @return The application environment
     */
    public static String getEnvironment() {
        return getConfig(APP_ENV, DEFAULT_APP_ENV);
    }

    /**
     * Check if the application is running in production mode.
     * 
     * @return true if production, false otherwise
     */
    public static boolean isProduction() {
        return "production".equalsIgnoreCase(getEnvironment());
    }

    /**
     * Check if the application is running in development mode.
     * 
     * @return true if development, false otherwise
     */
    public static boolean isDevelopment() {
        return "development".equalsIgnoreCase(getEnvironment());
    }

    /**
     * Get a boolean configuration value.
     * 
     * @param key The configuration key
     * @param defaultValue The default value if not found
     * @return The boolean value
     */
    public static boolean getBooleanConfig(String key, boolean defaultValue) {
        String value = getConfig(key);
        if (value == null) {
            return defaultValue;
        }
        return Boolean.parseBoolean(value);
    }

    /**
     * Get an integer configuration value.
     * 
     * @param key The configuration key
     * @param defaultValue The default value if not found
     * @return The integer value
     */
    public static int getIntConfig(String key, int defaultValue) {
        String value = getConfig(key);
        if (value == null) {
            return defaultValue;
        }
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }

    /**
     * Validate that required configuration is present.
     * 
     * @param key The configuration key
     * @return true if configuration is present, false otherwise
     */
    public static boolean hasConfig(String key) {
        return getConfig(key) != null;
    }

    /**
     * Log configuration status (without exposing sensitive values).
     */
    public static void logConfigurationStatus() {
        System.out.println("=== Configuration Status ===");
        System.out.println("Environment: " + getEnvironment());
        System.out.println("Database URL configured: " + hasConfig(DB_URL));
        System.out.println("Database Username configured: " + hasConfig(DB_USERNAME));
        System.out.println("Database Password configured: " + hasConfig(DB_PASSWORD));
        System.out.println("============================");
    }
}
