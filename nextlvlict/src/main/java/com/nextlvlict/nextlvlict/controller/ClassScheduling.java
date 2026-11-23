package com.nextlvlict.nextlvlict.controller;

import com.nextlvlict.nextlvlict.hibernate.Class_Schedule;
import com.nextlvlict.nextlvlict.hibernate.ClassType;
import com.nextlvlict.nextlvlict.hibernate.Days;
import com.nextlvlict.nextlvlict.hibernate.Grade;
import com.nextlvlict.nextlvlict.hibernate.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.query.Query;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import org.json.JSONArray;
import org.json.JSONObject;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet(name = "ClassScheduling", urlPatterns = {"/ClassScheduling"})
public class ClassScheduling extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        String action = request.getParameter("action");
        
        try (PrintWriter out = response.getWriter()) {
            if ("getAll".equals(action)) {
                getAllClassSchedules(request, out);
            } else if ("save".equals(action)) {
                saveClassSchedule(request, out);
            } else if ("update".equals(action)) {
                updateClassSchedule(request, out);
            } else if ("delete".equals(action)) {
                deleteClassSchedule(request, out);
            } else if ("getDays".equals(action)) {
                getAllDays(out);
            } else if ("getGrades".equals(action)) {
                getAllGrades(out);
            } else if ("getClassTypes".equals(action)) {
                getAllClassTypes(out);
            } else {
                out.write("{\"error\": \"Invalid action\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void getAllClassSchedules(HttpServletRequest request, PrintWriter out) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        try {
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Class_Schedule> cq = cb.createQuery(Class_Schedule.class);
            Root<Class_Schedule> root = cq.from(Class_Schedule.class);
            
            // Build dynamic filters
            java.util.List<jakarta.persistence.criteria.Predicate> predicates = new java.util.ArrayList<>();
            
            // Filter by grade
            String gradeIdStr = request.getParameter("grade_id");
            if (gradeIdStr != null && !gradeIdStr.isEmpty()) {
                predicates.add(cb.equal(root.get("grade").get("id"), Integer.parseInt(gradeIdStr)));
            }
            
            // Filter by class type
            String classTypeIdStr = request.getParameter("class_type_id");
            if (classTypeIdStr != null && !classTypeIdStr.isEmpty()) {
                predicates.add(cb.equal(root.get("classType").get("id"), Integer.parseInt(classTypeIdStr)));
            }
            
            // Filter by day
            String dayIdStr = request.getParameter("day_id");
            if (dayIdStr != null && !dayIdStr.isEmpty()) {
                predicates.add(cb.equal(root.get("days").get("id"), Integer.parseInt(dayIdStr)));
            }
            
            // Filter by status
            String statusStr = request.getParameter("status");
            if (statusStr != null && !statusStr.isEmpty()) {
                predicates.add(cb.equal(root.get("is_active"), Integer.parseInt(statusStr)));
            }
            
            if (!predicates.isEmpty()) {
                cq.where(cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0])));
            }
            
            cq.select(root);

            Query<Class_Schedule> query = session.createQuery(cq);
            List<Class_Schedule> classSchedules = query.getResultList();

            JSONArray jsonArray = new JSONArray();
            for (Class_Schedule cs : classSchedules) {
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("id", cs.getId());
                jsonObject.put("start_time", cs.getStart_time());
                jsonObject.put("end_time", cs.getEnd_time());
                jsonObject.put("grade", cs.getGrade() != null ? cs.getGrade().getName() : "");
                jsonObject.put("gradeId", cs.getGrade() != null ? cs.getGrade().getId() : 0);
                jsonObject.put("day", cs.getDays() != null ? cs.getDays().getName() : "");
                jsonObject.put("dayId", cs.getDays() != null ? cs.getDays().getId() : 0);
                jsonObject.put("classType", cs.getClassType() != null ? cs.getClassType().getName() : "");
                jsonObject.put("classTypeId", cs.getClassType() != null ? cs.getClassType().getId() : 0);
                jsonObject.put("zoomLink", cs.getZoom_link() != null ? cs.getZoom_link() : "");
                jsonObject.put("description", cs.getDescription() != null ? cs.getDescription() : "");
                jsonObject.put("isActive", cs.getIs_active());

                jsonArray.put(jsonObject);
            }

            out.write(jsonArray.toString());
        } catch (Exception e) {
            e.printStackTrace();
            out.write("{\"error\": \"Error retrieving class schedules\"}");
        } finally {
            session.close();
        }
    }

    private void saveClassSchedule(HttpServletRequest request, PrintWriter out) {
        Transaction transaction = null;
        Session session = HibernateUtil.getSessionFactory().openSession();
        try {
            transaction = session.beginTransaction();
            
            Class_Schedule classSchedule = new Class_Schedule();
            classSchedule.setStart_time(request.getParameter("start_time"));
            classSchedule.setEnd_time(request.getParameter("end_time"));
            classSchedule.setZoom_link(request.getParameter("zoomLink"));
            classSchedule.setDescription(request.getParameter("description"));
            
            // Set grade
            String gradeIdStr = request.getParameter("grade_id");
            if (gradeIdStr != null && !gradeIdStr.isEmpty()) {
                int gradeId = Integer.parseInt(gradeIdStr);
                Grade grade = (Grade) session.get(Grade.class, gradeId);
                classSchedule.setGrade(grade);
            }
            
            // Set day
            String dayIdStr = request.getParameter("day_id");
            if (dayIdStr != null && !dayIdStr.isEmpty()) {
                int dayId = Integer.parseInt(dayIdStr);
                Days day = (Days) session.get(Days.class, dayId);
                classSchedule.setDays(day);
            }
            
            // Set class type
            String classTypeIdStr = request.getParameter("class_type_id");
            if (classTypeIdStr != null && !classTypeIdStr.isEmpty()) {
                int classTypeId = Integer.parseInt(classTypeIdStr);
                ClassType classType = (ClassType) session.get(ClassType.class, classTypeId);
                classSchedule.setClassType(classType);
            }
            
            // Validate for duplicate schedules
            if (isDuplicateSchedule(session, classSchedule)) {
                transaction.rollback();
                out.write("{\"error\": \"A schedule with the same grade, class type, day, and time already exists\"}");
                return;
            }
            
            session.save(classSchedule);
            transaction.commit();
            
            out.write("{\"success\": \"Class schedule created successfully\"}");
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            out.write("{\"error\": \"Error creating class schedule: " + e.getMessage() + "\"}");
        } finally {
            session.close();
        }
    }

    private void updateClassSchedule(HttpServletRequest request, PrintWriter out) {
        Transaction transaction = null;
        Session session = HibernateUtil.getSessionFactory().openSession();
        try {
            transaction = session.beginTransaction();
            
            String idStr = request.getParameter("id");
            if (idStr == null || idStr.isEmpty()) {
                out.write("{\"error\": \"ID parameter is required\"}");
                return;
            }
            
            int id = Integer.parseInt(idStr);
            Class_Schedule classSchedule = (Class_Schedule) session.get(Class_Schedule.class, id);
            
            if (classSchedule != null) {
                classSchedule.setStart_time(request.getParameter("start_time"));
                classSchedule.setEnd_time(request.getParameter("end_time"));
                classSchedule.setZoom_link(request.getParameter("zoomLink"));
                classSchedule.setDescription(request.getParameter("description"));
                
                // Set grade
                String gradeIdStr = request.getParameter("grade_id");
                if (gradeIdStr != null && !gradeIdStr.isEmpty()) {
                    int gradeId = Integer.parseInt(gradeIdStr);
                    Grade grade = (Grade) session.get(Grade.class, gradeId);
                    classSchedule.setGrade(grade);
                }
                
                // Set day
                String dayIdStr = request.getParameter("day_id");
                if (dayIdStr != null && !dayIdStr.isEmpty()) {
                    int dayId = Integer.parseInt(dayIdStr);
                    Days day = (Days) session.get(Days.class, dayId);
                    classSchedule.setDays(day);
                }
                
                // Set class type
                String classTypeIdStr = request.getParameter("class_type_id");
                if (classTypeIdStr != null && !classTypeIdStr.isEmpty()) {
                    int classTypeId = Integer.parseInt(classTypeIdStr);
                    ClassType classType = (ClassType) session.get(ClassType.class, classTypeId);
                    classSchedule.setClassType(classType);
                }
                
                // Validate for duplicate schedules (excluding current record)
                if (isDuplicateSchedule(session, classSchedule, id)) {
                    transaction.rollback();
                    out.write("{\"error\": \"A schedule with the same grade, class type, day, and time already exists\"}");
                    return;
                }
                
                classSchedule.setUpdated_at(new java.util.Date());
                
                session.update(classSchedule);
                transaction.commit();
                
                out.write("{\"success\": \"Class schedule updated successfully\"}");
            } else {
                out.write("{\"error\": \"Class schedule not found\"}");
            }
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            out.write("{\"error\": \"Error updating class schedule: " + e.getMessage() + "\"}");
        } finally {
            session.close();
        }
    }

    private void deleteClassSchedule(HttpServletRequest request, PrintWriter out) {
        Transaction transaction = null;
        Session session = HibernateUtil.getSessionFactory().openSession();
        try {
            transaction = session.beginTransaction();
            
            String idStr = request.getParameter("id");
            if (idStr == null || idStr.isEmpty()) {
                out.write("{\"error\": \"ID parameter is required\"}");
                return;
            }
            
            int id = Integer.parseInt(idStr);
            Class_Schedule classSchedule = (Class_Schedule) session.get(Class_Schedule.class, id);
            
            if (classSchedule != null) {
                session.delete(classSchedule);
                transaction.commit();
                
                out.write("{\"success\": \"Class schedule deleted successfully\"}");
            } else {
                out.write("{\"error\": \"Class schedule not found\"}");
            }
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            out.write("{\"error\": \"Error deleting class schedule: " + e.getMessage() + "\"}");
        } finally {
            session.close();
        }
    }

    private void getAllDays(PrintWriter out) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        try {
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Days> cq = cb.createQuery(Days.class);
            Root<Days> root = cq.from(Days.class);
            cq.select(root);

            Query<Days> query = session.createQuery(cq);
            List<Days> days = query.getResultList();

            JSONArray jsonArray = new JSONArray();
            for (Days day : days) {
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("id", day.getId());
                jsonObject.put("name", day.getName());
                jsonArray.put(jsonObject);
            }

            out.write(jsonArray.toString());
        } catch (Exception e) {
            e.printStackTrace();
            out.write("{\"error\": \"Error retrieving days\"}");
        } finally {
            session.close();
        }
    }

    private void getAllGrades(PrintWriter out) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        try {
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Grade> cq = cb.createQuery(Grade.class);
            Root<Grade> root = cq.from(Grade.class);
            cq.select(root);

            Query<Grade> query = session.createQuery(cq);
            List<Grade> grades = query.getResultList();

            JSONArray jsonArray = new JSONArray();
            for (Grade grade : grades) {
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("id", grade.getId());
                jsonObject.put("name", grade.getName());
                jsonObject.put("fee", grade.getFee());
                jsonArray.put(jsonObject);
            }

            out.write(jsonArray.toString());
        } catch (Exception e) {
            e.printStackTrace();
            out.write("{\"error\": \"Error retrieving grades\"}");
        } finally {
            session.close();
        }
    }

    private void getAllClassTypes(PrintWriter out) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        try {
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<ClassType> cq = cb.createQuery(ClassType.class);
            Root<ClassType> root = cq.from(ClassType.class);
            cq.select(root);

            Query<ClassType> query = session.createQuery(cq);
            List<ClassType> classTypes = query.getResultList();

            JSONArray jsonArray = new JSONArray();
            for (ClassType classType : classTypes) {
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("id", classType.getId());
                jsonObject.put("name", classType.getName());
                jsonObject.put("description", classType.getDescription() != null ? classType.getDescription() : "");
                jsonObject.put("isActive", classType.getIsActive());
                jsonArray.put(jsonObject);
            }

            out.write(jsonArray.toString());
        } catch (Exception e) {
            e.printStackTrace();
            out.write("{\"error\": \"Error retrieving class types\"}");
        } finally {
            session.close();
        }
    }

    private boolean isDuplicateSchedule(Session session, Class_Schedule classSchedule) {
        return isDuplicateSchedule(session, classSchedule, null);
    }

    private boolean isDuplicateSchedule(Session session, Class_Schedule classSchedule, Integer excludeId) {
        try {
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Long> cq = cb.createQuery(Long.class);
            Root<Class_Schedule> root = cq.from(Class_Schedule.class);
            
            java.util.List<jakarta.persistence.criteria.Predicate> predicates = new java.util.ArrayList<>();
            
            if (classSchedule.getGrade() != null) {
                predicates.add(cb.equal(root.get("grade").get("id"), classSchedule.getGrade().getId()));
            }
            if (classSchedule.getClassType() != null) {
                predicates.add(cb.equal(root.get("classType").get("id"), classSchedule.getClassType().getId()));
            }
            if (classSchedule.getDays() != null) {
                predicates.add(cb.equal(root.get("days").get("id"), classSchedule.getDays().getId()));
            }
            if (classSchedule.getStart_time() != null) {
                predicates.add(cb.equal(root.get("start_time"), classSchedule.getStart_time()));
            }
            if (classSchedule.getEnd_time() != null) {
                predicates.add(cb.equal(root.get("end_time"), classSchedule.getEnd_time()));
            }
            
            // Exclude current record when updating
            if (excludeId != null) {
                predicates.add(cb.notEqual(root.get("id"), excludeId));
            }
            
            cq.select(cb.count(root));
            cq.where(cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0])));
            
            Long count = session.createQuery(cq).uniqueResult();
            return count != null && count > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
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

    @Override
    public String getServletInfo() {
        return "Class Scheduling Servlet";
    }
}
