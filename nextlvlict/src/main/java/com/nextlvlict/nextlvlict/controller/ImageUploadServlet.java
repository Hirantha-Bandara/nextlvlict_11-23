package com.nextlvlict.nextlvlict.controller;

import com.google.gson.JsonObject;
import com.nextlvlict.nextlvlict.hibernate.*;
import com.nextlvlict.nextlvlict.service.R2StorageService;
import com.nextlvlict.nextlvlict.util.AuthorizationUtil;
import com.nextlvlict.nextlvlict.util.ImageUtil;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.query.Query;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.Date;
import java.util.List;

/**
 * Image Upload Servlet
 * Handles all image upload operations for Cloudflare R2 storage
 * Public read operations (listGalleryImages, listBranchImages) do not require authentication
 * Admin operations (upload, delete, reorder) require admin authentication
 */
@WebServlet(name = "ImageUploadServlet", urlPatterns = {"/ImageUploadServlet"})
@MultipartConfig(
    fileSizeThreshold = 1024 * 1024,      // 1 MB
    maxFileSize = 5 * 1024 * 1024,       // 5 MB
    maxRequestSize = 10 * 1024 * 1024     // 10 MB
)
public class ImageUploadServlet extends HttpServlet {

    private R2StorageService r2Service;

    @Override
    public void init() throws ServletException {
        r2Service = R2StorageService.getInstance();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        JsonObject jsonResponse = new JsonObject();

        String action = request.getParameter("action");

        // Public read operations - no authentication required
        if ("listGalleryImages".equals(action)) {
            handleListGalleryImages(request, out, jsonResponse);
            out.flush();
            return;
        }

        if ("listBranchImages".equals(action)) {
            handleListBranchImages(request, out, jsonResponse);
            out.flush();
            return;
        }

        // Admin operations - require authentication
        if (!AuthorizationUtil.requireAdminAuthentication(request, response)) {
            return;
        }

        try {
            switch (action) {
                case "uploadRecordingThumbnail":
                    handleRecordingThumbnailUpload(request, out, jsonResponse);
                    break;
                case "uploadTuteCover":
                    handleTuteCoverUpload(request, out, jsonResponse);
                    break;
                case "uploadTestimonialImage":
                    handleTestimonialImageUpload(request, out, jsonResponse);
                    break;
                case "uploadEventImage":
                    handleEventImageUpload(request, out, jsonResponse);
                    break;
                case "uploadGalleryImage":
                    handleGalleryImageUpload(request, out, jsonResponse);
                    break;
                case "uploadBranchImage":
                    handleBranchImageUpload(request, out, jsonResponse);
                    break;
                case "deleteRecordingThumbnail":
                    handleRecordingThumbnailDelete(request, out, jsonResponse);
                    break;
                case "deleteTuteCover":
                    handleTuteCoverDelete(request, out, jsonResponse);
                    break;
                case "deleteGalleryImage":
                    handleGalleryImageDelete(request, out, jsonResponse);
                    break;
                case "deleteEventImage":
                    handleEventImageDelete(request, out, jsonResponse);
                    break;
                case "deleteBranchImage":
                    handleBranchImageDelete(request, out, jsonResponse);
                    break;
                case "reorderGalleryImages":
                    handleReorderGalleryImages(request, out, jsonResponse);
                    break;
                default:
                    jsonResponse.addProperty("success", false);
                    jsonResponse.addProperty("message", "Invalid action parameter");
                    out.print(jsonResponse.toString());
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error: " + e.getMessage());
            out.print(jsonResponse.toString());
        } finally {
            out.flush();
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doPost(request, response);
    }

    // Recording Thumbnail Operations

    private void handleRecordingThumbnailUpload(HttpServletRequest request, PrintWriter out, JsonObject jsonResponse) {
        Session session = null;
        Transaction transaction = null;

        try {
            String recordingIdStr = request.getParameter("recordingId");
            if (recordingIdStr == null || recordingIdStr.isEmpty()) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Recording ID is required");
                out.print(jsonResponse.toString());
                return;
            }

            int recordingId = Integer.parseInt(recordingIdStr);
            Part filePart = request.getPart("image");
            if (filePart == null) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Image file is required");
                out.print(jsonResponse.toString());
                return;
            }

            String contentType = filePart.getContentType();
            long fileSize = filePart.getSize();
            InputStream inputStream = filePart.getInputStream();

            // Validate image
            ImageUtil.ValidationResult validation = ImageUtil.validateImage(inputStream, contentType, fileSize);
            if (!validation.isValid()) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", validation.getMessage());
                out.print(jsonResponse.toString());
                return;
            }

            // Reset stream for processing
            inputStream = filePart.getInputStream();

            // Optimize image
            ImageUtil.ProcessedImage processedImage = ImageUtil.optimizeForRecordingThumbnail(inputStream, validation.getDetectedFormat());

            session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();

            // Get recording
            Recordings recording = session.get(Recordings.class, recordingId);
            if (recording == null) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Recording not found");
                out.print(jsonResponse.toString());
                transaction.rollback();
                return;
            }

