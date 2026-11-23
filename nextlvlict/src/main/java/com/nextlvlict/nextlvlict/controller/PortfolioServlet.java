package com.nextlvlict.nextlvlict.controller;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.nextlvlict.nextlvlict.hibernate.*;
import com.nextlvlict.nextlvlict.util.AuthorizationUtil;
import com.nextlvlict.nextlvlict.util.YouTubeUtil;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.query.Query;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.Type;
import java.util.*;

@WebServlet(name = "PortfolioServlet", urlPatterns = {"/PortfolioServlet"})

public class PortfolioServlet extends HttpServlet {

    private Gson gson = new Gson();

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String action = request.getParameter("action");

        try (PrintWriter out = response.getWriter()) {
            switch (action) {
                case "getAllData":
                    getAllPortfolioData(out);
                    break;
                case "getTestimonials":
                    getTestimonials(out);
                    break;
                case "getEvents":
                    getEvents(out);
                    break;
                case "getOLTimetable":
                    getOLTimetable(out);
                    break;
                case "getALTimetable":
                    getALTimetable(out);
                    break;
                case "saveTestimonials":
                    saveTestimonials(request, out);
                    break;
                case "saveEvents":
                    saveEvents(request, out);
                    break;
                case "saveOLTimetable":
                    saveOLTimetable(request, out);
                    break;
                case "saveALTimetable":
                    saveALTimetable(request, out);
                    break;
                case "uploadImage":
                    uploadImage(request, out);
                    break;
                case "getFreeLessons":
                    getFreeLessons(out);
                    break;
                case "saveFreeLessons":
                    saveFreeLessons(request, out);
                    break;
                case "deleteFreeLesson":
                    deleteFreeLesson(request, out);
                    break;
                case "updateFreeLesson":
                    updateFreeLesson(request, out);
                    break;
                default:
                    out.write("{\"error\": \"Invalid action\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void getAllPortfolioData(PrintWriter out) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        try {
            PortfolioData data = new PortfolioData();

            // Debug: Test database connection
            System.out.println("DEBUG: Starting getAllPortfolioData...");
            System.out.println("DEBUG: Session is open: " + session.isOpen());

            // Get testimonials
            System.out.println("DEBUG: Getting testimonials...");
            List<TestimonialDTO> testimonials = getAllTestimonials(session);
            System.out.println("DEBUG: Retrieved " + testimonials.size() + " testimonials");
            data.setTestimonials(testimonials);

            // Get events
            System.out.println("DEBUG: Getting events...");
            List<EventDTO> events = getAllEvents(session);
            System.out.println("DEBUG: Retrieved " + events.size() + " events");
            data.setEvents(events);

            // Get O/L timetable
            System.out.println("DEBUG: Getting O/L timetable...");
            List<OLTimetableDTO> olTimetable = getAllOLTimetable(session);
            System.out.println("DEBUG: Retrieved " + olTimetable.size() + " O/L timetable branches");
            data.setOlTimetable(olTimetable);

            // Get A/L timetable
            System.out.println("DEBUG: Getting A/L timetable...");
            List<ALTimetableDTO> alTimetable = getAllALTimetable(session);
            System.out.println("DEBUG: Retrieved " + alTimetable.size() + " A/L timetable entries");
            data.setAlTimetable(alTimetable);

            // Debug the final JSON
            String json = gson.toJson(data);
            System.out.println("DEBUG: JSON response length: " + json.length());
            System.out.println("DEBUG: JSON response: " + json.substring(0, Math.min(200, json.length())));

            out.write(json);

        } catch (Exception e) {
            System.out.println("ERROR in getAllPortfolioData: " + e.getMessage());
            e.printStackTrace();
            out.write("{\"error\": \"Error retrieving portfolio data: " + e.getMessage().replace("\"", "'") + "\"}");
        } finally {
            session.close();
        }
    }

    private List<TestimonialDTO> getAllTestimonials(Session session) {
        try {
            System.out.println("DEBUG: Starting getAllTestimonials query...");

            Query<PortfolioTestimonial> query = session.createQuery(
                    "FROM PortfolioTestimonial WHERE isActive = true ORDER BY displayOrder",
                    PortfolioTestimonial.class
            );
            List<PortfolioTestimonial> testimonials = query.list();
            System.out.println("DEBUG: Found " + testimonials.size() + " testimonials in database");

            List<TestimonialDTO> dtos = new ArrayList<>();
            for (PortfolioTestimonial t : testimonials) {
                TestimonialDTO dto = new TestimonialDTO();
                dto.setId(t.getId());
                dto.setName(t.getName());
                dto.setRole(t.getRole());
                dto.setImage(t.getImage());
                dto.setText(t.getText());
                dtos.add(dto);
            }
            return dtos;
        } catch (Exception e) {
            System.out.println("ERROR in getAllTestimonials: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    private List<EventDTO> getAllEvents(Session session) {
        try {
            System.out.println("DEBUG: Starting getAllEvents query...");

            // First check if the table exists
            try {
                Query<?> testQuery = session.createNativeQuery("SELECT 1 FROM portfolio_events LIMIT 1");
                testQuery.getResultList();
                System.out.println("DEBUG: portfolio_events table exists");
            } catch (Exception e) {
                System.out.println("ERROR: portfolio_events table doesn't exist or has issues: " + e.getMessage());
                return new ArrayList<>();
            }

            Query<PortfolioEvent> query = session.createQuery(
                    "FROM PortfolioEvent WHERE isActive = true ORDER BY displayOrder",
                    PortfolioEvent.class
            );
            List<PortfolioEvent> events = query.list();
            System.out.println("DEBUG: Found " + events.size() + " events in database");

            List<EventDTO> dtos = new ArrayList<>();
            for (PortfolioEvent e : events) {
                EventDTO dto = new EventDTO();
                dto.setId(e.getId());
                dto.setTitle(e.getTitle());
                dto.setDescription(e.getDescription());
                dto.setImage(e.getImage());
                dto.setDate(e.getDate());
                dto.setLocation(e.getLocation());
                dto.setFullDescription(e.getFullDescription());
                dto.setFee(e.getFee());
                dtos.add(dto);
            }
            return dtos;
        } catch (Exception e) {
            System.out.println("ERROR in getAllEvents: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>(); // Return empty list instead of crashing
        }
    }

    private List<OLTimetableDTO> getAllOLTimetable(Session session) {
        Query<OLTimetable> query = session.createQuery(
                "FROM OLTimetable WHERE isActive = true ORDER BY branch, grade, displayOrder",
                OLTimetable.class
        );
        List<OLTimetable> timetables = query.list();
        return groupOLTimetableByBranch(timetables);
    }

    private List<ALTimetableDTO> getAllALTimetable(Session session) {
        Query<ALTimetable> query = session.createQuery(
                "FROM ALTimetable WHERE isActive = true ORDER BY displayOrder",
                ALTimetable.class
        );
        List<ALTimetable> timetables = query.list();

        List<ALTimetableDTO> dtos = new ArrayList<>();
        for (ALTimetable a : timetables) {
            ALTimetableDTO dto = new ALTimetableDTO();
            dto.setId(a.getId());
            dto.setBranch(a.getBranch());
            dto.setYear(a.getYear());
            dto.setType(a.getClassType());
            dto.setTime(a.getTime());
            dtos.add(dto);
        }
        return dtos;
    }

    private List<OLTimetableDTO> groupOLTimetableByBranch(List<OLTimetable> timetables) {
        Map<String, OLTimetableDTO> branchMap = new LinkedHashMap<>();

        for (OLTimetable item : timetables) {
            if (!branchMap.containsKey(item.getBranch())) {
                OLTimetableDTO dto = new OLTimetableDTO();
                dto.setBranch(item.getBranch());
                dto.setGrade10(new ArrayList<>());
                dto.setGrade11(new ArrayList<>());
                branchMap.put(item.getBranch(), dto);
            }

            TimetableItemDTO itemDTO = new TimetableItemDTO();
            itemDTO.setLocation(item.getLocation());
            itemDTO.setGrade("Grade " + item.getGrade());
            itemDTO.setTime(item.getTime());
            itemDTO.setGroup(item.getClassGroup());

            if ("10".equals(item.getGrade())) {
                branchMap.get(item.getBranch()).getGrade10().add(itemDTO);
            } else if ("11".equals(item.getGrade())) {
                branchMap.get(item.getBranch()).getGrade11().add(itemDTO);
            }
        }

        return new ArrayList<>(branchMap.values());
    }

    // Individual GET methods
    private void getTestimonials(PrintWriter out) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        try {
            List<TestimonialDTO> testimonials = getAllTestimonials(session);
            out.write(gson.toJson(testimonials));
        } catch (Exception e) {
            e.printStackTrace();
            out.write("{\"error\": \"Error retrieving testimonials\"}");
        } finally {
            session.close();
        }
    }

    private void getEvents(PrintWriter out) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        try {
            List<EventDTO> events = getAllEvents(session);
            out.write(gson.toJson(events));
        } catch (Exception e) {
            e.printStackTrace();
            out.write("{\"error\": \"Error retrieving events\"}");
        } finally {
            session.close();
        }
    }

    private void getOLTimetable(PrintWriter out) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        try {
            List<OLTimetableDTO> timetable = getAllOLTimetable(session);
            out.write(gson.toJson(timetable));
        } catch (Exception e) {
            e.printStackTrace();
            out.write("{\"error\": \"Error retrieving O/L timetable\"}");
        } finally {
            session.close();
        }
    }

    private void getALTimetable(PrintWriter out) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        try {
            List<ALTimetableDTO> timetable = getAllALTimetable(session);
            out.write(gson.toJson(timetable));
        } catch (Exception e) {
            e.printStackTrace();
            out.write("{\"error\": \"Error retrieving A/L timetable\"}");
        } finally {
            session.close();
        }
    }

