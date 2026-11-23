package com.nextlvlict.nextlvlict.util;

import net.coobird.thumbnailator.Thumbnails;
import net.coobird.thumbnailator.geometry.Positions;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Image Validation and Optimization Utility
 * Handles image validation, resizing, and format conversion
 */
public class ImageUtil {

    private static final Logger logger = LoggerFactory.getLogger(ImageUtil.class);

    // Allowed MIME types
    private static final Set<String> ALLOWED_MIME_TYPES = new HashSet<>(Arrays.asList(
        "image/jpeg",
        "image/png",
        "image/webp"
    ));

    // Maximum file size (5MB)
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

    // Image quality for compression (0.0 - 1.0)
    private static final float COMPRESSION_QUALITY = 0.85f;

    // Check if WebP writer is available
    private static final boolean WEBP_SUPPORTED = isWebPSupported();

    private static boolean isWebPSupported() {
        Iterator<javax.imageio.ImageWriter> writers = ImageIO.getImageWritersByFormatName("webp");
        boolean supported = writers.hasNext();
        logger.info("WebP format support detected: {}", supported);
        return supported;
    }

    /**
     * Validate an image file and detect its format
     * 
     * @param inputStream The image input stream
     * @param contentType The content type from the request
     * @param fileSize The file size in bytes
     * @return ValidationResult containing validation status, error message, and detected format
     */
    public static ValidationResult validateImage(InputStream inputStream, String contentType, long fileSize) {
        logger.info("Validating image - Content-Type: {}, File size: {} bytes", contentType, fileSize);

        // Check file size
        if (fileSize > MAX_FILE_SIZE) {
            return new ValidationResult(false, "File size exceeds maximum allowed size of 5MB", null);
        }

        if (fileSize == 0) {
            return new ValidationResult(false, "File is empty", null);
        }

        // Check MIME type
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType.toLowerCase())) {
            return new ValidationResult(false, "Invalid file type. Only JPEG, PNG, and WebP images are allowed", null);
        }

        // Validate actual image content and detect format
        try {
            BufferedImage image = ImageIO.read(inputStream);
            if (image == null) {
                return new ValidationResult(false, "File is not a valid image or is corrupted", null);
            }

            // Check image dimensions
            int width = image.getWidth();
            int height = image.getHeight();

            if (width <= 0 || height <= 0) {
                return new ValidationResult(false, "Invalid image dimensions", null);
            }

            // Reject extremely small images (less than 10x10)
            if (width < 10 || height < 10) {
                return new ValidationResult(false, "Image dimensions too small (minimum 10x10)", null);
            }

            // Reject extremely large images (more than 10000x10000)
            if (width > 10000 || height > 10000) {
                return new ValidationResult(false, "Image dimensions too large (maximum 10000x10000)", null);
            }

            // Detect format from content type
            String detectedFormat = detectFormatFromContentType(contentType);
            logger.info("Image validation successful - Dimensions: {}x{}, Detected format: {}", width, height, detectedFormat);

            return new ValidationResult(true, "Image is valid", detectedFormat);
        } catch (IOException e) {
            logger.error("Failed to read image: {}", e.getMessage());
            return new ValidationResult(false, "Failed to read image: " + e.getMessage(), null);
        }
    }

    /**
     * Detect image format from content type
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
        } else if (ct.equals("image/webp")) {
            return "webp";
        }
        return "jpeg"; // Default fallback
    }

    /**
     * Get output format based on WebP support and original format
     */
    private static String getOutputFormat(String originalFormat) {
        if (WEBP_SUPPORTED) {
            logger.info("WebP supported, converting to WebP");
            return "webp";
        } else {
            logger.info("WebP not supported, preserving original format: {}", originalFormat);
            return originalFormat;
        }
    }

    /**
     * Get content type based on format
     */
    private static String getContentType(String format) {
        switch (format) {
            case "png":
                return "image/png";
            case "webp":
                return "image/webp";
            case "jpeg":
            default:
                return "image/jpeg";
        }
    }

    /**
     * Process and optimize an image for recording thumbnails
     * Resizes to max 1280x720, maintains aspect ratio, converts to WebP if supported
     * 
     * @param inputStream The image input stream
     * @param originalFormat The original image format (jpeg, png, webp)
     * @return ProcessedImage containing the optimized image bytes
     */
    public static ProcessedImage optimizeForRecordingThumbnail(InputStream inputStream, String originalFormat) throws IOException {
        String outputFormat = getOutputFormat(originalFormat);
        String contentType = getContentType(outputFormat);
        
        logger.info("Optimizing recording thumbnail - Original format: {}, Output format: {}", originalFormat, outputFormat);
        
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        
        Thumbnails.of(inputStream)
            .size(1280, 720)
            .outputQuality(COMPRESSION_QUALITY)
            .outputFormat(outputFormat)
            .toOutputStream(outputStream);

        return new ProcessedImage(outputStream.toByteArray(), contentType);
    }

    /**
     * Process and optimize an image for tute covers
     * Resizes to max 1280x720, maintains aspect ratio, converts to WebP if supported
     * 
     * @param inputStream The image input stream
     * @param originalFormat The original image format (jpeg, png, webp)
     * @return ProcessedImage containing the optimized image bytes
     */
    public static ProcessedImage optimizeForTuteCover(InputStream inputStream, String originalFormat) throws IOException {
        String outputFormat = getOutputFormat(originalFormat);
        String contentType = getContentType(outputFormat);
        
        logger.info("Optimizing tute cover - Original format: {}, Output format: {}", originalFormat, outputFormat);
        
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        
        Thumbnails.of(inputStream)
            .size(1280, 720)
            .outputQuality(COMPRESSION_QUALITY)
            .outputFormat(outputFormat)
            .toOutputStream(outputStream);

        return new ProcessedImage(outputStream.toByteArray(), contentType);
    }

    /**
     * Process and optimize an image for testimonial profiles
     * Resizes to max 800x800 square, maintains aspect ratio, converts to WebP if supported
     * 
     * @param inputStream The image input stream
     * @param originalFormat The original image format (jpeg, png, webp)
     * @return ProcessedImage containing the optimized image bytes
     */
    public static ProcessedImage optimizeForTestimonialProfile(InputStream inputStream, String originalFormat) throws IOException {
        String outputFormat = getOutputFormat(originalFormat);
        String contentType = getContentType(outputFormat);
        
        logger.info("Optimizing testimonial profile - Original format: {}, Output format: {}", originalFormat, outputFormat);
        
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        
        Thumbnails.of(inputStream)
            .size(800, 800)
            .outputQuality(COMPRESSION_QUALITY)
            .outputFormat(outputFormat)
            .toOutputStream(outputStream);

        return new ProcessedImage(outputStream.toByteArray(), contentType);
    }

    /**
     * Process and optimize an image for gallery
     * Resizes to max 1920px on longest side, maintains aspect ratio, converts to WebP if supported
     * 
     * @param inputStream The image input stream
     * @param originalFormat The original image format (jpeg, png, webp)
     * @return ProcessedImage containing the optimized image bytes
     */
    public static ProcessedImage optimizeForGallery(InputStream inputStream, String originalFormat) throws IOException {
        String outputFormat = getOutputFormat(originalFormat);
        String contentType = getContentType(outputFormat);
        
        logger.info("Optimizing gallery image - Original format: {}, Output format: {}", originalFormat, outputFormat);
        
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        
        Thumbnails.of(inputStream)
            .size(1920, 1920)
            .outputQuality(COMPRESSION_QUALITY)
            .outputFormat(outputFormat)
            .toOutputStream(outputStream);

        return new ProcessedImage(outputStream.toByteArray(), contentType);
    }

    /**
     * Process and optimize an image for branch images
     * Resizes to max 1200x1200 square, maintains aspect ratio, converts to WebP if supported
     * 
     * @param inputStream The image input stream
     * @param originalFormat The original image format (jpeg, png, webp)
     * @return ProcessedImage containing the optimized image bytes
     */
    public static ProcessedImage optimizeForBranchImage(InputStream inputStream, String originalFormat) throws IOException {
        String outputFormat = getOutputFormat(originalFormat);
        String contentType = getContentType(outputFormat);
        
        logger.info("Optimizing branch image - Original format: {}, Output format: {}", originalFormat, outputFormat);
        
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        
        Thumbnails.of(inputStream)
            .size(1200, 1200)
            .outputQuality(COMPRESSION_QUALITY)
            .outputFormat(outputFormat)
            .toOutputStream(outputStream);

        return new ProcessedImage(outputStream.toByteArray(), contentType);
    }

    /**
     * Generic image optimization with custom dimensions
     * 
     * @param inputStream The image input stream
     * @param maxWidth Maximum width
     * @param maxHeight Maximum height
     * @param originalFormat The original image format (jpeg, png, webp)
     * @return ProcessedImage containing the optimized image bytes
     */
    public static ProcessedImage optimizeImage(InputStream inputStream, int maxWidth, int maxHeight, String originalFormat) throws IOException {
        String outputFormat = getOutputFormat(originalFormat);
        String contentType = getContentType(outputFormat);
        
        logger.info("Optimizing image - Original format: {}, Output format: {}, Max dimensions: {}x{}", 
                    originalFormat, outputFormat, maxWidth, maxHeight);
        
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        
        Thumbnails.of(inputStream)
            .size(maxWidth, maxHeight)
            .outputQuality(COMPRESSION_QUALITY)
            .outputFormat(outputFormat)
            .toOutputStream(outputStream);

        return new ProcessedImage(outputStream.toByteArray(), contentType);
    }

    /**
     * Get image dimensions without processing
     * 
     * @param inputStream The image input stream
     * @return ImageDimensions containing width and height
     */
    public static ImageDimensions getImageDimensions(InputStream inputStream) throws IOException {
        BufferedImage image = ImageIO.read(inputStream);
        if (image == null) {
            throw new IOException("Invalid image");
        }
        return new ImageDimensions(image.getWidth(), image.getHeight());
    }

    /**
     * Validation result holder
     */
    public static class ValidationResult {
        private final boolean valid;
        private final String message;
        private final String detectedFormat;

        public ValidationResult(boolean valid, String message, String detectedFormat) {
            this.valid = valid;
            this.message = message;
            this.detectedFormat = detectedFormat;
        }

        public boolean isValid() {
            return valid;
        }

        public String getMessage() {
            return message;
        }

        public String getDetectedFormat() {
            return detectedFormat;
        }
    }

    /**
     * Processed image holder
     */
    public static class ProcessedImage {
        private final byte[] bytes;
        private final String contentType;

        public ProcessedImage(byte[] bytes, String contentType) {
            this.bytes = bytes;
            this.contentType = contentType;
        }

        public byte[] getBytes() {
            return bytes;
        }

        public String getContentType() {
            return contentType;
        }

        public long getSize() {
            return bytes.length;
        }

        public InputStream getInputStream() {
            return new ByteArrayInputStream(bytes);
        }
    }

    /**
     * Image dimensions holder
     */
    public static class ImageDimensions {
        private final int width;
        private final int height;

        public ImageDimensions(int width, int height) {
            this.width = width;
            this.height = height;
        }

        public int getWidth() {
            return width;
        }

        public int getHeight() {
            return height;
        }
    }
}
