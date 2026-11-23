package com.nextlvlict.nextlvlict.util;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

public final class AdminAuthTokenStore {

    private static final long TOKEN_TTL_MILLIS = TimeUnit.MINUTES.toMillis(120);
    private static final ConcurrentHashMap<String, AuthData> TOKENS = new ConcurrentHashMap<>();

    private AdminAuthTokenStore() {
    }

    public static String issueToken(Long adminId, String adminUsername, String adminEmail) {
        String token = UUID.randomUUID().toString();
        TOKENS.put(token, new AuthData(adminId, adminUsername, adminEmail, System.currentTimeMillis() + TOKEN_TTL_MILLIS));
        return token;
    }

    public static AuthData validate(String token) {
        if (token == null || token.trim().isEmpty()) {
            return null;
        }

        String normalizedToken = token.trim();
        AuthData authData = TOKENS.get(normalizedToken);
        if (authData == null) {
            return null;
        }

        if (authData.isExpired()) {
            TOKENS.remove(normalizedToken);
            return null;
        }

        return authData;
    }

    public static void revoke(String token) {
        if (token != null && !token.trim().isEmpty()) {
            TOKENS.remove(token.trim());
        }
    }

    public static final class AuthData {
        private final Long adminId;
        private final String adminUsername;
        private final String adminEmail;
        private final long expiresAtMillis;

        private AuthData(Long adminId, String adminUsername, String adminEmail, long expiresAtMillis) {
            this.adminId = adminId;
            this.adminUsername = adminUsername;
            this.adminEmail = adminEmail;
            this.expiresAtMillis = expiresAtMillis;
        }

        public Long getAdminId() {
            return adminId;
        }

        public String getAdminUsername() {
            return adminUsername;
        }

        public String getAdminEmail() {
            return adminEmail;
        }

        public long getExpiresAtMillis() {
            return expiresAtMillis;
        }

        private boolean isExpired() {
            return System.currentTimeMillis() > expiresAtMillis;
        }
    }
}

