package com.nextlvlict.nextlvlict.util;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class PayHereConfig {
    private static PayHereConfig instance;
    private final Properties properties;

    private PayHereConfig() {
        properties = new Properties();
        loadConfig();
    }

    private void loadConfig() {
        properties.clear();

        try {
            String externalPath = System.getProperty("payhere.config.path");
            if (externalPath != null && !externalPath.trim().isEmpty()) {
                try (java.io.FileInputStream fis = new java.io.FileInputStream(externalPath.trim())) {
                    properties.load(fis);
                    validateRequiredProperties();
                    System.out.println("PayHere configuration loaded from external file: " + externalPath);
                    return;
                } catch (Exception e) {
                    System.err.println("Error loading external PayHere config: " + e.getMessage());
                }
            }

            if (loadFromClasspath("payhere-config.properties")) {
                return;
            }

            if (loadFromClasspath("com/nextlvlict/nextlvlict/payhere-config.properties")) {
                return;
            }

            throw new IllegalStateException("payhere-config.properties not found in classpath");
        } catch (IOException e) {
            throw new IllegalStateException("Error loading PayHere config", e);
        }
    }

    private boolean loadFromClasspath(String path) throws IOException {
        try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream(path)) {
            if (inputStream == null) {
                return false;
            }

            properties.load(inputStream);
            validateRequiredProperties();
            System.out.println("PayHere configuration loaded from classpath: " + path);
            return true;
        }
    }

    public static synchronized PayHereConfig getInstance() {
        if (instance == null) {
            instance = new PayHereConfig();
        }
        return instance;
    }

    public String getMerchantId() {
        return getRequiredProperty("payhere.merchant.id");
    }

    public String getMerchantSecret() {
        return getRequiredProperty("payhere.merchant.secret");
    }

    public boolean isSandbox() {
        return Boolean.parseBoolean(getRequiredProperty("payhere.sandbox"));
    }

    public String getCheckoutUrl() {
        return getRequiredProperty("payhere.checkout.url");
    }

    public String getBaseUrl() {
        return getRequiredProperty("payhere.return.url");
    }

    public void reload() {
        loadConfig();
    }

    public void logConfig() {
        System.out.println("=== PayHere Configuration ===");
        System.out.println("Merchant ID: " + getMerchantId());
        System.out.println("Sandbox Mode: " + isSandbox());
        System.out.println("Checkout URL: " + getCheckoutUrl());
        System.out.println("Base URL: " + getBaseUrl());
        System.out.println("=============================");
    }

    private void validateRequiredProperties() {
        getRequiredProperty("payhere.merchant.id");
        getRequiredProperty("payhere.merchant.secret");
        getRequiredProperty("payhere.sandbox");
        getRequiredProperty("payhere.checkout.url");
        getRequiredProperty("payhere.return.url");
    }

    private String getRequiredProperty(String key) {
        String value = properties.getProperty(key);
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalStateException("Missing PayHere config property: " + key);
        }
        return value.trim();
    }
}
