package com.nextlvlict.nextlvlict.controller;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.nextlvlict.nextlvlict.hibernate.Class_Schedule;
import com.nextlvlict.nextlvlict.hibernate.ClassType;
import com.nextlvlict.nextlvlict.hibernate.HibernateUtil;
import com.nextlvlict.nextlvlict.hibernate.StudentClass;
import com.nextlvlict.nextlvlict.hibernate.StudentMonthlyFees;
import com.nextlvlict.nextlvlict.hibernate.Students;
import org.hibernate.Session;
import org.hibernate.query.Query;

import java.util.Calendar;

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

@WebServlet(name = "ClassScheduleServlet", urlPatterns = {"/ClassScheduleServlet"})
public class ClassScheduleServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        JsonObject jsonResponse = new JsonObject();
        
        Session session = null;
        
        try {
            // Get student ID from request parameter
            String studentId = request.getParameter("studentId");
            
            if (studentId == null || studentId.trim().isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Student ID is required");
                out.print(jsonResponse.toString());
                return;
            }
            
            session = HibernateUtil.getSessionFactory().openSession();
            
            // Get student information to find their grade
            Students student = (Students) session.get(Students.class, studentId);
            
            if (student == null) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Student not found");
                out.print(jsonResponse.toString());
                return;
            }
            
            if (student.getGrade() == null) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Student is not assigned to any grade");
                out.print(jsonResponse.toString());
                return;
            }
            
            int studentGradeId = student.getGrade().getId();
            
            // Get student's enrolled class types
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<StudentClass> studentClassCq = cb.createQuery(StudentClass.class);
            jakarta.persistence.criteria.Root<StudentClass> studentClassRoot = studentClassCq.from(StudentClass.class);
            studentClassCq.where(cb.and(
                cb.equal(studentClassRoot.get("student").get("id"), studentId),
                cb.equal(studentClassRoot.get("grade").get("id"), studentGradeId),
                cb.equal(studentClassRoot.get("isActive"), 1)
            ));
            
            Query<StudentClass> studentClassQuery = session.createQuery(studentClassCq);
            List<StudentClass> studentClasses = studentClassQuery.getResultList();
            
            // Extract class type IDs from student's enrollments
            java.util.List<Integer> enrolledClassTypeIds = new java.util.ArrayList<>();
            for (StudentClass sc : studentClasses) {
                if (sc.getClassType() != null) {
                    enrolledClassTypeIds.add(sc.getClassType().getId());
                }
            }
            
            // Check if current date is after the 10th of the month
            Calendar now = Calendar.getInstance();
            int currentDay = now.get(Calendar.DAY_OF_MONTH);
            boolean isAfterDueDate = currentDay > 10;

            // If after 10th, check if student has paid current month's fee
            if (isAfterDueDate) {
                String currentMonthYear = String.format("%04d-%02d", now.get(Calendar.YEAR), now.get(Calendar.MONTH) + 1);
                
                String paymentQuery = "FROM StudentMonthlyFees smf "
                        + "WHERE smf.student.id = :studentId AND smf.monthYear = :monthYear "
                        + "AND smf.status.id = 2"; // 2 = PAID
                
                @SuppressWarnings("unchecked")
                List<StudentMonthlyFees> paidFees = session.createQuery(paymentQuery)
                        .setParameter("studentId", studentId)
                        .setParameter("monthYear", currentMonthYear)
                        .list();
                
                // If no paid fees for current month, return empty list
                if (paidFees == null || paidFees.isEmpty()) {
                    System.out.println("Student " + studentId + " has not paid for " + currentMonthYear + " - blocking class schedule");
                    jsonResponse.addProperty("success", true);
                    jsonResponse.add("classSchedules", new JsonArray());
                    jsonResponse.addProperty("paymentRequired", true);
                    jsonResponse.addProperty("message", "Class schedule is hidden until monthly fee is paid");
                    out.print(jsonResponse.toString());
                    out.flush();
                    return;
                }
            }
            
            // Get class schedules for the student's grade and enrolled class types using JPA Criteria
            CriteriaQuery<Class_Schedule> cq = cb.createQuery(Class_Schedule.class);
            Root<Class_Schedule> root = cq.from(Class_Schedule.class);
            Join<Class_Schedule, Object> gradeJoin = root.join("grade");

            // Build predicates
            java.util.List<jakarta.persistence.criteria.Predicate> predicates = new java.util.ArrayList<>();
            predicates.add(cb.equal(root.get("is_active"), 1));
            predicates.add(cb.equal(gradeJoin.get("id"), studentGradeId));
            
            // Filter by enrolled class types if student has any enrollments
            if (!enrolledClassTypeIds.isEmpty()) {
                predicates.add(root.get("classType").get("id").in(enrolledClassTypeIds));
            }

            cq.where(cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0])));

            Query<Class_Schedule> query = session.createQuery(cq);
            List<Class_Schedule> classSchedules = query.getResultList();

            JsonArray classesArray = new JsonArray();
            for (Class_Schedule schedule : classSchedules) {
                JsonObject classJson = new JsonObject();
                classJson.addProperty("id", schedule.getId());
                classJson.addProperty("startTime", schedule.getStart_time());
                classJson.addProperty("endTime", schedule.getEnd_time());
                classJson.addProperty("zoomLink", schedule.getZoom_link());
                classJson.addProperty("description", schedule.getDescription());
                
                // Add grade information
                if (schedule.getGrade() != null) {
                    JsonObject gradeJson = new JsonObject();
                    gradeJson.addProperty("id", schedule.getGrade().getId());
                    gradeJson.addProperty("name", schedule.getGrade().getName());
                    gradeJson.addProperty("fee", schedule.getGrade().getFee());
                    classJson.add("grade", gradeJson);
                }
                
                // Add day information
                if (schedule.getDays() != null) {
                    JsonObject dayJson = new JsonObject();
                    dayJson.addProperty("id", schedule.getDays().getId());
                    dayJson.addProperty("name", schedule.getDays().getName());
                    classJson.add("day", dayJson);
                }
                
                // Add class type information
                if (schedule.getClassType() != null) {
                    JsonObject classTypeJson = new JsonObject();
                    classTypeJson.addProperty("id", schedule.getClassType().getId());
                    classTypeJson.addProperty("name", schedule.getClassType().getName());
                    classTypeJson.addProperty("description", schedule.getClassType().getDescription() != null ? schedule.getClassType().getDescription() : "");
                    classJson.add("classType", classTypeJson);
                }
                
                classesArray.add(classJson);
            }
            
            jsonResponse.addProperty("success", true);
            jsonResponse.add("classSchedules", classesArray);
            
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error fetching class schedules: " + e.getMessage());
        } finally {
            if (session != null && session.isOpen()) {
                session.close();
            }
            out.print(jsonResponse.toString());
            out.flush();
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response);
    }
}
