package com.nextlvlict.nextlvlict.service;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.core.sync.RequestBody;

import java.io.InputStream;
import java.net.URI;
import java.util.UUID;

/**
 * Cloudflare R2 Storage Service
 * Provides S3-compatible operations for Cloudflare R2
 * Configuration loaded from environment variables
 */
public class R2StorageService {

    private static R2StorageService instance;
    private S3Client s3Client;
    private String bucketName;
    private String publicUrl;

    // Configuration keys (environment variable names)
    private static final String R2_ACCOUNT_ID = "R2_ACCOUNT_ID";
    private static final String R2_ACCESS_KEY_ID = "R2_ACCESS_KEY_ID";
    private static final String R2_SECRET_ACCESS_KEY = "R2_SECRET_ACCESS_KEY";
    private static final String R2_BUCKET_NAME = "R2_BUCKET_NAME";
    private static final String R2_ENDPOINT = "R2_ENDPOINT";
    private static final String R2_PUBLIC_URL = "R2_PUBLIC_URL";

    private R2StorageService() {
        initialize();
    }

    public static synchronized R2StorageService getInstance() {
        if (instance == null) {
            instance = new R2StorageService();
        }
        return instance;
    }

    private void initialize() {
        String accountId = System.getenv(R2_ACCOUNT_ID);
        String accessKeyId = System.getenv(R2_ACCESS_KEY_ID);
        String secretAccessKey = System.getenv(R2_SECRET_ACCESS_KEY);
        this.bucketName = System.getenv(R2_BUCKET_NAME);
        String endpoint = System.getenv(R2_ENDPOINT);
        this.publicUrl = System.getenv(R2_PUBLIC_URL);

        // Validate required environment variables
        StringBuilder missingVars = new StringBuilder();
        if (accessKeyId == null) missingVars.append(R2_ACCESS_KEY_ID).append(", ");
        if (secretAccessKey == null) missingVars.append(R2_SECRET_ACCESS_KEY).append(", ");
        if (bucketName == null) missingVars.append(R2_BUCKET_NAME).append(", ");
        if (endpoint == null) missingVars.append(R2_ENDPOINT).append(", ");
        if (publicUrl == null) missingVars.append(R2_PUBLIC_URL).append(", ");

        if (missingVars.length() > 0) {
            String errorMsg = "R2 configuration incomplete. Missing environment variables: " +
                missingVars.substring(0, missingVars.length() - 2);
            System.err.println(errorMsg);
            throw new IllegalStateException(errorMsg);
        }

        try {
            AwsBasicCredentials credentials = AwsBasicCredentials.create(accessKeyId, secretAccessKey);

            this.s3Client = S3Client.builder()
                .region(Region.US_EAST_1) // R2 uses this region for compatibility
                .credentialsProvider(StaticCredentialsProvider.create(credentials))
                .endpointOverride(URI.create(endpoint))
                .build();

            System.out.println("R2 Storage Service initialized successfully with bucket: " + bucketName);
        } catch (Exception e) {
            System.err.println("Failed to initialize R2 Storage Service: " + e.getMessage());
            throw new RuntimeException("R2 initialization failed", e);
        }
    }

    /**
     * Upload a file to R2 with the specified object key
     * 
     * @param objectKey The object key (path) in the bucket
     * @param inputStream The file input stream
     * @param contentLength The file size in bytes
     * @param contentType The MIME type of the file
     * @return The public URL of the uploaded file
     */
    public String uploadFile(String objectKey, InputStream inputStream, long contentLength, String contentType) {
        try {
            PutObjectRequest putRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .contentType(contentType)
                .contentLength(contentLength)
                .build();

            s3Client.putObject(putRequest, RequestBody.fromInputStream(inputStream, contentLength));
            
            return getPublicUrl(objectKey);
        } catch (Exception e) {
            System.err.println("Failed to upload file to R2: " + e.getMessage());
            throw new RuntimeException("R2 upload failed", e);
        }
    }

    /**
     * Delete a file from R2
     * 
     * @param objectKey The object key to delete
     * @return true if successful, false otherwise
     */
    public boolean deleteFile(String objectKey) {
        try {
            DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .build();

            s3Client.deleteObject(deleteRequest);
            return true;
        } catch (Exception e) {
            System.err.println("Failed to delete file from R2: " + e.getMessage());
            return false;
        }
    }