            // Delete old thumbnail if exists
            String oldThumbnailUrl = recording.getThumbnail_url();
            if (oldThumbnailUrl != null && !oldThumbnailUrl.isEmpty()) {
                String oldObjectKey = r2Service.extractObjectKey(oldThumbnailUrl);
                if (oldObjectKey != null) {
                    r2Service.deleteFile(oldObjectKey);
                }
            }

            // Upload new image
            String objectKey = r2Service.generateObjectKey("recordings", String.valueOf(recordingId), validation.getDetectedFormat());
            String publicUrl = r2Service.uploadFile(
                objectKey,
                processedImage.getInputStream(),
                processedImage.getSize(),
                processedImage.getContentType()
            );

            // Update database
            recording.setThumbnail_url(publicUrl);
            session.update(recording);
            transaction.commit();

            jsonResponse.addProperty("success", true);
            jsonResponse.addProperty("message", "Thumbnail uploaded successfully");
            jsonResponse.addProperty("imageUrl", publicUrl);

        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error uploading thumbnail: " + e.getMessage());
        } finally {
            if (session != null && session.isOpen()) {
                session.close();
            }
            out.print(jsonResponse.toString());
        }
    }

    private void handleRecordingThumbnailDelete(HttpServletRequest request, PrintWriter out, JsonObject jsonResponse) {
        Session session = null;
        Transaction transaction = null;

        try {
            String recordingIdStr = request.getParameter("recordingId");
            if (recordingIdStr == null || recordingIdStr.isEmpty()) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Recording ID is required");
                out.print(jsonResponse.toString());
                return;
            }

            int recordingId = Integer.parseInt(recordingIdStr);

            session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();

            Recordings recording = session.get(Recordings.class, recordingId);
            if (recording == null) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Recording not found");
                out.print(jsonResponse.toString());
                transaction.rollback();
                return;
            }

            // Delete from R2
            String thumbnailUrl = recording.getThumbnail_url();
            if (thumbnailUrl != null && !thumbnailUrl.isEmpty()) {
                String objectKey = r2Service.extractObjectKey(thumbnailUrl);
                if (objectKey != null) {
                    r2Service.deleteFile(objectKey);
                }
            }

            // Update database
            recording.setThumbnail_url(null);
            session.update(recording);
            transaction.commit();

            jsonResponse.addProperty("success", true);
            jsonResponse.addProperty("message", "Thumbnail deleted successfully");

        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error deleting thumbnail: " + e.getMessage());
        } finally {
            if (session != null && session.isOpen()) {
                session.close();
            }
            out.print(jsonResponse.toString());
        }
    }

    // Tute Cover Operations

    private void handleTuteCoverUpload(HttpServletRequest request, PrintWriter out, JsonObject jsonResponse) {
        Session session = null;
        Transaction transaction = null;

        try {
            String tuteIdStr = request.getParameter("tuteId");
            if (tuteIdStr == null || tuteIdStr.isEmpty()) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Tute ID is required");
                out.print(jsonResponse.toString());
                return;
            }

            int tuteId = Integer.parseInt(tuteIdStr);
            Part filePart = request.getPart("image");
            if (filePart == null) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Image file is required");
                out.print(jsonResponse.toString());
                return;
            }

            String contentType = filePart.getContentType();
            long fileSize = filePart.getSize();
            InputStream inputStream = filePart.getInputStream();

            // Validate image
            ImageUtil.ValidationResult validation = ImageUtil.validateImage(inputStream, contentType, fileSize);
            if (!validation.isValid()) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", validation.getMessage());
                out.print(jsonResponse.toString());
                return;
            }

            // Reset stream for processing
            inputStream = filePart.getInputStream();

            // Optimize image
            ImageUtil.ProcessedImage processedImage = ImageUtil.optimizeForTuteCover(inputStream, validation.getDetectedFormat());

            session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();

            // Get tute
            Tutes tute = session.get(Tutes.class, tuteId);
            if (tute == null) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Tute not found");
                out.print(jsonResponse.toString());
                transaction.rollback();
                return;
            }

            // Delete old cover if exists
            String oldCoverUrl = tute.getCoverImageUrl();
            if (oldCoverUrl != null && !oldCoverUrl.isEmpty()) {
                String oldObjectKey = r2Service.extractObjectKey(oldCoverUrl);
                if (oldObjectKey != null) {
                    r2Service.deleteFile(oldObjectKey);
                }
            }

            // Upload new image
            String objectKey = r2Service.generateObjectKey("tutes", String.valueOf(tuteId), validation.getDetectedFormat());
            String publicUrl = r2Service.uploadFile(
                objectKey,
                processedImage.getInputStream(),
                processedImage.getSize(),
                processedImage.getContentType()
            );

            // Update database
            tute.setCoverImageUrl(publicUrl);
            session.update(tute);
            transaction.commit();

            jsonResponse.addProperty("success", true);
            jsonResponse.addProperty("message", "Cover image uploaded successfully");
            jsonResponse.addProperty("imageUrl", publicUrl);

        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error uploading cover image: " + e.getMessage());
        } finally {
            if (session != null && session.isOpen()) {
                session.close();
            }
            out.print(jsonResponse.toString());
        }
    }

    private void handleTuteCoverDelete(HttpServletRequest request, PrintWriter out, JsonObject jsonResponse) {
        Session session = null;
        Transaction transaction = null;

        try {
            String tuteIdStr = request.getParameter("tuteId");
            if (tuteIdStr == null || tuteIdStr.isEmpty()) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Tute ID is required");
                out.print(jsonResponse.toString());
                return;
            }

            int tuteId = Integer.parseInt(tuteIdStr);

            session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();

            Tutes tute = session.get(Tutes.class, tuteId);
            if (tute == null) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Tute not found");
                out.print(jsonResponse.toString());
                transaction.rollback();
                return;
            }

            // Delete from R2
            String coverUrl = tute.getCoverImageUrl();
            if (coverUrl != null && !coverUrl.isEmpty()) {
                String objectKey = r2Service.extractObjectKey(coverUrl);
                if (objectKey != null) {
                    r2Service.deleteFile(objectKey);
                }
            }

            // Update database
            tute.setCoverImageUrl(null);
            session.update(tute);
            transaction.commit();

            jsonResponse.addProperty("success", true);
            jsonResponse.addProperty("message", "Cover image deleted successfully");

        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error deleting cover image: " + e.getMessage());
        } finally {
            if (session != null && session.isOpen()) {
                session.close();
            }
            out.print(jsonResponse.toString());
        }
    }

    // Testimonial Image Operations

    private void handleTestimonialImageUpload(HttpServletRequest request, PrintWriter out, JsonObject jsonResponse) {
        Session session = null;
        Transaction transaction = null;

        try {
            String testimonialIdStr = request.getParameter("testimonialId");
            if (testimonialIdStr == null || testimonialIdStr.isEmpty()) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Testimonial ID is required");
                out.print(jsonResponse.toString());
                return;
            }

            int testimonialId = Integer.parseInt(testimonialIdStr);
            Part filePart = request.getPart("image");
            if (filePart == null) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Image file is required");
                out.print(jsonResponse.toString());
                return;
            }

            String contentType = filePart.getContentType();
            long fileSize = filePart.getSize();
            InputStream inputStream = filePart.getInputStream();

            // Validate image
            ImageUtil.ValidationResult validation = ImageUtil.validateImage(inputStream, contentType, fileSize);
            if (!validation.isValid()) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", validation.getMessage());
                out.print(jsonResponse.toString());
                return;
            }

            // Reset stream for processing
            inputStream = filePart.getInputStream();

            // Optimize image
            ImageUtil.ProcessedImage processedImage = ImageUtil.optimizeForTestimonialProfile(inputStream, validation.getDetectedFormat());

            session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();

            // Get testimonial
            PortfolioTestimonial testimonial = session.get(PortfolioTestimonial.class, testimonialId);
            if (testimonial == null) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Testimonial not found");
                out.print(jsonResponse.toString());
                transaction.rollback();
                return;
            }

            // Delete old image if exists
            String oldImageUrl = testimonial.getImage();
            if (oldImageUrl != null && !oldImageUrl.isEmpty()) {
                String oldObjectKey = r2Service.extractObjectKey(oldImageUrl);
                if (oldObjectKey != null) {
                    r2Service.deleteFile(oldObjectKey);
                }
            }

            // Upload new image
            String objectKey = r2Service.generateObjectKey("testimonials", String.valueOf(testimonialId), validation.getDetectedFormat());
            String publicUrl = r2Service.uploadFile(
                objectKey,
                processedImage.getInputStream(),
                processedImage.getSize(),
                processedImage.getContentType()
            );

            // Update database
            testimonial.setImage(publicUrl);
            testimonial.setUpdatedAt(new Date());
            session.update(testimonial);
            transaction.commit();

            jsonResponse.addProperty("success", true);
            jsonResponse.addProperty("message", "Profile image uploaded successfully");
            jsonResponse.addProperty("imageUrl", publicUrl);

        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error uploading profile image: " + e.getMessage());
        } finally {
            if (session != null && session.isOpen()) {
                session.close();
            }
            out.print(jsonResponse.toString());
        }
    }

    // Event Image Operations

    private void handleEventImageUpload(HttpServletRequest request, PrintWriter out, JsonObject jsonResponse) {
        Session session = null;
        Transaction transaction = null;

        try {
            String eventIdStr = request.getParameter("eventId");
            if (eventIdStr == null || eventIdStr.isEmpty()) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Event ID is required");
                out.print(jsonResponse.toString());
                return;
            }

            int eventId = Integer.parseInt(eventIdStr);
            Part filePart = request.getPart("image");
            if (filePart == null) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Image file is required");
                out.print(jsonResponse.toString());
                return;
            }

            String contentType = filePart.getContentType();
            long fileSize = filePart.getSize();
            InputStream inputStream = filePart.getInputStream();

            // Validate image
            ImageUtil.ValidationResult validation = ImageUtil.validateImage(inputStream, contentType, fileSize);
            if (!validation.isValid()) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", validation.getMessage());
                out.print(jsonResponse.toString());
                return;
            }

            // Reset stream for processing
            inputStream = filePart.getInputStream();

            // Optimize image (use gallery optimization for events)
            ImageUtil.ProcessedImage processedImage = ImageUtil.optimizeForGallery(inputStream, validation.getDetectedFormat());

            session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();

            // Get event
            PortfolioEvent event = session.get(PortfolioEvent.class, eventId);
            if (event == null) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Event not found");
                out.print(jsonResponse.toString());
                transaction.rollback();
                return;
            }

            // Delete old image if exists
            String oldImageUrl = event.getImage();
            if (oldImageUrl != null && !oldImageUrl.isEmpty()) {
                String oldObjectKey = r2Service.extractObjectKey(oldImageUrl);
                if (oldObjectKey != null) {
                    r2Service.deleteFile(oldObjectKey);
                }
            }

            // Upload new image
            String objectKey = r2Service.generateObjectKey("events", String.valueOf(eventId), validation.getDetectedFormat());
            String publicUrl = r2Service.uploadFile(
                objectKey,
                processedImage.getInputStream(),
                processedImage.getSize(),
                processedImage.getContentType()
            );

            // Update database
            event.setImage(publicUrl);
            event.setUpdatedAt(new Date());
            session.update(event);
            transaction.commit();

            jsonResponse.addProperty("success", true);
            jsonResponse.addProperty("message", "Event image uploaded successfully");
            jsonResponse.addProperty("imageUrl", publicUrl);

        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error uploading event image: " + e.getMessage());
        } finally {
            if (session != null && session.isOpen()) {
                session.close();
            }
            out.print(jsonResponse.toString());
        }
    }

    private void handleEventImageDelete(HttpServletRequest request, PrintWriter out, JsonObject jsonResponse) {
        Session session = null;
        Transaction transaction = null;

        try {
            String eventIdStr = request.getParameter("eventId");
            if (eventIdStr == null || eventIdStr.isEmpty()) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Event ID is required");
                out.print(jsonResponse.toString());
                return;
            }

            int eventId = Integer.parseInt(eventIdStr);

            session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();

            PortfolioEvent event = session.get(PortfolioEvent.class, eventId);
            if (event == null) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Event not found");
                out.print(jsonResponse.toString());
                transaction.rollback();
                return;
            }

            // Delete from R2
            String imageUrl = event.getImage();
            if (imageUrl != null && !imageUrl.isEmpty()) {
                String objectKey = r2Service.extractObjectKey(imageUrl);
                if (objectKey != null) {
                    r2Service.deleteFile(objectKey);
                }
            }

            // Update database (set to default placeholder)
            event.setImage("https://placehold.co/400x300/3c6299/FFFFFF?text=Event");
            event.setUpdatedAt(new Date());
            session.update(event);
            transaction.commit();

            jsonResponse.addProperty("success", true);
            jsonResponse.addProperty("message", "Event image deleted successfully");

        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error deleting event image: " + e.getMessage());
        } finally {
            if (session != null && session.isOpen()) {
                session.close();
            }
            out.print(jsonResponse.toString());
        }
    }

    // Gallery Operations

    private void handleGalleryImageUpload(HttpServletRequest request, PrintWriter out, JsonObject jsonResponse) {
        Session session = null;
        Transaction transaction = null;

        try {
            Part filePart = request.getPart("image");
            if (filePart == null) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Image file is required");
                out.print(jsonResponse.toString());
                return;
            }

            String contentType = filePart.getContentType();
            long fileSize = filePart.getSize();
            InputStream inputStream = filePart.getInputStream();

            // Validate image
            ImageUtil.ValidationResult validation = ImageUtil.validateImage(inputStream, contentType, fileSize);
            if (!validation.isValid()) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", validation.getMessage());
                out.print(jsonResponse.toString());
                return;
            }

            // Reset stream for processing
            inputStream = filePart.getInputStream();

            // Optimize image
            ImageUtil.ProcessedImage processedImage = ImageUtil.optimizeForGallery(inputStream, validation.getDetectedFormat());

            session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();

            // Get current max display order
            Query<Integer> maxOrderQuery = session.createQuery(
                "SELECT MAX(g.displayOrder) FROM PortfolioGalleryImage g WHERE g.isActive = true",
                Integer.class
            );
            Integer maxOrder = maxOrderQuery.uniqueResult();
            int newOrder = (maxOrder != null) ? maxOrder + 1 : 0;

            // Upload new image
            String objectKey = r2Service.generateObjectKey("gallery", "new", validation.getDetectedFormat());
            String publicUrl = r2Service.uploadFile(
                objectKey,
                processedImage.getInputStream(),
                processedImage.getSize(),
                processedImage.getContentType()
            );

            // Create gallery image record
            PortfolioGalleryImage galleryImage = new PortfolioGalleryImage();
            galleryImage.setImageUrl(publicUrl);
            galleryImage.setDisplayOrder(newOrder);
            galleryImage.setActive(true);
            galleryImage.setCreatedAt(new Date());
            galleryImage.setUpdatedAt(new Date());
            session.save(galleryImage);
            transaction.commit();

            jsonResponse.addProperty("success", true);
            jsonResponse.addProperty("message", "Gallery image uploaded successfully");
            jsonResponse.addProperty("imageUrl", publicUrl);
            jsonResponse.addProperty("id", galleryImage.getId());
            jsonResponse.addProperty("displayOrder", newOrder);

        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error uploading gallery image: " + e.getMessage());
        } finally {
            if (session != null && session.isOpen()) {
                session.close();
            }
            out.print(jsonResponse.toString());
        }
    }

    private void handleGalleryImageDelete(HttpServletRequest request, PrintWriter out, JsonObject jsonResponse) {
        Session session = null;
        Transaction transaction = null;

        try {
            String imageIdStr = request.getParameter("imageId");
            if (imageIdStr == null || imageIdStr.isEmpty()) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Image ID is required");
                out.print(jsonResponse.toString());
                return;
            }

            int imageId = Integer.parseInt(imageIdStr);

            session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();

            PortfolioGalleryImage galleryImage = session.get(PortfolioGalleryImage.class, imageId);
            if (galleryImage == null) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Gallery image not found");
                out.print(jsonResponse.toString());
                transaction.rollback();
                return;
            }

            // Delete from R2
            String imageUrl = galleryImage.getImageUrl();
            if (imageUrl != null && !imageUrl.isEmpty()) {
                String objectKey = r2Service.extractObjectKey(imageUrl);
                if (objectKey != null) {
                    r2Service.deleteFile(objectKey);
                }
            }

            // Delete from database
            session.delete(galleryImage);
            transaction.commit();

            jsonResponse.addProperty("success", true);
            jsonResponse.addProperty("message", "Gallery image deleted successfully");

        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error deleting gallery image: " + e.getMessage());
        } finally {
            if (session != null && session.isOpen()) {
                session.close();
            }
            out.print(jsonResponse.toString());
        }
    }

    private void handleListGalleryImages(HttpServletRequest request, PrintWriter out, JsonObject jsonResponse) {
        Session session = null;

        try {
            session = HibernateUtil.getSessionFactory().openSession();

            Query<PortfolioGalleryImage> query = session.createQuery(
                "FROM PortfolioGalleryImage WHERE isActive = true ORDER BY displayOrder",
                PortfolioGalleryImage.class
            );
            List<PortfolioGalleryImage> images = query.list();

            com.google.gson.JsonArray imagesArray = new com.google.gson.JsonArray();
            for (PortfolioGalleryImage image : images) {
                JsonObject imageJson = new JsonObject();
                imageJson.addProperty("id", image.getId());
                imageJson.addProperty("imageUrl", image.getImageUrl());
                imageJson.addProperty("displayOrder", image.getDisplayOrder());
                imagesArray.add(imageJson);
            }

            jsonResponse.addProperty("success", true);
            jsonResponse.add("images", imagesArray);

        } catch (Exception e) {
            e.printStackTrace();
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error listing gallery images: " + e.getMessage());
        } finally {
            if (session != null && session.isOpen()) {
                session.close();
            }
            out.print(jsonResponse.toString());
        }
    }

    private void handleReorderGalleryImages(HttpServletRequest request, PrintWriter out, JsonObject jsonResponse) {
        Session session = null;
        Transaction transaction = null;

        try {
            String orderData = request.getParameter("orderData");
            if (orderData == null || orderData.isEmpty()) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Order data is required");
                out.print(jsonResponse.toString());
                return;
            }

            com.google.gson.Gson gson = new com.google.gson.Gson();
            java.lang.reflect.Type listType = new com.google.gson.reflect.TypeToken<java.util.List<GalleryOrderItem>>() {}.getType();
            java.util.List<GalleryOrderItem> orderItems = gson.fromJson(orderData, listType);

            session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();

            for (GalleryOrderItem item : orderItems) {
                PortfolioGalleryImage image = session.get(PortfolioGalleryImage.class, item.getId());
                if (image != null) {
                    image.setDisplayOrder(item.getDisplayOrder());
                    image.setUpdatedAt(new Date());
                    session.update(image);
                }
            }

            transaction.commit();

            jsonResponse.addProperty("success", true);
            jsonResponse.addProperty("message", "Gallery images reordered successfully");

        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error reordering gallery images: " + e.getMessage());
        } finally {
            if (session != null && session.isOpen()) {
                session.close();
            }
            out.print(jsonResponse.toString());
        }
    }

    // Branch Image Operations

    private void handleBranchImageUpload(HttpServletRequest request, PrintWriter out, JsonObject jsonResponse) {
        Session session = null;
        Transaction transaction = null;

        try {
            String branchName = request.getParameter("branchName");
            if (branchName == null || branchName.isEmpty()) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Branch name is required");
                out.print(jsonResponse.toString());
                return;
            }

            Part filePart = request.getPart("image");
            if (filePart == null) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Image file is required");
                out.print(jsonResponse.toString());
                return;
            }

            String contentType = filePart.getContentType();
            long fileSize = filePart.getSize();
            InputStream inputStream = filePart.getInputStream();

            // Validate image
            ImageUtil.ValidationResult validation = ImageUtil.validateImage(inputStream, contentType, fileSize);
            if (!validation.isValid()) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", validation.getMessage());
                out.print(jsonResponse.toString());
                return;
            }

            // Reset stream for processing
            inputStream = filePart.getInputStream();

            // Optimize image
            ImageUtil.ProcessedImage processedImage = ImageUtil.optimizeForBranchImage(inputStream, validation.getDetectedFormat());

            session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();

            // Check if branch image already exists
            Query<PortfolioBranchImage> query = session.createQuery(
                "FROM PortfolioBranchImage WHERE branchName = :branchName",
                PortfolioBranchImage.class
            );
            query.setParameter("branchName", branchName);
            PortfolioBranchImage existingImage = query.uniqueResult();

            // Delete old image if exists
            if (existingImage != null) {
                String oldImageUrl = existingImage.getImageUrl();
                if (oldImageUrl != null && !oldImageUrl.isEmpty()) {
                    String oldObjectKey = r2Service.extractObjectKey(oldImageUrl);
                    if (oldObjectKey != null) {
                        r2Service.deleteFile(oldObjectKey);
                    }
                }
            }

            // Upload new image
            String encodedBranchName = java.net.URLEncoder.encode(branchName, "UTF-8");
            String objectKey = r2Service.generateObjectKey("branches", encodedBranchName, validation.getDetectedFormat());
            String publicUrl = r2Service.uploadFile(
                objectKey,
                processedImage.getInputStream(),
                processedImage.getSize(),
                processedImage.getContentType()
            );

            // Create or update branch image record
            PortfolioBranchImage branchImage;
            if (existingImage != null) {
                branchImage = existingImage;
                branchImage.setImageUrl(publicUrl);
                branchImage.setUpdatedAt(new Date());
                session.update(branchImage);
            } else {
                branchImage = new PortfolioBranchImage();
                branchImage.setBranchName(branchName);
                branchImage.setImageUrl(publicUrl);
                branchImage.setActive(true);
                branchImage.setCreatedAt(new Date());
                branchImage.setUpdatedAt(new Date());
                session.save(branchImage);
            }

            transaction.commit();

            jsonResponse.addProperty("success", true);
            jsonResponse.addProperty("message", "Branch image uploaded successfully");
            jsonResponse.addProperty("imageUrl", publicUrl);

        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error uploading branch image: " + e.getMessage());
        } finally {
            if (session != null && session.isOpen()) {
                session.close();
            }
            out.print(jsonResponse.toString());
        }
    }

    private void handleBranchImageDelete(HttpServletRequest request, PrintWriter out, JsonObject jsonResponse) {
        Session session = null;
        Transaction transaction = null;

        try {
            String branchName = request.getParameter("branchName");
            if (branchName == null || branchName.isEmpty()) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Branch name is required");
                out.print(jsonResponse.toString());
                return;
            }

            session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();

            Query<PortfolioBranchImage> query = session.createQuery(
                "FROM PortfolioBranchImage WHERE branchName = :branchName",
                PortfolioBranchImage.class
            );
            query.setParameter("branchName", branchName);
            PortfolioBranchImage branchImage = query.uniqueResult();

            if (branchImage == null) {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Branch image not found");
                out.print(jsonResponse.toString());
                transaction.rollback();
                return;
            }

            // Delete from R2
            String imageUrl = branchImage.getImageUrl();
            if (imageUrl != null && !imageUrl.isEmpty()) {
                String objectKey = r2Service.extractObjectKey(imageUrl);
                if (objectKey != null) {
                    r2Service.deleteFile(objectKey);
                }
            }

            // Delete from database
            session.delete(branchImage);
            transaction.commit();

            jsonResponse.addProperty("success", true);
            jsonResponse.addProperty("message", "Branch image deleted successfully");

        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error deleting branch image: " + e.getMessage());
        } finally {
            if (session != null && session.isOpen()) {
                session.close();
            }
            out.print(jsonResponse.toString());
        }
    }

    private void handleListBranchImages(HttpServletRequest request, PrintWriter out, JsonObject jsonResponse) {
        Session session = null;

        try {
            session = HibernateUtil.getSessionFactory().openSession();

            Query<PortfolioBranchImage> query = session.createQuery(
                "FROM PortfolioBranchImage WHERE isActive = true",
                PortfolioBranchImage.class
            );
            List<PortfolioBranchImage> images = query.list();

            com.google.gson.JsonArray imagesArray = new com.google.gson.JsonArray();
            for (PortfolioBranchImage image : images) {
                JsonObject imageJson = new JsonObject();
                imageJson.addProperty("id", image.getId());
                imageJson.addProperty("branchName", image.getBranchName());
                imageJson.addProperty("imageUrl", image.getImageUrl());
                imagesArray.add(imageJson);
            }

            jsonResponse.addProperty("success", true);
            jsonResponse.add("images", imagesArray);

        } catch (Exception e) {
            e.printStackTrace();
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error listing branch images: " + e.getMessage());
        } finally {
            if (session != null && session.isOpen()) {
                session.close();
            }
            out.print(jsonResponse.toString());
        }
    }

    // Helper class for gallery reordering
    private static class GalleryOrderItem {
        private int id;
        private int displayOrder;

        public int getId() { return id; }
        public void setId(int id) { this.id = id; }
        public int getDisplayOrder() { return displayOrder; }
        public void setDisplayOrder(int displayOrder) { this.displayOrder = displayOrder; }
    }
}
