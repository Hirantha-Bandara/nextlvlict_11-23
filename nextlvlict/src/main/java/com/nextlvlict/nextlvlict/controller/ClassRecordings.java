package com.nextlvlict.nextlvlict.controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.annotations.Expose;
import com.nextlvlict.nextlvlict.hibernate.AccessType;
import com.nextlvlict.nextlvlict.hibernate.Grade;
import com.nextlvlict.nextlvlict.hibernate.HibernateUtil;
import com.nextlvlict.nextlvlict.hibernate.Recordings;
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
import java.util.List;

@WebServlet(name = "ClassRecordings", urlPatterns = {"/ClassRecordings"})
public class ClassRecordings extends HttpServlet {

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
                    getAllRecordings(out);
                    break;
                case "getById":
                    getRecordingById(request, out);
                    break;
                case "save":
                    saveRecording(request, out);
                    break;
                case "update":
                    updateRecording(request, out);
                    break;
                case "delete":
                    deleteRecording(request, out);
                    break;
                case "getByGrade":
                    getRecordingsByGrade(request, out);
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

    private void getAllRecordings(PrintWriter out) {
        try {
            Session session = HibernateUtil.getSessionFactory().openSession();
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Recordings> cq = cb.createQuery(Recordings.class);
            Root<Recordings> root = cq.from(Recordings.class);

            cq.where(cb.equal(root.get("is_active"), 1));
            cq.orderBy(cb.desc(root.get("created_at")));

            Query<Recordings> query = session.createQuery(cq);
            List<Recordings> recordings = query.getResultList();

            if (recordings.isEmpty()) {
                out.print(gson.toJson(new Response(true, "No recordings found", new Recordings[0])));
            } else {
                out.print(gson.toJson(new Response(true, "Recordings found", recordings)));
            }
        } catch (Exception e) {
            out.print(gson.toJson(new Response(false, "Error fetching recordings: " + e.getMessage())));
        }
    }

    private void getRecordingById(HttpServletRequest request, PrintWriter out) {
        String idParam = request.getParameter("id");
        if (idParam == null || idParam.isEmpty()) {
            out.print(gson.toJson(new Response(false, "ID parameter is required")));
            return;
        }

        try {
            Session session = HibernateUtil.getSessionFactory().openSession();
            int id = Integer.parseInt(idParam);
            Recordings recording = (Recordings) session.get(Recordings.class, id);

            if (recording != null && recording.getIs_active() == 1) {
                out.print(gson.toJson(new Response(true, "Recording found", recording)));
            } else {
                out.print(gson.toJson(new Response(false, "Recording not found")));
            }
        } catch (Exception e) {
            out.print(gson.toJson(new Response(false, "Error fetching recording: " + e.getMessage())));
        }
    }

    private void getRecordingsByGrade(HttpServletRequest request, PrintWriter out) {
        String gradeIdParam = request.getParameter("grade_id");
        if (gradeIdParam == null || gradeIdParam.isEmpty()) {
            out.print(gson.toJson(new Response(false, "Grade ID parameter is required")));
            return;
        }

        try {
            Session session = HibernateUtil.getSessionFactory().openSession();
            int gradeId = Integer.parseInt(gradeIdParam);

            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Recordings> cq = cb.createQuery(Recordings.class);
            Root<Recordings> root = cq.from(Recordings.class);
            Join<Recordings, Grade> gradeJoin = root.join("grade");

            cq.where(
                cb.and(
                    cb.equal(gradeJoin.get("id"), gradeId),
                    cb.equal(root.get("is_active"), 1)
                )
            );
            cq.orderBy(cb.desc(root.get("created_at")));

            Query<Recordings> query = session.createQuery(cq);
            List<Recordings> recordings = query.getResultList();

            if (recordings.isEmpty()) {
                out.print(gson.toJson(new Response(true, "No recordings found for this grade", new Recordings[0])));
            } else {
                out.print(gson.toJson(new Response(true, "Recordings found", recordings)));
            }
        } catch (Exception e) {
            out.print(gson.toJson(new Response(false, "Error fetching recordings: " + e.getMessage())));
        }
    }

