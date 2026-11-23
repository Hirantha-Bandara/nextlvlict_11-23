package com.nextlvlict.nextlvlict.util;

import org.mindrot.jbcrypt.BCrypt;

/**
 * Utility class for password hashing and verification using BCrypt.
 * Supports migration from plain text passwords to BCrypt hashed passwords.
 */
public class PasswordUtil {

    private static final int BCRYPT_ROUNDS = 12;

    /**
     * Hash a plain text password using BCrypt.
     * 
     * @param plainPassword The plain text password to hash
     * @return The BCrypt hashed password
     */
    public static String hashPassword(String plainPassword) {
        return BCrypt.hashpw(plainPassword, BCrypt.gensalt(BCRYPT_ROUNDS));
    }

    /**
     * Verify a plain text password against a stored password.
     * Supports both BCrypt hashed passwords and plain text passwords for migration.
     * 
     * @param plainPassword The plain text password to verify
     * @param storedPassword The stored password (either BCrypt hash or plain text)
     * @return true if the password matches, false otherwise
     */
    public static boolean verifyPassword(String plainPassword, String storedPassword) {
        if (storedPassword == null || plainPassword == null) {
            return false;
        }

        // Check if the stored password is a BCrypt hash (starts with $2a$, $2b$, or $2y$)
        if (isBCryptHash(storedPassword)) {
            return BCrypt.checkpw(plainPassword, storedPassword);
        }

        // For migration: support plain text passwords
        // If the stored password is plain text, compare directly
        if (plainPassword.equals(storedPassword)) {
            return true;
        }

        return false;
    }

    /**
     * Check if a password is already BCrypt hashed.
     * 
     * @param password The password to check
     * @return true if the password is a BCrypt hash, false otherwise
     */
    public static boolean isBCryptHash(String password) {
        return password != null && password.startsWith("$2");
    }

    /**
     * Check if a password needs migration (is plain text).
     * 
     * @param password The password to check
     * @return true if the password needs migration, false otherwise
     */
    public static boolean needsMigration(String password) {
        return password != null && !isBCryptHash(password);
    }

    /**
     * Migrate a plain text password to BCrypt hash.
     * 
     * @param plainPassword The plain text password to migrate
     * @return The BCrypt hashed password
     */
    public static String migratePassword(String plainPassword) {
        return hashPassword(plainPassword);
    }
}
