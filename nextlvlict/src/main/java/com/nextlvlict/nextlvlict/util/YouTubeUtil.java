package com.nextlvlict.nextlvlict.util;

import java.util.regex.Pattern;
import java.util.regex.Matcher;

/**
 * YouTube URL Validation Utility
 * Handles YouTube URL validation and video ID extraction
 */
public class YouTubeUtil {

    // YouTube URL patterns
    private static final Pattern YOUTUBE_URL_PATTERN = Pattern.compile(
        "^(https?://)?(www\\.)?(youtube\\.com/(watch\\?v=|embed/|v/)|youtu\\.be/)([a-zA-Z0-9_-]{11}).*$"
    );

    /**
     * Validate if a URL is a valid YouTube URL
     * 
     * @param url The URL to validate
     * @return true if valid YouTube URL, false otherwise
     */
    public static boolean isValidYouTubeUrl(String url) {
        if (url == null || url.trim().isEmpty()) {
            return false;
        }
        
        String trimmedUrl = url.trim();
        Matcher matcher = YOUTUBE_URL_PATTERN.matcher(trimmedUrl);
        return matcher.matches();
    }

    /**
     * Extract YouTube video ID from a YouTube URL
     * 
     * @param url The YouTube URL
     * @return The video ID, or null if invalid URL
     */
    public static String extractVideoId(String url) {
        if (url == null || url.trim().isEmpty()) {
            return null;
        }
        
        String trimmedUrl = url.trim();
        Matcher matcher = YOUTUBE_URL_PATTERN.matcher(trimmedUrl);
        
        if (matcher.matches()) {
            return matcher.group(5);
        }
        
        return null;
    }

    /**
     * Normalize YouTube URL to standard watch format
     * 
     * @param url The YouTube URL to normalize
     * @return Normalized URL in format: https://www.youtube.com/watch?v=VIDEO_ID
     */
    public static String normalizeUrl(String url) {
        String videoId = extractVideoId(url);
        if (videoId != null) {
            return "https://www.youtube.com/watch?v=" + videoId;
        }
        return url;
    }

    /**
     * Validate YouTube URL and return validation result with message
     * 
     * @param url The URL to validate
     * @return ValidationResult containing validation status and message
     */
    public static ValidationResult validate(String url) {
        if (url == null || url.trim().isEmpty()) {
            return new ValidationResult(false, "YouTube URL is required");
        }
        
        String trimmedUrl = url.trim();
        
        if (!isValidYouTubeUrl(trimmedUrl)) {
            return new ValidationResult(false, 
                "Invalid YouTube URL. Supported formats: https://www.youtube.com/watch?v=VIDEO_ID, https://youtu.be/VIDEO_ID, https://www.youtube.com/embed/VIDEO_ID");
        }
        
        String videoId = extractVideoId(trimmedUrl);
        if (videoId == null) {
            return new ValidationResult(false, "Could not extract video ID from URL");
        }
        
        return new ValidationResult(true, "Valid YouTube URL", videoId);
    }

    /**
     * Validation result holder
     */
    public static class ValidationResult {
        private final boolean valid;
        private final String message;
        private final String videoId;

        public ValidationResult(boolean valid, String message) {
            this(valid, message, null);
        }

        public ValidationResult(boolean valid, String message, String videoId) {
            this.valid = valid;
            this.message = message;
            this.videoId = videoId;
        }

        public boolean isValid() {
            return valid;
        }

        public String getMessage() {
            return message;
        }

        public String getVideoId() {
            return videoId;
        }
    }
}
