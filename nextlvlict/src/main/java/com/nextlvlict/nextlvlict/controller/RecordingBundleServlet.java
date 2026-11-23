package com.nextlvlict.nextlvlict.controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.annotations.Expose;
import com.nextlvlict.nextlvlict.hibernate.AccessType;
import com.nextlvlict.nextlvlict.hibernate.BundleLesson;
import com.nextlvlict.nextlvlict.hibernate.BundlePurchase;
import com.nextlvlict.nextlvlict.hibernate.BundleRecording;
import com.nextlvlict.nextlvlict.hibernate.BundleRecordingId;
import com.nextlvlict.nextlvlict.hibernate.Grade;
import com.nextlvlict.nextlvlict.hibernate.HibernateUtil;
import com.nextlvlict.nextlvlict.hibernate.RecordingBundle;
import com.nextlvlict.nextlvlict.hibernate.Recordings;
import com.nextlvlict.nextlvlict.hibernate.Students;
import org.hibernate.Hibernate;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.query.Query;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Root;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;
import java.util.List;

@WebServlet(name = "RecordingBundleServlet", urlPatterns = {"/RecordingBundleServlet"})
public class RecordingBundleServlet extends HttpServlet {

    private Gson gson = new GsonBuilder()
            .setDateFormat("yyyy-MM-dd")
            .excludeFieldsWithoutExposeAnnotation()
            .create();

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String action = request.getParameter("action");
        PrintWriter out = response.getWriter();