    private void saveRecording(HttpServletRequest request, PrintWriter out) {
        Transaction transaction = null;

        try {
            Session session = HibernateUtil.getSessionFactory().openSession();

            String title = request.getParameter("title");
            String description = request.getParameter("description");
            String youtubeUrl = request.getParameter("youtube_url");
            String gradeIdsParam = request.getParameter("grade_ids");
            String accessTypeParam = request.getParameter("access_type");
            String priceParam = request.getParameter("price");

            if (title == null || title.isEmpty() || youtubeUrl == null || youtubeUrl.isEmpty() || gradeIdsParam == null || gradeIdsParam.isEmpty()) {
                out.print(gson.toJson(new Response(false, "Title, YouTube URL, and Grades are required")));
                return;
            }

            transaction = session.beginTransaction();

            Recordings recording = new Recordings();
            recording.setTitle(title);
            recording.setDescription(description);
            recording.setYoutube_url(youtubeUrl);

            // Set access type (default to PAID if not specified)
            if (accessTypeParam != null && !accessTypeParam.isEmpty()) {
                try {
                    recording.setAccessType(AccessType.valueOf(accessTypeParam.toUpperCase()));
                } catch (IllegalArgumentException e) {
                    recording.setAccessType(AccessType.PAID); // Default to PAID if invalid
                }
            } else {
                recording.setAccessType(AccessType.PAID); // Default to PAID
            }

            // Set price
            if (priceParam != null && !priceParam.isEmpty()) {
                try {
                    double price = Double.parseDouble(priceParam);
                    recording.setPrice(price);
                } catch (NumberFormatException e) {
                    recording.setPrice(0.0); // Default to 0 if invalid
                }
            } else {
                recording.setPrice(0.0); // Default to 0
            }

            // Parse multiple grade IDs
            String[] gradeIdArray = gradeIdsParam.split(",");
            java.util.Set<Grade> grades = new java.util.HashSet<>();
            Integer firstGradeId = null;

            for (String gradeIdStr : gradeIdArray) {
                try {
                    int gradeId = Integer.parseInt(gradeIdStr.trim());
                    Grade grade = (Grade) session.get(Grade.class, gradeId);
                    if (grade != null) {
                        grades.add(grade);
                        if (firstGradeId == null) {
                            firstGradeId = gradeId;
                        }
                    }
                } catch (NumberFormatException e) {
                    // Skip invalid grade IDs
                }
            }

            if (grades.isEmpty()) {
                out.print(gson.toJson(new Response(false, "No valid grade IDs provided")));
                return;
            }

            // Set the grades collection
            recording.setGrades(grades);

            // Set legacy single grade field for backward compatibility (use first grade)
            if (firstGradeId != null) {
                Grade firstGrade = (Grade) session.get(Grade.class, firstGradeId);
                recording.setGrade(firstGrade);
            }

            session.persist(recording);
            transaction.commit();

            out.print(gson.toJson(new Response(true, "Recording saved successfully")));
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            out.print(gson.toJson(new Response(false, "Error saving recording: " + e.getMessage())));
        }
    }

    private void updateRecording(HttpServletRequest request, PrintWriter out) {
        Transaction transaction = null;

        try {
            Session session = HibernateUtil.getSessionFactory().openSession();

            String recordingId = request.getParameter("id");
            String title = request.getParameter("title");
            String description = request.getParameter("description");
            String youtubeUrl = request.getParameter("youtube_url");
            String gradeIdsParam = request.getParameter("grade_ids");
            String accessTypeParam = request.getParameter("access_type");
            String priceParam = request.getParameter("price");

            if (recordingId == null || recordingId.isEmpty()) {
                out.print(gson.toJson(new Response(false, "ID parameter is required")));
                return;
            }

            transaction = session.beginTransaction();

            int id = Integer.parseInt(recordingId);
            Recordings recording = (Recordings) session.get(Recordings.class, id);

            if (recording != null) {
                recording.setTitle(title != null ? title : recording.getTitle());
                recording.setDescription(description != null ? description : recording.getDescription());
                recording.setYoutube_url(youtubeUrl != null ? youtubeUrl : recording.getYoutube_url());

                // Update access type if provided
                if (accessTypeParam != null && !accessTypeParam.isEmpty()) {
                    try {
                        recording.setAccessType(AccessType.valueOf(accessTypeParam.toUpperCase()));
                    } catch (IllegalArgumentException e) {
                        // Keep existing value if invalid
                    }
                }

                // Update price if provided
                if (priceParam != null && !priceParam.isEmpty()) {
                    try {
                        double price = Double.parseDouble(priceParam);
                        recording.setPrice(price);
                    } catch (NumberFormatException e) {
                        // Keep existing value if invalid
                    }
                }

                // Update grades if provided
                if (gradeIdsParam != null && !gradeIdsParam.isEmpty()) {
                    String[] gradeIdArray = gradeIdsParam.split(",");
                    java.util.Set<Grade> grades = new java.util.HashSet<>();
                    Integer firstGradeId = null;

                    for (String gradeIdStr : gradeIdArray) {
                        try {
                            int gradeId = Integer.parseInt(gradeIdStr.trim());
                            Grade grade = (Grade) session.get(Grade.class, gradeId);
                            if (grade != null) {
                                grades.add(grade);
                                if (firstGradeId == null) {
                                    firstGradeId = gradeId;
                                }
                            }
                        } catch (NumberFormatException e) {
                            // Skip invalid grade IDs
                        }
                    }

                    if (!grades.isEmpty()) {
                        recording.setGrades(grades);
                        // Update legacy single grade field for backward compatibility
                        if (firstGradeId != null) {
                            Grade firstGrade = (Grade) session.get(Grade.class, firstGradeId);
                            recording.setGrade(firstGrade);
                        }
                    }
                }

                session.merge(recording);
                transaction.commit();

                out.print(gson.toJson(new Response(true, "Recording updated successfully")));
            } else {
                out.print(gson.toJson(new Response(false, "Recording not found")));
            }
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            out.print(gson.toJson(new Response(false, "Error updating recording: " + e.getMessage())));
        }
    }

    private void deleteRecording(HttpServletRequest request, PrintWriter out) {
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
            Recordings recording = (Recordings) session.get(Recordings.class, id);

            if (recording != null) {
                recording.setIs_active(0);
                session.update(recording);
                transaction.commit();

                out.print(gson.toJson(new Response(true, "Recording deleted successfully")));
            } else {
                out.print(gson.toJson(new Response(false, "Recording not found")));
            }
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            out.print(gson.toJson(new Response(false, "Error deleting recording: " + e.getMessage())));
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

        @Expose
        private boolean success;
        @Expose
        private String message;
        @Expose
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