    // Save methods
    private void saveTestimonials(HttpServletRequest request, PrintWriter out) {
        Transaction transaction = null;
        Session session = HibernateUtil.getSessionFactory().openSession();
        try {
            String testimonialsJson = request.getParameter("testimonials");
            Type listType = new TypeToken<List<TestimonialDTO>>() {
            }.getType();
            List<TestimonialDTO> testimonialDTOs = gson.fromJson(testimonialsJson, listType);

            transaction = session.beginTransaction();

            // Clear existing testimonials
            Query<?> deleteQuery = session.createQuery("DELETE FROM PortfolioTestimonial");
            deleteQuery.executeUpdate();

            // Save new testimonials
            for (int i = 0; i < testimonialDTOs.size(); i++) {
                TestimonialDTO dto = testimonialDTOs.get(i);
                PortfolioTestimonial testimonial = new PortfolioTestimonial();
                testimonial.setName(dto.getName());
                testimonial.setRole(dto.getRole());
                testimonial.setImage(dto.getImage());
                testimonial.setText(dto.getText());
                testimonial.setDisplayOrder(i);
                testimonial.setActive(true);
                testimonial.setCreatedAt(new Date());
                testimonial.setUpdatedAt(new Date());
                session.save(testimonial);
            }

            transaction.commit();
            out.write("{\"success\": true, \"message\": \"Testimonials saved successfully\"}");
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            out.write("{\"success\": false, \"error\": \"" + e.getMessage() + "\"}");
        } finally {
            session.close();
        }
    }

