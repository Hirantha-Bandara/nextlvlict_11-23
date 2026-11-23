package com.nextlvlict.nextlvlict.controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.nextlvlict.nextlvlict.hibernate.Class_Schedule;
import com.nextlvlict.nextlvlict.hibernate.HibernateUtil;
import com.nextlvlict.nextlvlict.hibernate.StudentClass;
import com.nextlvlict.nextlvlict.hibernate.StudentMonthlyFees;
import com.nextlvlict.nextlvlict.hibernate.Students;
import org.hibernate.Session;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.*;

@WebServlet(name = "DashboardServlet", urlPatterns = {"/DashboardServlet"})
public class DashboardServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        JsonObject jsonResponse = new JsonObject();

        Session session = null;

        try {
            String studentId = request.getParameter("studentId");

            if (studentId == null || studentId.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Student ID is required");
                out.print(jsonResponse.toString());
                return;
            }

            session = HibernateUtil.getSessionFactory().openSession();

            // Get student information
            Students student = (Students) session.get(Students.class, studentId);
            if (student == null) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Student not found");
                out.print(jsonResponse.toString());
                return;
            }

            // Get student's enrolled class types
            List<Integer> enrolledClassTypeIds = getEnrolledClassTypeIds(session, studentId, student.getGrade().getId());

            // Get dashboard statistics
            Map<String, Object> stats = getDashboardStats(session, studentId, student.getGrade().getId(), enrolledClassTypeIds);

            // Get upcoming classes
            List<Map<String, Object>> upcomingClasses = getUpcomingClasses(session, studentId, student.getGrade().getId(), enrolledClassTypeIds);

            // Get payment status
            Map<String, Object> paymentStatus = getPaymentStatus(session, studentId);

            Gson gson = new Gson();
            jsonResponse.addProperty("success", true);
            jsonResponse.add("student", gson.toJsonTree(getStudentInfo(student)));
            jsonResponse.add("stats", gson.toJsonTree(stats));
            jsonResponse.add("upcomingClasses", gson.toJsonTree(upcomingClasses));
            jsonResponse.add("paymentStatus", gson.toJsonTree(paymentStatus));

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error loading dashboard data: " + e.getMessage());
        } finally {
            if (session != null && session.isOpen()) {
                session.close();
            }
            out.print(jsonResponse.toString());
            out.flush();
        }
    }

    private Map<String, Object> getStudentInfo(Students student) {
        Map<String, Object> studentInfo = new HashMap<>();
        studentInfo.put("id", student.getId());
        studentInfo.put("name", student.getFirst_name() + " " + student.getLast_name());
        studentInfo.put("firstName", student.getFirst_name());
        studentInfo.put("lastName", student.getLast_name());
        studentInfo.put("email", student.getEmail());
        studentInfo.put("mobile", student.getMobile());
        studentInfo.put("school", student.getSchool());
        if (student.getGrade() != null) {
            studentInfo.put("grade", student.getGrade().getName());
            studentInfo.put("gradeId", student.getGrade().getId());
            if (student.getGrade().getOl_or_al() != null) {
                studentInfo.put("olAl", student.getGrade().getOl_or_al().getName());
            }
        }
        if (student.getDate_of_birth() != null) {
            studentInfo.put("dateOfBirth", new SimpleDateFormat("yyyy-MM-dd").format(student.getDate_of_birth()));
        }
        return studentInfo;
    }

    private List<Integer> getEnrolledClassTypeIds(Session session, String studentId, int gradeId) {
        List<Integer> classTypeIds = new ArrayList<>();
        try {
            jakarta.persistence.criteria.CriteriaBuilder cb = session.getCriteriaBuilder();
            jakarta.persistence.criteria.CriteriaQuery<StudentClass> cq = cb.createQuery(StudentClass.class);
            jakarta.persistence.criteria.Root<StudentClass> root = cq.from(StudentClass.class);
            cq.where(cb.and(
                cb.equal(root.get("student").get("id"), studentId),
                cb.equal(root.get("grade").get("id"), gradeId),
                cb.equal(root.get("isActive"), 1)
            ));
            
            List<StudentClass> studentClasses = session.createQuery(cq).getResultList();
            for (StudentClass sc : studentClasses) {
                if (sc.getClassType() != null) {
                    classTypeIds.add(sc.getClassType().getId());
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return classTypeIds;
    }

    private Map<String, Object> getDashboardStats(Session session, String studentId, int gradeId, List<Integer> enrolledClassTypeIds) {
        Map<String, Object> stats = new HashMap<>();

        try {
            // Get upcoming classes count for this grade and enrolled class types
            String upcomingClassesQuery;
            if (enrolledClassTypeIds.isEmpty()) {
                // If no class types enrolled, count all for the grade
                upcomingClassesQuery = "SELECT COUNT(*) FROM Class_Schedule cs "
                        + "WHERE cs.grade.id = :gradeId AND cs.is_active = 1";
            } else {
                // Filter by enrolled class types
                upcomingClassesQuery = "SELECT COUNT(*) FROM Class_Schedule cs "
                        + "WHERE cs.grade.id = :gradeId AND cs.classType.id IN :classTypeIds AND cs.is_active = 1";
            }
            org.hibernate.query.Query<Long> upcomingClassesQueryObj = session.createQuery(upcomingClassesQuery, Long.class);
            upcomingClassesQueryObj.setParameter("gradeId", gradeId);
            if (!enrolledClassTypeIds.isEmpty()) {
                upcomingClassesQueryObj.setParameter("classTypeIds", enrolledClassTypeIds);
            }
            Long upcomingClassesCount = upcomingClassesQueryObj.uniqueResult();
            stats.put("upcomingClasses", upcomingClassesCount != null ? upcomingClassesCount.intValue() : 0);

            // Get pending payments count (assuming status.id = 1 is PENDING)
            String pendingPaymentsQuery = "SELECT COUNT(*) FROM StudentMonthlyFees smf "
                    + "WHERE smf.student.id = :studentId AND smf.status.id = 1";
            Long pendingPaymentsCount = (Long) session.createQuery(pendingPaymentsQuery)
                    .setParameter("studentId", studentId)
                    .uniqueResult();
            stats.put("pendingPayments", pendingPaymentsCount != null ? pendingPaymentsCount.intValue() : 0);

            // Get available recordings count
            String recordingsQuery = "SELECT COUNT(*) FROM Recordings r "
                    + "WHERE r.grade.id = :gradeId AND r.is_active = 1";
            Long recordingsCount = (Long) session.createQuery(recordingsQuery)
                    .setParameter("gradeId", gradeId)
                    .uniqueResult();
            stats.put("availableRecordings", recordingsCount != null ? recordingsCount.intValue() : 0);

            // Get total classes (all scheduled classes for the grade and enrolled class types)
            String totalClassesQuery;
            if (enrolledClassTypeIds.isEmpty()) {
                totalClassesQuery = "SELECT COUNT(*) FROM Class_Schedule cs "
                        + "WHERE cs.grade.id = :gradeId AND cs.is_active = 1";
            } else {
                totalClassesQuery = "SELECT COUNT(*) FROM Class_Schedule cs "
                        + "WHERE cs.grade.id = :gradeId AND cs.classType.id IN :classTypeIds AND cs.is_active = 1";
            }
            org.hibernate.query.Query<Long> totalClassesQueryObj = session.createQuery(totalClassesQuery, Long.class);
            totalClassesQueryObj.setParameter("gradeId", gradeId);
            if (!enrolledClassTypeIds.isEmpty()) {
                totalClassesQueryObj.setParameter("classTypeIds", enrolledClassTypeIds);
            }
            Long totalClassesCount = totalClassesQueryObj.uniqueResult();
            stats.put("totalClasses", totalClassesCount != null ? totalClassesCount.intValue() : 0);

        } catch (Exception e) {
            e.printStackTrace();
            // Set default values in case of error
            stats.put("upcomingClasses", 0);
            stats.put("pendingPayments", 0);
            stats.put("availableRecordings", 0);
            stats.put("totalClasses", 0);
        }

        return stats;
    }

    private List<Map<String, Object>> getUpcomingClasses(Session session, String studentId, int gradeId, List<Integer> enrolledClassTypeIds) {
        List<Map<String, Object>> upcomingClasses = new ArrayList<>();

        try {
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
                    return upcomingClasses;
                }
            }

            // Get classes for the grade and enrolled class types
            String query;
            if (enrolledClassTypeIds.isEmpty()) {
                query = "SELECT cs FROM Class_Schedule cs "
                        + "WHERE cs.grade.id = :gradeId AND cs.is_active = 1 "
                        + "ORDER BY cs.days.id, cs.start_time";
            } else {
                query = "SELECT cs FROM Class_Schedule cs "
                        + "WHERE cs.grade.id = :gradeId AND cs.classType.id IN :classTypeIds AND cs.is_active = 1 "
                        + "ORDER BY cs.days.id, cs.start_time";
            }

            @SuppressWarnings("unchecked")
            org.hibernate.query.Query<Class_Schedule> queryObj = session.createQuery(query);
            queryObj.setParameter("gradeId", gradeId);
            if (!enrolledClassTypeIds.isEmpty()) {
                queryObj.setParameter("classTypeIds", enrolledClassTypeIds);
            }
            List<Class_Schedule> classes = queryObj.list();

            for (Class_Schedule cls : classes) {
                Map<String, Object> classMap = new HashMap<>();
                classMap.put("id", cls.getId());

                // Extract subject from description or use a default
                String subject = "Class";
                if (cls.getDescription() != null && !cls.getDescription().isEmpty()) {
                    String[] words = cls.getDescription().split(" ");
                    subject = words.length > 0 ? words[0] : "Class";
                }
                classMap.put("subject", subject);

                classMap.put("day", cls.getDays() != null ? cls.getDays().getName() : "TBA");
                classMap.put("time", formatTimeRange(cls.getStart_time(), cls.getEnd_time()));
                classMap.put("teacher", cls.getGrade() != null ? cls.getGrade().getName() : "Teacher");
                classMap.put("isNow", isClassHappeningNow(cls));
                classMap.put("description", cls.getDescription());
                classMap.put("zoomLink", cls.getZoom_link());
                
                // Add class type information
                if (cls.getClassType() != null) {
                    classMap.put("classType", cls.getClassType().getName());
                    classMap.put("classTypeId", cls.getClassType().getId());
                }

                upcomingClasses.add(classMap);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return upcomingClasses;
    }

    private Map<String, Object> getPaymentStatus(Session session, String studentId) {
        Map<String, Object> paymentStatus = new HashMap<>();

        try {
            // Get current month-year
            Calendar cal = Calendar.getInstance();
            String currentMonthYear = String.format("%04d-%02d", cal.get(Calendar.YEAR), cal.get(Calendar.MONTH) + 1);

            // Use list() instead of uniqueResult() to handle multiple records
            String query = "FROM StudentMonthlyFees smf "
                    + "WHERE smf.student.id = :studentId AND smf.monthYear = :monthYear "
                    + "ORDER BY smf.id DESC"; // Order by ID descending to get the latest one

            @SuppressWarnings("unchecked")
            List<StudentMonthlyFees> monthlyFees = session.createQuery(query)
                    .setParameter("studentId", studentId)
                    .setParameter("monthYear", currentMonthYear)
                    .list();

            if (monthlyFees != null && !monthlyFees.isEmpty()) {
                // Get the first (latest) record
                StudentMonthlyFees monthlyFee = monthlyFees.get(0);
                paymentStatus.put("status", monthlyFee.getStatus() != null ? monthlyFee.getStatus().getValue() : "PENDING");
                paymentStatus.put("amount", monthlyFee.getFeeAmount());
                paymentStatus.put("dueDate", monthlyFee.getDueDate() != null
                        ? new SimpleDateFormat("yyyy-MM-dd").format(monthlyFee.getDueDate()) : null);
                paymentStatus.put("monthYear", formatMonthYear(monthlyFee.getMonthYear()));
                paymentStatus.put("paidDate", monthlyFee.getPaidDate() != null
                        ? new SimpleDateFormat("yyyy-MM-dd").format(monthlyFee.getPaidDate()) : null);
                paymentStatus.put("transactionId", monthlyFee.getTransactionId());

                // Add additional info if there are multiple records
                if (monthlyFees.size() > 1) {
                    paymentStatus.put("multipleRecords", true);
                    paymentStatus.put("totalRecords", monthlyFees.size());
                }
            } else {
                // If no record found, create a default pending status
                paymentStatus.put("status", "PENDING");
                paymentStatus.put("amount", 0.0);
                paymentStatus.put("dueDate", null);
                paymentStatus.put("monthYear", formatMonthYear(currentMonthYear));
                paymentStatus.put("paidDate", null);
                paymentStatus.put("transactionId", null);
            }

        } catch (Exception e) {
            e.printStackTrace();
            // Default values
            paymentStatus.put("status", "PENDING");
            paymentStatus.put("amount", 0.0);
            paymentStatus.put("dueDate", null);
            paymentStatus.put("monthYear", "Current Month");
            paymentStatus.put("paidDate", null);
            paymentStatus.put("transactionId", null);
        }

        return paymentStatus;
    }

    private String formatTimeRange(String startTime, String endTime) {
        if (startTime == null || endTime == null) {
            return "TBA";
        }
        try {
            return String.format("%s - %s", formatTime(startTime), formatTime(endTime));
        } catch (Exception e) {
            return String.format("%s - %s", startTime, endTime);
        }
    }

    private String formatTime(String timeString) {
        if (timeString == null) {
            return "";
        }
        try {
            String[] parts = timeString.split(":");
            int hour = Integer.parseInt(parts[0]);
            String minutes = parts.length > 1 ? parts[1] : "00";
            String period = hour >= 12 ? "PM" : "AM";
            int formattedHour = hour % 12;
            if (formattedHour == 0) {
                formattedHour = 12;
            }
            return String.format("%d:%s %s", formattedHour, minutes, period);
        } catch (Exception e) {
            return timeString;
        }
    }

    private boolean isClassHappeningNow(Class_Schedule classSchedule) {
        try {
            // Simple implementation - check if the class day matches today
            Calendar now = Calendar.getInstance();
            String currentDay = getCurrentDayName();

            if (classSchedule.getDays() != null) {
                String scheduleDay = classSchedule.getDays().getName();
                return scheduleDay.equalsIgnoreCase(currentDay);
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }

    private String getCurrentDayName() {
        String[] days = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};
        Calendar cal = Calendar.getInstance();
        int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK);
        return days[dayOfWeek - 1];
    }

    private String formatMonthYear(String monthYear) {
        if (monthYear == null) {
            return "Unknown";
        }
        try {
            String[] parts = monthYear.split("-");
            if (parts.length == 2) {
                int year = Integer.parseInt(parts[0]);
                int month = Integer.parseInt(parts[1]);
                String[] monthNames = {"January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"};
                if (month >= 1 && month <= 12) {
                    return monthNames[month - 1] + " " + year;
                }
            }
            return monthYear;
        } catch (Exception e) {
            return monthYear;
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response);
    }
}