        try {
            if (action == null) {
                out.print(gson.toJson(new Response(false, "Action parameter is required")));
                return;
            }

            switch (action) {
                case "getAll":
                    getAllBundles(out);
                    break;
                case "getById":
                    getBundleById(request, out);
                    break;
                case "getByGrade":
                    getBundlesByGrade(request, out);
                    break;
                case "getStudentBundles":
                    getStudentBundles(request, out);
                    break;
                case "save":
                    saveBundle(request, out);
                    break;
                case "update":
                    updateBundle(request, out);
                    break;
                case "delete":
                    deleteBundle(request, out);
                    break;
                case "addRecordingToBundle":
                    addRecordingToBundle(request, out);
                    break;
                case "removeRecordingFromBundle":
                    removeRecordingFromBundle(request, out);
                    break;
                case "getBundleLessons":
                    getBundleLessons(request, out);
                    break;
                case "addLessonToBundle":
                    addLessonToBundle(request, out);
                    break;
                case "removeLessonFromBundle":
                    removeLessonFromBundle(request, out);
                    break;
                case "getAvailableBundlesForStudent":
                    getAvailableBundlesForStudent(request, out);
                    break;
                default:
                    out.print(gson.toJson(new Response(false, "Invalid action: " + action)));
                    break;
            }
        } catch (Exception e) {
            e.printStackTrace();
            out.print(gson.toJson(new Response(false, "Server error: " + e.getMessage())));
        }
    }

    private void getAllBundles(PrintWriter out) {
        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<RecordingBundle> cq = cb.createQuery(RecordingBundle.class);
            Root<RecordingBundle> root = cq.from(RecordingBundle.class);

            cq.where(cb.equal(root.get("is_active"), 1));
            cq.orderBy(cb.desc(root.get("created_at")));

            Query<RecordingBundle> query = session.createQuery(cq);
            List<RecordingBundle> bundles = query.getResultList();

            // Initialize lazy collections before session closes
            for (RecordingBundle bundle : bundles) {
                Hibernate.initialize(bundle.getBundleLessons());
            }

            if (bundles.isEmpty()) {
                out.print(gson.toJson(new Response(true, "No bundles found", new RecordingBundle[0])));
            } else {
                out.print(gson.toJson(new Response(true, "Bundles found", bundles)));
            }
            out.flush();
        } catch (Exception e) {
            out.print(gson.toJson(new Response(false, "Error fetching bundles: " + e.getMessage())));
            out.flush();
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    private void getBundleById(HttpServletRequest request, PrintWriter out) {
        String idParam = request.getParameter("id");
        if (idParam == null || idParam.isEmpty()) {
            out.print(gson.toJson(new Response(false, "ID parameter is required")));
            return;
        }

        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            int id = Integer.parseInt(idParam);
            RecordingBundle bundle = (RecordingBundle) session.get(RecordingBundle.class, id);

            if (bundle != null && bundle.getIs_active() == 1) {
                Hibernate.initialize(bundle.getBundleLessons());
                out.print(gson.toJson(new Response(true, "Bundle found", bundle)));
            } else {
                out.print(gson.toJson(new Response(false, "Bundle not found")));
            }
        } catch (Exception e) {
            out.print(gson.toJson(new Response(false, "Error fetching bundle: " + e.getMessage())));
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    private void getBundlesByGrade(HttpServletRequest request, PrintWriter out) {
        String gradeIdParam = request.getParameter("grade_id");
        if (gradeIdParam == null || gradeIdParam.isEmpty()) {
            out.print(gson.toJson(new Response(false, "Grade ID parameter is required")));
            return;
        }

        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            int gradeId = Integer.parseInt(gradeIdParam);

            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<RecordingBundle> cq = cb.createQuery(RecordingBundle.class);
            Root<RecordingBundle> root = cq.from(RecordingBundle.class);
            Join<RecordingBundle, Grade> gradeJoin = root.join("grade");

            cq.where(
                cb.and(
                    cb.equal(gradeJoin.get("id"), gradeId),
                    cb.equal(root.get("is_active"), 1)
                )
            );
            cq.orderBy(cb.desc(root.get("created_at")));

            Query<RecordingBundle> query = session.createQuery(cq);
            List<RecordingBundle> bundles = query.getResultList();

            // Initialize lazy collections before session closes
            for (RecordingBundle bundle : bundles) {
                Hibernate.initialize(bundle.getBundleLessons());
            }

            if (bundles.isEmpty()) {
                out.print(gson.toJson(new Response(true, "No bundles found for this grade", new RecordingBundle[0])));
            } else {
                out.print(gson.toJson(new Response(true, "Bundles found", bundles)));
            }
        } catch (Exception e) {
            out.print(gson.toJson(new Response(false, "Error fetching bundles: " + e.getMessage())));
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    private void getStudentBundles(HttpServletRequest request, PrintWriter out) {
        String studentId = request.getParameter("studentId");
        if (studentId == null || studentId.isEmpty()) {
            out.print(gson.toJson(new Response(false, "Student ID parameter is required")));
            return;
        }

        try {
            Session session = HibernateUtil.getSessionFactory().openSession();

            // Get student's purchased bundles
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<BundlePurchase> cq = cb.createQuery(BundlePurchase.class);
            Root<BundlePurchase> root = cq.from(BundlePurchase.class);

            cq.where(cb.equal(root.get("studentsId"), studentId));
            cq.orderBy(cb.desc(root.get("purchase_date")));

            Query<BundlePurchase> query = session.createQuery(cq);
            List<BundlePurchase> purchases = query.getResultList();

            JsonArray bundlesArray = new JsonArray();
            for (BundlePurchase purchase : purchases) {
                RecordingBundle bundle = (RecordingBundle) session.get(RecordingBundle.class, purchase.getBundleId());
                if (bundle != null && bundle.getIs_active() == 1) {
                    JsonObject bundleJson = new JsonObject();
                    bundleJson.addProperty("id", bundle.getId());
                    bundleJson.addProperty("title", bundle.getTitle());
                    bundleJson.addProperty("description", bundle.getDescription());
                    bundleJson.addProperty("price", bundle.getPrice());
                    bundleJson.addProperty("accessType", bundle.getAccessType() != null ? bundle.getAccessType().name() : "PAID");
                    bundleJson.addProperty("thumbnail_url", bundle.getThumbnail_url());
                    bundleJson.addProperty("purchaseDate", purchase.getPurchase_date().toString());
                    bundleJson.addProperty("paymentStatus", purchase.getPayment_status());
                    if (bundle.getGrade() != null) {
                        bundleJson.addProperty("gradeId", bundle.getGrade().getId());
                        bundleJson.addProperty("gradeName", bundle.getGrade().getName());
                    }
                    bundlesArray.add(bundleJson);
                }
            }

            JsonObject response = new JsonObject();
            response.addProperty("success", true);
            response.add("bundles", bundlesArray);
            out.print(response.toString());

        } catch (Exception e) {
            out.print(gson.toJson(new Response(false, "Error fetching student bundles: " + e.getMessage())));
        }
    }

    private void getAvailableBundlesForStudent(HttpServletRequest request, PrintWriter out) {
        String studentId = request.getParameter("studentId");
        if (studentId == null || studentId.isEmpty()) {
            out.print(gson.toJson(new Response(false, "Student ID parameter is required")));
            return;
        }

        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();

            // Get student's grade
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Students> studentCq = cb.createQuery(Students.class);
            Root<Students> studentRoot = studentCq.from(Students.class);
            studentCq.where(cb.equal(studentRoot.get("id"), studentId));
            Query<Students> studentQuery = session.createQuery(studentCq);
            Students student = studentQuery.uniqueResult();

            if (student == null || student.getGrade() == null) {
                out.print(gson.toJson(new Response(false, "Student or grade not found")));
                return;
            }

            int gradeId = student.getGrade().getId();

            // Get all active bundles for this grade
            CriteriaQuery<RecordingBundle> bundleCq = cb.createQuery(RecordingBundle.class);
            Root<RecordingBundle> bundleRoot = bundleCq.from(RecordingBundle.class);
            bundleCq.where(
                cb.and(
                    cb.equal(bundleRoot.get("grade").get("id"), gradeId),
                    cb.equal(bundleRoot.get("is_active"), 1)
                )
            );
            bundleCq.orderBy(cb.desc(bundleRoot.get("created_at")));
            Query<RecordingBundle> bundleQuery = session.createQuery(bundleCq);
            List<RecordingBundle> bundles = bundleQuery.getResultList();

            // Get student's purchased bundles
            CriteriaQuery<BundlePurchase> purchaseCq = cb.createQuery(BundlePurchase.class);
            Root<BundlePurchase> purchaseRoot = purchaseCq.from(BundlePurchase.class);
            purchaseCq.where(cb.equal(purchaseRoot.get("studentsId"), studentId));
            Query<BundlePurchase> purchaseQuery = session.createQuery(purchaseCq);
            List<BundlePurchase> purchases = purchaseQuery.getResultList();

            // Create a set of purchased bundle IDs for quick lookup
            java.util.Set<Integer> purchasedBundleIds = new java.util.HashSet<>();
            for (BundlePurchase purchase : purchases) {
                purchasedBundleIds.add(purchase.getBundleId());
            }

            JsonArray bundlesArray = new JsonArray();
            for (RecordingBundle bundle : bundles) {
                Hibernate.initialize(bundle.getBundleLessons());
                JsonObject bundleJson = new JsonObject();
                bundleJson.addProperty("id", bundle.getId());
                bundleJson.addProperty("title", bundle.getTitle());
                bundleJson.addProperty("description", bundle.getDescription());
                bundleJson.addProperty("price", bundle.getPrice());
                bundleJson.addProperty("accessType", bundle.getAccessType() != null ? bundle.getAccessType().name() : "PAID");
                bundleJson.addProperty("thumbnail_url", bundle.getThumbnail_url());
                bundleJson.addProperty("gradeId", bundle.getGrade().getId());
                bundleJson.addProperty("gradeName", bundle.getGrade().getName());

                // Check if student has purchased this bundle
                boolean isPurchased = purchasedBundleIds.contains(bundle.getId());
                bundleJson.addProperty("isPurchased", isPurchased);

                // For FREE bundles, they are always accessible
                // For PAID bundles, they are only accessible if purchased
                boolean isAccessible = bundle.getAccessType() == AccessType.FREE || isPurchased;
                bundleJson.addProperty("isAccessible", isAccessible);

                bundlesArray.add(bundleJson);
            }

            JsonObject response = new JsonObject();
            response.addProperty("success", true);
            response.add("bundles", bundlesArray);
            out.print(response.toString());

        } catch (Exception e) {
            out.print(gson.toJson(new Response(false, "Error fetching available bundles: " + e.getMessage())));
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    private void saveBundle(HttpServletRequest request, PrintWriter out) {
        Transaction transaction = null;
        Session session = null;

        try {
            session = HibernateUtil.getSessionFactory().openSession();

            String title = request.getParameter("title");
            String description = request.getParameter("description");
            String gradeId = request.getParameter("grade_id");
            String accessTypeParam = request.getParameter("access_type");
            String priceParam = request.getParameter("price");
            String lessonsParam = request.getParameter("lessons");

            if (title == null || title.isEmpty() || gradeId == null || gradeId.isEmpty()) {
                out.print(gson.toJson(new Response(false, "Title and Grade are required")));
                out.flush();
                return;
            }

            transaction = session.beginTransaction();

            RecordingBundle bundle = new RecordingBundle();
            bundle.setTitle(title);
            bundle.setDescription(description);

            // Set access type
            if (accessTypeParam != null && !accessTypeParam.isEmpty()) {
                try {
                    bundle.setAccessType(AccessType.valueOf(accessTypeParam.toUpperCase()));
                } catch (IllegalArgumentException e) {
                    bundle.setAccessType(AccessType.PAID);
                }
            } else {
                bundle.setAccessType(AccessType.PAID);
            }

            // Set price
            if (priceParam != null && !priceParam.isEmpty()) {
                try {
                    double price = Double.parseDouble(priceParam);
                    bundle.setPrice(price);
                } catch (NumberFormatException e) {
                    bundle.setPrice(0.0);
                }
            } else {
                bundle.setPrice(0.0);
            }

            Grade grade = (Grade) session.get(Grade.class, Integer.parseInt(gradeId));
            if (grade == null) {
                out.print(gson.toJson(new Response(false, "Invalid grade ID")));
                out.flush();
                return;
            }
            bundle.setGrade(grade);

            session.save(bundle);

            // Add lessons to bundle if provided
            if (lessonsParam != null && !lessonsParam.isEmpty()) {
                try {
                    JsonArray lessonsArray = gson.fromJson(lessonsParam, JsonArray.class);
                    int displayOrder = 0;
                    for (int i = 0; i < lessonsArray.size(); i++) {
                        JsonObject lessonJson = lessonsArray.get(i).getAsJsonObject();
                        BundleLesson lesson = new BundleLesson();
                        lesson.setBundleId(bundle.getId());
                        lesson.setBundle(bundle);
                        lesson.setTitle(lessonJson.has("title") && !lessonJson.get("title").isJsonNull() ? lessonJson.get("title").getAsString() : "");
                        lesson.setDescription(lessonJson.has("description") && !lessonJson.get("description").isJsonNull() ? lessonJson.get("description").getAsString() : "");
                        lesson.setYoutubeUrl(lessonJson.has("youtube_url") && !lessonJson.get("youtube_url").isJsonNull() ? lessonJson.get("youtube_url").getAsString() : "");
                        lesson.setThumbnailUrl(lessonJson.has("thumbnail_url") && !lessonJson.get("thumbnail_url").isJsonNull() ? lessonJson.get("thumbnail_url").getAsString() : null);
                        lesson.setDisplayOrder(displayOrder++);
                        lesson.setIsActive(1);
                        session.save(lesson);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                    // Continue even if lessons fail to parse
                }
            }

            transaction.commit();
            out.print(gson.toJson(new Response(true, "Bundle saved successfully")));
            out.flush();

        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            out.print(gson.toJson(new Response(false, "Error saving bundle: " + e.getMessage())));
            out.flush();
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    private void updateBundle(HttpServletRequest request, PrintWriter out) {
        Transaction transaction = null;
        Session session = null;

        try {
            session = HibernateUtil.getSessionFactory().openSession();

            String bundleId = request.getParameter("id");
            String title = request.getParameter("title");
            String description = request.getParameter("description");
            String gradeId = request.getParameter("grade_id");
            String accessTypeParam = request.getParameter("access_type");
            String priceParam = request.getParameter("price");
            String lessonsParam = request.getParameter("lessons");

            if (bundleId == null || bundleId.isEmpty()) {
                out.print(gson.toJson(new Response(false, "ID parameter is required")));
                out.flush();
                return;
            }

            transaction = session.beginTransaction();

            int id = Integer.parseInt(bundleId);
            RecordingBundle bundle = (RecordingBundle) session.get(RecordingBundle.class, id);

            if (bundle != null) {
                bundle.setTitle(title != null ? title : bundle.getTitle());
                bundle.setDescription(description != null ? description : bundle.getDescription());

                if (accessTypeParam != null && !accessTypeParam.isEmpty()) {
                    try {
                        bundle.setAccessType(AccessType.valueOf(accessTypeParam.toUpperCase()));
                    } catch (IllegalArgumentException e) {
                        // Keep existing value if invalid
                    }
                }

                if (priceParam != null && !priceParam.isEmpty()) {
                    try {
                        double price = Double.parseDouble(priceParam);
                        bundle.setPrice(price);
                    } catch (NumberFormatException e) {
                        // Keep existing value if invalid
                    }
                }

                if (gradeId != null && !gradeId.isEmpty()) {
                    Grade grade = (Grade) session.get(Grade.class, Integer.parseInt(gradeId));
                    if (grade != null) {
                        bundle.setGrade(grade);
                    }
                }

                session.update(bundle);

                // Update lessons if provided
                if (lessonsParam != null && !lessonsParam.isEmpty()) {
                    // Delete existing lessons for this bundle
                    Query<?> deleteQuery = session.createQuery(
                        "DELETE FROM BundleLesson WHERE bundleId = :bundleId"
                    );
                    deleteQuery.setParameter("bundleId", id);
                    deleteQuery.executeUpdate();

                    // Add new lessons
                    try {
                        JsonArray lessonsArray = gson.fromJson(lessonsParam, JsonArray.class);
                        int displayOrder = 0;
                        for (int i = 0; i < lessonsArray.size(); i++) {
                            JsonObject lessonJson = lessonsArray.get(i).getAsJsonObject();
                            BundleLesson lesson = new BundleLesson();
                            lesson.setBundleId(id);
                            lesson.setBundle(bundle);
                            lesson.setTitle(lessonJson.has("title") && !lessonJson.get("title").isJsonNull() ? lessonJson.get("title").getAsString() : "");
                            lesson.setDescription(lessonJson.has("description") && !lessonJson.get("description").isJsonNull() ? lessonJson.get("description").getAsString() : "");
                            lesson.setYoutubeUrl(lessonJson.has("youtube_url") && !lessonJson.get("youtube_url").isJsonNull() ? lessonJson.get("youtube_url").getAsString() : "");
                            lesson.setThumbnailUrl(lessonJson.has("thumbnail_url") && !lessonJson.get("thumbnail_url").isJsonNull() ? lessonJson.get("thumbnail_url").getAsString() : null);
                            lesson.setDisplayOrder(displayOrder++);
                            lesson.setIsActive(1);
                            session.save(lesson);
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                        // Continue even if lessons fail to parse
                    }
                }

                transaction.commit();

                out.print(gson.toJson(new Response(true, "Bundle updated successfully")));
                out.flush();
            } else {
                out.print(gson.toJson(new Response(false, "Bundle not found")));
                out.flush();
            }
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            out.print(gson.toJson(new Response(false, "Error updating bundle: " + e.getMessage())));
            out.flush();
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    private void deleteBundle(HttpServletRequest request, PrintWriter out) {
        String idParam = request.getParameter("id");
        if (idParam == null || idParam.isEmpty()) {
            out.print(gson.toJson(new Response(false, "ID parameter is required")));
            return;
        }

        Transaction transaction = null;
        try {
            Session session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();

            int id = Integer.parseInt(idParam);
            RecordingBundle bundle = (RecordingBundle) session.get(RecordingBundle.class, id);

            if (bundle != null) {
                bundle.setIs_active(0);
                session.update(bundle);
                transaction.commit();

                out.print(gson.toJson(new Response(true, "Bundle deleted successfully")));
            } else {
                out.print(gson.toJson(new Response(false, "Bundle not found")));
            }
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            out.print(gson.toJson(new Response(false, "Error deleting bundle: " + e.getMessage())));
        }
    }

    private void addRecordingToBundle(HttpServletRequest request, PrintWriter out) {
        Transaction transaction = null;

        try {
            Session session = HibernateUtil.getSessionFactory().openSession();

            String bundleId = request.getParameter("bundle_id");
            String recordingId = request.getParameter("recording_id");

            if (bundleId == null || bundleId.isEmpty() || recordingId == null || recordingId.isEmpty()) {
                out.print(gson.toJson(new Response(false, "Bundle ID and Recording ID are required")));
                return;
            }

            transaction = session.beginTransaction();

            // Check if the recording is already in the bundle
            BundleRecordingId id = new BundleRecordingId(Integer.parseInt(bundleId), Integer.parseInt(recordingId));
            BundleRecording existing = (BundleRecording) session.get(BundleRecording.class, id);

            if (existing != null) {
                out.print(gson.toJson(new Response(false, "Recording already in bundle")));
                return;
            }

            RecordingBundle bundle = (RecordingBundle) session.get(RecordingBundle.class, Integer.parseInt(bundleId));
            Recordings recording = (Recordings) session.get(Recordings.class, Integer.parseInt(recordingId));

            if (bundle != null && recording != null) {
                BundleRecording bundleRecording = new BundleRecording();
                bundleRecording.setId(id);
                bundleRecording.setBundle(bundle);
                bundleRecording.setRecording(recording);
                session.save(bundleRecording);

                transaction.commit();
                out.print(gson.toJson(new Response(true, "Recording added to bundle successfully")));
            } else {
                out.print(gson.toJson(new Response(false, "Bundle or Recording not found")));
                transaction.rollback();
            }

        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            out.print(gson.toJson(new Response(false, "Error adding recording to bundle: " + e.getMessage())));
        }
    }

    private void removeRecordingFromBundle(HttpServletRequest request, PrintWriter out) {
        Transaction transaction = null;

        try {
            Session session = HibernateUtil.getSessionFactory().openSession();

            String bundleId = request.getParameter("bundle_id");
            String recordingId = request.getParameter("recording_id");

            if (bundleId == null || bundleId.isEmpty() || recordingId == null || recordingId.isEmpty()) {
                out.print(gson.toJson(new Response(false, "Bundle ID and Recording ID are required")));
                return;
            }

            transaction = session.beginTransaction();

            BundleRecordingId id = new BundleRecordingId(Integer.parseInt(bundleId), Integer.parseInt(recordingId));
            BundleRecording bundleRecording = (BundleRecording) session.get(BundleRecording.class, id);

            if (bundleRecording != null) {
                session.delete(bundleRecording);
                transaction.commit();
                out.print(gson.toJson(new Response(true, "Recording removed from bundle successfully")));
            } else {
                out.print(gson.toJson(new Response(false, "Recording not found in bundle")));
            }

        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            out.print(gson.toJson(new Response(false, "Error removing recording from bundle: " + e.getMessage())));
        }
    }

    private void getBundleLessons(HttpServletRequest request, PrintWriter out) {
        String bundleIdParam = request.getParameter("bundle_id");
        if (bundleIdParam == null || bundleIdParam.isEmpty()) {
            out.print(gson.toJson(new Response(false, "Bundle ID parameter is required")));
            return;
        }

        try {
            Session session = HibernateUtil.getSessionFactory().openSession();
            int bundleId = Integer.parseInt(bundleIdParam);

            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<BundleLesson> cq = cb.createQuery(BundleLesson.class);
            Root<BundleLesson> root = cq.from(BundleLesson.class);

            cq.where(cb.and(
                cb.equal(root.get("bundleId"), bundleId),
                cb.equal(root.get("isActive"), 1)
            ));
            cq.orderBy(cb.asc(root.get("displayOrder")));

            Query<BundleLesson> query = session.createQuery(cq);
            List<BundleLesson> lessons = query.getResultList();

            out.print(gson.toJson(new Response(true, "Lessons found", lessons)));

        } catch (Exception e) {
            out.print(gson.toJson(new Response(false, "Error fetching bundle lessons: " + e.getMessage())));
        }
    }

    private void addLessonToBundle(HttpServletRequest request, PrintWriter out) {
        Transaction transaction = null;

        try {
            Session session = HibernateUtil.getSessionFactory().openSession();

            String bundleId = request.getParameter("bundle_id");
            String title = request.getParameter("title");
            String description = request.getParameter("description");
            String youtubeUrl = request.getParameter("youtube_url");
            String thumbnailUrl = request.getParameter("thumbnail_url");

            if (bundleId == null || bundleId.isEmpty() || youtubeUrl == null || youtubeUrl.isEmpty()) {
                out.print(gson.toJson(new Response(false, "Bundle ID and YouTube URL are required")));
                return;
            }

            transaction = session.beginTransaction();

            RecordingBundle bundle = (RecordingBundle) session.get(RecordingBundle.class, Integer.parseInt(bundleId));

            if (bundle != null) {
                BundleLesson lesson = new BundleLesson();
                lesson.setBundleId(Integer.parseInt(bundleId));
                lesson.setBundle(bundle);
                lesson.setTitle(title != null ? title : "");
                lesson.setDescription(description != null ? description : "");
                lesson.setYoutubeUrl(youtubeUrl);
                lesson.setThumbnailUrl(thumbnailUrl);
                lesson.setDisplayOrder(0);
                lesson.setIsActive(1);
                session.save(lesson);

                transaction.commit();
                out.print(gson.toJson(new Response(true, "Lesson added to bundle successfully")));
            } else {
                out.print(gson.toJson(new Response(false, "Bundle not found")));
                transaction.rollback();
            }

        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            out.print(gson.toJson(new Response(false, "Error adding lesson to bundle: " + e.getMessage())));
        }
    }

    private void removeLessonFromBundle(HttpServletRequest request, PrintWriter out) {
        Transaction transaction = null;

        try {
            Session session = HibernateUtil.getSessionFactory().openSession();

            String lessonId = request.getParameter("lesson_id");

            if (lessonId == null || lessonId.isEmpty()) {
                out.print(gson.toJson(new Response(false, "Lesson ID parameter is required")));
                return;
            }

            transaction = session.beginTransaction();

            BundleLesson lesson = (BundleLesson) session.get(BundleLesson.class, Integer.parseInt(lessonId));

            if (lesson != null) {
                session.delete(lesson);
                transaction.commit();
                out.print(gson.toJson(new Response(true, "Lesson removed from bundle successfully")));
            } else {
                out.print(gson.toJson(new Response(false, "Lesson not found")));
            }

        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            out.print(gson.toJson(new Response(false, "Error removing lesson from bundle: " + e.getMessage())));
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    class Response {
        @com.google.gson.annotations.Expose
        private boolean success;
        @com.google.gson.annotations.Expose
        private String message;
        @com.google.gson.annotations.Expose
        private Object data;

        public Response(boolean success, String message) {
            this.success = success;
            this.message = message;
        }

        public Response(boolean success, String message, Object data) {
            this.success = success;
            this.message = message;
            this.data = data;
        }

        public boolean isSuccess() {
            return success;
        }

        public String getMessage() {
            return message;
        }

        public Object getData() {
            return data;
        }
    }
}