    private void saveEvents(HttpServletRequest request, PrintWriter out) {
        Transaction transaction = null;
        Session session = HibernateUtil.getSessionFactory().openSession();
        try {
            String eventsJson = request.getParameter("events");
            Type listType = new TypeToken<List<EventDTO>>() {
            }.getType();
            List<EventDTO> eventDTOs = gson.fromJson(eventsJson, listType);

            transaction = session.beginTransaction();

            // Clear existing events
            Query<?> deleteQuery = session.createQuery("DELETE FROM PortfolioEvent");
            deleteQuery.executeUpdate();

            // Save new events and track ID mapping
            Map<Integer, Integer> idMapping = new HashMap<>();
            for (int i = 0; i < eventDTOs.size(); i++) {
                EventDTO dto = eventDTOs.get(i);
                PortfolioEvent event = new PortfolioEvent();
                event.setTitle(dto.getTitle());
                event.setDescription(dto.getDescription());
                event.setImage(dto.getImage());
                event.setDate(dto.getDate());
                event.setLocation(dto.getLocation());
                event.setFullDescription(dto.getFullDescription());
                event.setFee(dto.getFee());
                event.setDisplayOrder(i);
                event.setActive(true);
                event.setCreatedAt(new Date());
                event.setUpdatedAt(new Date());
                session.save(event);
                // Map old ID to new database-generated ID
                idMapping.put(dto.getId(), event.getId());
            }

            transaction.commit();

            // Return the ID mapping so frontend can update its references
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Events saved successfully");
            response.put("idMapping", idMapping);
            out.write(gson.toJson(response));
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            out.write("{\"success\": false, \"error\": \"" + e.getMessage() + "\"}");
        } finally {
            session.close();
        }
    }