    /**
     * Download a file from R2 as an InputStream
     * Used for authenticated private file access (e.g., payment slips)
     * 
     * @param objectKey The object key to download
     * @return InputStream of the file content
     * @throws RuntimeException if download fails
     */
    public InputStream downloadFile(String objectKey) {
        try {
            GetObjectRequest getRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .build();

            return s3Client.getObject(getRequest);
        } catch (Exception e) {
            System.err.println("Failed to download file from R2: " + e.getMessage());
            throw new RuntimeException("R2 download failed", e);
        }
    }

    /**
     * Get object metadata from R2
     * 
     * @param objectKey The object key
     * @return Response containing metadata
     * @throws RuntimeException if request fails
     */
    public HeadObjectResponse getObjectMetadata(String objectKey) {
        try {
            HeadObjectRequest headRequest = HeadObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .build();

            return s3Client.headObject(headRequest);
        } catch (Exception e) {
            System.err.println("Failed to get object metadata from R2: " + e.getMessage());
            throw new RuntimeException("R2 metadata request failed", e);
        }
    }

    /**
     * Generate a unique object key for the specified type
     * 
     * @param type The type of image (recordings, tutes, testimonials, gallery, branches)
     * @param entityId The entity ID (if applicable)
     * @param format The image format (jpeg, png, webp)
     * @return A unique object key
     */
    public String generateObjectKey(String type, String entityId, String format) {
        String uuid = UUID.randomUUID().toString();
        String extension = getFileExtension(format);
        switch (type.toLowerCase()) {
            case "recordings":
                return "recordings/" + entityId + "/thumbnail/" + uuid + extension;
            case "tutes":
                return "tutes/" + entityId + "/cover/" + uuid + extension;
            case "testimonials":
                return "testimonials/" + entityId + "/profile/" + uuid + extension;
            case "events":
                return "events/" + entityId + "/" + uuid + extension;
            case "gallery":
                return "gallery/" + uuid + extension;
            case "branches":
                return "branches/" + entityId + "/" + uuid + extension;
            case "payment-slips":
                return "payment-slips/" + entityId + "/" + uuid + extension;
            default:
                return "uploads/" + uuid + extension;
        }
    }

    /**
     * Generate a unique object key for payment slips
     * 
     * @param submissionId The submission ID (format: studentId_monthlyFeeId_timestamp)
     * @param format The file format (jpeg, png, pdf)
     * @return A unique object key under payment-slips/ prefix
     */
    public String generatePaymentSlipKey(String submissionId, String format) {
        String uuid = UUID.randomUUID().toString();
        String extension = getFileExtension(format);
        return "payment-slips/" + submissionId + "/" + uuid + extension;
    }

    /**
     * Get file extension for a given format
     * 
     * @param format The file format (jpeg, png, webp, pdf)
     * @return The file extension including the dot
     */
    private String getFileExtension(String format) {
        if (format == null) {
            return ".jpg"; // Default fallback
        }
        switch (format.toLowerCase()) {
            case "png":
                return ".png";
            case "webp":
                return ".webp";
            case "pdf":
                return ".pdf";
            case "jpeg":
            case "jpg":
            default:
                return ".jpg";
        }
    }

    /**
     * Get the public URL for an object key
     * 
     * @param objectKey The object key
     * @return The public URL
     */
    public String getPublicUrl(String objectKey) {
        if (publicUrl != null && !publicUrl.isEmpty()) {
            return publicUrl + "/" + objectKey;
        }
        // Fallback: construct URL from endpoint if public URL not configured
        return objectKey; // Caller should handle URL construction
    }

    /**
     * Extract object key from a public URL
     * 
     * @param publicUrl The public URL
     * @return The object key
     */
    public String extractObjectKey(String publicUrl) {
        if (publicUrl == null || publicUrl.isEmpty()) {
            return null;
        }
        
        // If URL starts with configured public URL, extract the key
        if (this.publicUrl != null && publicUrl.startsWith(this.publicUrl)) {
            return publicUrl.substring(this.publicUrl.length() + 1);
        }
        
        // Otherwise, try to extract from the URL path
        try {
            URI uri = URI.create(publicUrl);
            String path = uri.getPath();
            if (path.startsWith("/")) {
                return path.substring(1);
            }
            return path;
        } catch (Exception e) {
            System.err.println("Failed to extract object key from URL: " + e.getMessage());
            return null;
        }
    }

    /**
     * Check if the service is properly configured
     * 
     * @return true if configured, false otherwise
     */
    public boolean isConfigured() {
        return s3Client != null && bucketName != null && !bucketName.isEmpty();
    }
}
