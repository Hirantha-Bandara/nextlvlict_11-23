package com.nextlvlict.nextlvlict.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * File Validation Utility for Payment Slips
 * Handles validation of images (JPEG, PNG) and PDFs for payment slip uploads
 */
public class FileUtil {

    private static final Logger logger = LoggerFactory.getLogger(FileUtil.class);

    // Allowed MIME types for payment slips
    private static final Set<String> ALLOWED_MIME_TYPES = new HashSet<>(Arrays.asList(
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf"
    ));

    // Maximum file size for payment slips (10MB - larger than images for PDFs)
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

    // Minimum file size (100 bytes to reject empty files)
    private static final long MIN_FILE_SIZE = 100;

    // Magic bytes for file type validation
    private static final byte[] JPEG_MAGIC = new byte[] {(byte) 0xFF, (byte) 0xD8, (byte) 0xFF};
    private static final byte[] PNG_MAGIC = new byte[] {(byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A};
    private static final byte[] PDF_MAGIC = new byte[] {0x25, 0x50, 0x44, 0x46}; // %PDF

    /**
     * Validate a payment slip file (image or PDF)
     * 
     * @param inputStream The file input stream
     * @param contentType The content type from the request
     * @param fileSize The file size in bytes
     * @return ValidationResult containing validation status, error message, and detected type
     */
    public static ValidationResult validatePaymentSlip(InputStream inputStream, String contentType, long fileSize) {
        logger.info("Validating payment slip - Content-Type: {}, File size: {} bytes", contentType, fileSize);

        // Check file size
        if (fileSize > MAX_FILE_SIZE) {
            return new ValidationResult(false, "File size exceeds maximum allowed size of 10MB", null);
        }

        if (fileSize < MIN_FILE_SIZE) {
            return new ValidationResult(false, "File is empty or too small", null);
        }

        // Check MIME type
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType.toLowerCase())) {
            return new ValidationResult(false, "Invalid file type. Only JPEG, PNG images and PDF documents are allowed", null);
        }

        // Validate actual file content using magic bytes
        try {
            // Read first few bytes for magic byte validation
            byte[] header = new byte[8];
            int bytesRead = inputStream.read(header);
            if (bytesRead < 4) {
                return new ValidationResult(false, "File is too small to be valid", null);
            }

            // Detect file type from magic bytes
            String detectedType = detectFileTypeFromMagicBytes(header);
            if (detectedType == null) {
                return new ValidationResult(false, "File content does not match the declared type or is corrupted", null);
            }

            // Verify detected type matches content type
            String expectedType = detectFormatFromContentType(contentType);
            if (!detectedType.equals(expectedType)) {
                logger.warn("Content type mismatch: declared={}, detected={}", contentType, detectedType);
                return new ValidationResult(false, "File content does not match the declared file type", null);
            }

            logger.info("Payment slip validation successful - Type: {}, Size: {} bytes", detectedType, fileSize);
            return new ValidationResult(true, "File is valid", detectedType);

        } catch (IOException e) {
            logger.error("Failed to read file: {}", e.getMessage());
            return new ValidationResult(false, "Failed to read file: " + e.getMessage(), null);
        }
    }

    /**
     * Detect file type from magic bytes
     */
    private static String detectFileTypeFromMagicBytes(byte[] header) {
        // Check JPEG
        if (header.length >= 3 && 
            header[0] == JPEG_MAGIC[0] && 
            header[1] == JPEG_MAGIC[1] && 
            header[2] == JPEG_MAGIC[2]) {
            return "jpeg";
        }

        // Check PNG
        if (header.length >= 8 && 
            header[0] == PNG_MAGIC[0] && 
            header[1] == PNG_MAGIC[1] && 
            header[2] == PNG_MAGIC[2] && 
            header[3] == PNG_MAGIC[3] && 
            header[4] == PNG_MAGIC[4] && 
            header[5] == PNG_MAGIC[5] && 
            header[6] == PNG_MAGIC[6] && 
            header[7] == PNG_MAGIC[7]) {
            return "png";
        }

        // Check PDF
        if (header.length >= 4 && 
            header[0] == PDF_MAGIC[0] && 
            header[1] == PDF_MAGIC[1] && 
            header[2] == PDF_MAGIC[2] && 
            header[3] == PDF_MAGIC[3]) {
            return "pdf";
        }

        return null;
    }

    /**
     * Detect file type from content type
     */
    private static String detectFormatFromContentType(String contentType) {
        if (contentType == null) {
            return "jpeg"; // Default fallback
        }
        String ct = contentType.toLowerCase();
        if (ct.equals("image/jpeg") || ct.equals("image/jpg")) {
            return "jpeg";
        } else if (ct.equals("image/png")) {
            return "png";
        } else if (ct.equals("application/pdf")) {
            return "pdf";
        }
        return "jpeg"; // Default fallback
    }

    /**
     * Get file extension for a given format
     */
    public static String getFileExtension(String format) {
        if (format == null) {
            return ".jpg"; // Default fallback
        }
        switch (format.toLowerCase()) {
            case "png":
                return ".png";
            case "pdf":
                return ".pdf";
            case "jpeg":
            case "jpg":
            default:
                return ".jpg";
        }
    }

    /**
     * Get content type based on format
     */
    public static String getContentType(String format) {
        switch (format.toLowerCase()) {
            case "png":
                return "image/png";
            case "pdf":
                return "application/pdf";
            case "jpeg":
            case "jpg":
            default:
                return "image/jpeg";
        }
    }

    /**
     * Sanitize filename to prevent path traversal and injection attacks
     * 
     * @param filename The original filename
     * @return Sanitized filename
     */
    public static String sanitizeFilename(String filename) {
        if (filename == null || filename.isEmpty()) {
            return "payment_slip";
        }

        // Remove path components
        String sanitized = filename.replaceAll("[/\\\\]", "_");

        // Remove null bytes and other control characters
        sanitized = sanitized.replaceAll("[\\x00-\\x1F\\x7F]", "");

        // Remove leading/trailing dots and spaces
        sanitized = sanitized.replaceAll("^[.\\s]+|[.\\s]+$", "");

        // Limit length
        if (sanitized.length() > 100) {
            sanitized = sanitized.substring(0, 100);
        }

        // If empty after sanitization, use default
        if (sanitized.isEmpty()) {
            return "payment_slip";
        }

        return sanitized;
    }

    /**
     * Validation result holder
     */
    public static class ValidationResult {
        private final boolean valid;
        private final String message;
        private final String detectedType;

        public ValidationResult(boolean valid, String message, String detectedType) {
            this.valid = valid;
            this.message = message;
            this.detectedType = detectedType;
        }

        public boolean isValid() {
            return valid;
        }

        public String getMessage() {
            return message;
        }

        public String getDetectedType() {
            return detectedType;
        }
    }
}