    private void saveOLTimetable(HttpServletRequest request, PrintWriter out) {
        Transaction transaction = null;
        Session session = HibernateUtil.getSessionFactory().openSession();
        try {
            String timetableData = request.getParameter("timetableData");
            Type listType = new TypeToken<List<OLTimetableDTO>>() {
            }.getType();
            List<OLTimetableDTO> timetableDTOs = gson.fromJson(timetableData, listType);

            transaction = session.beginTransaction();

            // Clear existing timetable
            Query<?> deleteQuery = session.createQuery("DELETE FROM OLTimetable");
            deleteQuery.executeUpdate();

            int displayOrder = 0;

            // Save new timetable data
            for (OLTimetableDTO branchDTO : timetableDTOs) {
                // Save Grade 10 classes
                if (branchDTO.getGrade10() != null) {
                    for (TimetableItemDTO itemDTO : branchDTO.getGrade10()) {
                        OLTimetable timetable = new OLTimetable();
                        timetable.setBranch(branchDTO.getBranch());
                        timetable.setGrade("10");
                        timetable.setLocation(itemDTO.getLocation());
                        timetable.setTime(itemDTO.getTime());
                        timetable.setClassGroup(itemDTO.getGroup());
                        timetable.setDisplayOrder(displayOrder++);
                        timetable.setActive(true);
                        timetable.setCreatedAt(new Date());
                        timetable.setUpdatedAt(new Date());
                        session.save(timetable);
                    }
                }

                // Save Grade 11 classes
                if (branchDTO.getGrade11() != null) {
                    for (TimetableItemDTO itemDTO : branchDTO.getGrade11()) {
                        OLTimetable timetable = new OLTimetable();
                        timetable.setBranch(branchDTO.getBranch());
                        timetable.setGrade("11");
                        timetable.setLocation(itemDTO.getLocation());
                        timetable.setTime(itemDTO.getTime());
                        timetable.setClassGroup(itemDTO.getGroup());
                        timetable.setDisplayOrder(displayOrder++);
                        timetable.setActive(true);
                        timetable.setCreatedAt(new Date());
                        timetable.setUpdatedAt(new Date());
                        session.save(timetable);
                    }
                }
            }

            transaction.commit();
            out.write("{\"success\": true, \"message\": \"O/L timetable saved successfully\"}");
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            out.write("{\"success\": false, \"error\": \"" + e.getMessage() + "\"}");
        } finally {
            session.close();
        }
    }

    private void saveALTimetable(HttpServletRequest request, PrintWriter out) {
        Transaction transaction = null;
        Session session = HibernateUtil.getSessionFactory().openSession();
        try {
            String timetableData = request.getParameter("timetableData");
            Type listType = new TypeToken<List<ALTimetableDTO>>() {
            }.getType();
            List<ALTimetableDTO> timetableDTOs = gson.fromJson(timetableData, listType);

            transaction = session.beginTransaction();

            // Clear existing timetable
            Query<?> deleteQuery = session.createQuery("DELETE FROM ALTimetable");
            deleteQuery.executeUpdate();

            // Save new timetable data
            for (int i = 0; i < timetableDTOs.size(); i++) {
                ALTimetableDTO dto = timetableDTOs.get(i);
                ALTimetable timetable = new ALTimetable();
                timetable.setBranch(dto.getBranch());
                timetable.setYear(dto.getYear());
                timetable.setClassType(dto.getType());
                timetable.setTime(dto.getTime());
                timetable.setDisplayOrder(i);
                timetable.setActive(true);
                timetable.setCreatedAt(new Date());
                timetable.setUpdatedAt(new Date());
                session.save(timetable);
            }

            transaction.commit();
            out.write("{\"success\": true, \"message\": \"A/L timetable saved successfully\"}");
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            out.write("{\"success\": false, \"error\": \"" + e.getMessage() + "\"}");
        } finally {
            session.close();
        }
    }

    private void uploadImage(HttpServletRequest request, PrintWriter out) {
        try {
            out.write("{\"success\": true, \"url\": \"https://placehold.co/400x300/3c6299/FFFFFF?text=Uploaded+Image\"}");
        } catch (Exception e) {
            e.printStackTrace();
            out.write("{\"success\": false, \"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // Free Lessons methods
    
    private void getFreeLessons(PrintWriter out) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        try {
            Query<FreeLesson> query = session.createQuery(
                    "FROM FreeLesson WHERE isActive = true ORDER BY displayOrder ASC",
                    FreeLesson.class
            );
            List<FreeLesson> lessons = query.list();
            
            List<FreeLessonDTO> dtos = new ArrayList<>();
            for (FreeLesson lesson : lessons) {
                FreeLessonDTO dto = new FreeLessonDTO();
                dto.setId(lesson.getId());
                dto.setUnitLabel(lesson.getUnitLabel());
                dto.setTitle(lesson.getTitle());
                dto.setYoutubeUrl(lesson.getYoutubeUrl());
                dto.setDisplayOrder(lesson.getDisplayOrder());
                dtos.add(dto);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("lessons", dtos);
            out.write(gson.toJson(response));
        } catch (Exception e) {
            e.printStackTrace();
            out.write("{\"success\": false, \"error\": \"Error retrieving free lessons\"}");
        } finally {
            session.close();
        }
    }

    private void saveFreeLessons(HttpServletRequest request, PrintWriter out) {
        if (!AuthorizationUtil.isAdminAuthenticated(request)) {
            out.write("{\"success\": false, \"message\": \"Admin authentication required\"}");
            return;
        }

        Transaction transaction = null;
        Session session = HibernateUtil.getSessionFactory().openSession();
        try {
            String lessonsJson = request.getParameter("lessons");
            Type listType = new TypeToken<List<FreeLessonDTO>>() {}.getType();
            List<FreeLessonDTO> lessonDTOs = gson.fromJson(lessonsJson, listType);

            // Validate each lesson
            for (FreeLessonDTO dto : lessonDTOs) {
                String validationError = validateFreeLessonDTO(dto);
                if (validationError != null) {
                    out.write("{\"success\": false, \"error\": \"" + validationError + "\"}");
                    return;
                }
            }

            transaction = session.beginTransaction();

            // Clear existing lessons
            Query<?> deleteQuery = session.createQuery("DELETE FROM FreeLesson");
            deleteQuery.executeUpdate();

            // Save new lessons
            for (int i = 0; i < lessonDTOs.size(); i++) {
                FreeLessonDTO dto = lessonDTOs.get(i);
                FreeLesson lesson = new FreeLesson();
                lesson.setUnitLabel(dto.getUnitLabel());
                lesson.setTitle(dto.getTitle());
                lesson.setYoutubeUrl(YouTubeUtil.normalizeUrl(dto.getYoutubeUrl()));
                lesson.setDisplayOrder(dto.getDisplayOrder());
                lesson.setActive(true);
                lesson.setCreatedAt(new Date());
                lesson.setUpdatedAt(new Date());
                session.save(lesson);
            }

            transaction.commit();
            out.write("{\"success\": true, \"message\": \"Free lessons saved successfully\"}");
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            out.write("{\"success\": false, \"error\": \"" + e.getMessage() + "\"}");
        } finally {
            session.close();
        }
    }

    private void deleteFreeLesson(HttpServletRequest request, PrintWriter out) {
        if (!AuthorizationUtil.isAdminAuthenticated(request)) {
            out.write("{\"success\": false, \"message\": \"Admin authentication required\"}");
            return;
        }

        Transaction transaction = null;
        Session session = HibernateUtil.getSessionFactory().openSession();
        try {
            String idParam = request.getParameter("id");
            if (idParam == null || idParam.isEmpty()) {
                out.write("{\"success\": false, \"error\": \"Lesson ID is required\"}");
                return;
            }

            int id = Integer.parseInt(idParam);
            
            transaction = session.beginTransaction();
            
            FreeLesson lesson = session.get(FreeLesson.class, id);
            if (lesson == null) {
                out.write("{\"success\": false, \"error\": \"Free lesson not found\"}");
                return;
            }

            session.delete(lesson);
            transaction.commit();
            
            out.write("{\"success\": true, \"message\": \"Free lesson deleted successfully\"}");
        } catch (NumberFormatException e) {
            out.write("{\"success\": false, \"error\": \"Invalid lesson ID\"}");
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            out.write("{\"success\": false, \"error\": \"" + e.getMessage() + "\"}");
        } finally {
            session.close();
        }
    }

    private void updateFreeLesson(HttpServletRequest request, PrintWriter out) {
        if (!AuthorizationUtil.isAdminAuthenticated(request)) {
            out.write("{\"success\": false, \"message\": \"Admin authentication required\"}");
            return;
        }

        Transaction transaction = null;
        Session session = HibernateUtil.getSessionFactory().openSession();
        try {
            String lessonJson = request.getParameter("lesson");
            FreeLessonDTO dto = gson.fromJson(lessonJson, FreeLessonDTO.class);

            String validationError = validateFreeLessonDTO(dto);
            if (validationError != null) {
                out.write("{\"success\": false, \"error\": \"" + validationError + "\"}");
                return;
            }

            transaction = session.beginTransaction();
            
            FreeLesson lesson = session.get(FreeLesson.class, dto.getId());
            if (lesson == null) {
                out.write("{\"success\": false, \"error\": \"Free lesson not found\"}");
                return;
            }

            lesson.setUnitLabel(dto.getUnitLabel());
            lesson.setTitle(dto.getTitle());
            lesson.setYoutubeUrl(YouTubeUtil.normalizeUrl(dto.getYoutubeUrl()));
            lesson.setDisplayOrder(dto.getDisplayOrder());
            lesson.setUpdatedAt(new Date());

            session.update(lesson);
            transaction.commit();

            FreeLessonDTO responseDto = new FreeLessonDTO();
            responseDto.setId(lesson.getId());
            responseDto.setUnitLabel(lesson.getUnitLabel());
            responseDto.setTitle(lesson.getTitle());
            responseDto.setYoutubeUrl(lesson.getYoutubeUrl());
            responseDto.setDisplayOrder(lesson.getDisplayOrder());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("lesson", responseDto);
            out.write(gson.toJson(response));
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            out.write("{\"success\": false, \"error\": \"" + e.getMessage() + "\"}");
        } finally {
            session.close();
        }
    }

    private String validateFreeLessonDTO(FreeLessonDTO dto) {
        if (dto.getUnitLabel() == null || dto.getUnitLabel().trim().isEmpty()) {
            return "Unit label is required";
        }
        if (dto.getUnitLabel().length() > 100) {
            return "Unit label must not exceed 100 characters";
        }
        if (dto.getTitle() == null || dto.getTitle().trim().isEmpty()) {
            return "Title is required";
        }
        if (dto.getTitle().length() > 255) {
            return "Title must not exceed 255 characters";
        }
        if (dto.getYoutubeUrl() == null || dto.getYoutubeUrl().trim().isEmpty()) {
            return "YouTube URL is required";
        }
        YouTubeUtil.ValidationResult urlValidation = YouTubeUtil.validate(dto.getYoutubeUrl());
        if (!urlValidation.isValid()) {
            return urlValidation.getMessage();
        }
        if (dto.getDisplayOrder() <= 0) {
            return "Display order must be a positive integer";
        }
        return null;
    }

    // DTO Classes
    public static class TestimonialDTO {

        private int id;
        private String name;
        private String role;
        private String image;
        private String text;

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public String getImage() {
            return image;
        }

        public void setImage(String image) {
            this.image = image;
        }

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }
    }

    public static class EventDTO {

        private int id;
        private String title;
        private String description;
        private String image;
        private String date;
        private String location;
        private String fullDescription;
        private String fee;

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getImage() {
            return image;
        }

        public void setImage(String image) {
            this.image = image;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
        }

        public String getFullDescription() {
            return fullDescription;
        }

        public void setFullDescription(String fullDescription) {
            this.fullDescription = fullDescription;
        }

        public String getFee() {
            return fee;
        }

        public void setFee(String fee) {
            this.fee = fee;
        }
    }

    public static class OLTimetableDTO {

        private String branch;
        private List<TimetableItemDTO> grade10;
        private List<TimetableItemDTO> grade11;

        public String getBranch() {
            return branch;
        }

        public void setBranch(String branch) {
            this.branch = branch;
        }

        public List<TimetableItemDTO> getGrade10() {
            return grade10;
        }

        public void setGrade10(List<TimetableItemDTO> grade10) {
            this.grade10 = grade10;
        }

        public List<TimetableItemDTO> getGrade11() {
            return grade11;
        }

        public void setGrade11(List<TimetableItemDTO> grade11) {
            this.grade11 = grade11;
        }
    }

    public static class ALTimetableDTO {

        private int id;
        private String branch;
        private String year;
        private String type;
        private String time;

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }

        public String getBranch() {
            return branch;
        }

        public void setBranch(String branch) {
            this.branch = branch;
        }

        public String getYear() {
            return year;
        }

        public void setYear(String year) {
            this.year = year;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getTime() {
            return time;
        }

        public void setTime(String time) {
            this.time = time;
        }
    }

    public static class TimetableItemDTO {

        private String location;
        private String grade;
        private String time;
        private String group;

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
        }

        public String getGrade() {
            return grade;
        }

        public void setGrade(String grade) {
            this.grade = grade;
        }

        public String getTime() {
            return time;
        }

        public void setTime(String time) {
            this.time = time;
        }

        public String getGroup() {
            return group;
        }

        public void setGroup(String group) {
            this.group = group;
        }
    }

    public static class FreeLessonDTO {

        private int id;
        private String unitLabel;
        private String title;
        private String youtubeUrl;
        private int displayOrder;

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }

        public String getUnitLabel() {
            return unitLabel;
        }

        public void setUnitLabel(String unitLabel) {
            this.unitLabel = unitLabel;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getYoutubeUrl() {
            return youtubeUrl;
        }

        public void setYoutubeUrl(String youtubeUrl) {
            this.youtubeUrl = youtubeUrl;
        }

        public int getDisplayOrder() {
            return displayOrder;
        }

        public void setDisplayOrder(int displayOrder) {
            this.displayOrder = displayOrder;
        }
    }

    public static class PortfolioData {

        private List<TestimonialDTO> testimonials;
        private List<EventDTO> events;
        private List<OLTimetableDTO> olTimetable;
        private List<ALTimetableDTO> alTimetable;

        public List<TestimonialDTO> getTestimonials() {
            return testimonials;
        }

        public void setTestimonials(List<TestimonialDTO> testimonials) {
            this.testimonials = testimonials;
        }

        public List<EventDTO> getEvents() {
            return events;
        }

        public void setEvents(List<EventDTO> events) {
            this.events = events;
        }

        public List<OLTimetableDTO> getOlTimetable() {
            return olTimetable;
        }

        public void setOlTimetable(List<OLTimetableDTO> olTimetable) {
            this.olTimetable = olTimetable;
        }

        public List<ALTimetableDTO> getAlTimetable() {
            return alTimetable;
        }

        public void setAlTimetable(List<ALTimetableDTO> alTimetable) {
            this.alTimetable = alTimetable;
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
}

