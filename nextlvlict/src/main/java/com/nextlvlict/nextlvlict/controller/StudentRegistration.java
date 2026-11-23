package com.nextlvlict.nextlvlict.controller;

import com.google.gson.JsonObject;
import com.nextlvlict.nextlvlict.hibernate.*;
import com.nextlvlict.nextlvlict.service.MonthlyFeeGenerationService;
import com.nextlvlict.nextlvlict.util.PasswordUtil;
import org.hibernate.Session;
import org.hibernate.Transaction;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;
import java.util.Random;

@WebServlet(name = "StudentRegistration", urlPatterns = {"/StudentRegistration"})
public class StudentRegistration extends HttpServlet {

    // Method to generate a random 8-digit ID
    private String generateStudentId() {
        Random random = new Random();
        int num = random.nextInt(90000000) + 10000000; // Generates number between 10000000 and 99999999
        return String.valueOf(num);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        JsonObject jsonResponse = new JsonObject();

        Session session = null;
        Transaction transaction = null;

        try {
            // Get parameters from request
            String firstName = request.getParameter("fName");
            String lastName = request.getParameter("lName");
            String email = request.getParameter("email");
            String phone = request.getParameter("phone");
            String password = request.getParameter("password");
            String gradeIdStr = request.getParameter("gradeId");
            String olAlIdStr = request.getParameter("olAlId");
            String dateOfBirthStr = request.getParameter("dateOfBirth");
            String school = request.getParameter("school");
            String nic = request.getParameter("nic");
            String line1 = request.getParameter("line1");
            String line2 = request.getParameter("line2");
            String city = request.getParameter("city");
            String postalcode = request.getParameter("postalcode");
            String provinceIdStr = request.getParameter("provinceId");
            String districtIdStr = request.getParameter("districtId");

            // Validate required fields
            if (firstName == null || firstName.isEmpty()
                    || lastName == null || lastName.isEmpty()
                    || email == null || email.isEmpty()
                    || password == null || password.isEmpty()
                    || gradeIdStr == null || gradeIdStr.isEmpty()
                    || olAlIdStr == null || olAlIdStr.isEmpty()
                    || dateOfBirthStr == null || dateOfBirthStr.isEmpty()
                    || school == null || school.isEmpty()
                    || line1 == null || line1.isEmpty()
                    || city == null || city.isEmpty()
                    || provinceIdStr == null || provinceIdStr.isEmpty()
                    || districtIdStr == null || districtIdStr.isEmpty()) {

                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "All required fields must be filled");
                out.print(jsonResponse.toString());
                return;
            }

            int gradeId;
            try {
                gradeId = Integer.parseInt(gradeIdStr);
            } catch (NumberFormatException e) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Invalid grade selection");
                out.print(jsonResponse.toString());
                return;
            }

            // Parse date of birth
            java.sql.Date dateOfBirth;
            try {
                // Convert from yyyy-MM-dd (HTML date input format) to java.sql.Date
                dateOfBirth = java.sql.Date.valueOf(dateOfBirthStr);
            } catch (IllegalArgumentException e) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Invalid date format for date of birth");
                out.print(jsonResponse.toString());
                return;
            }

            session = HibernateUtil.getSessionFactory().openSession();

            // Check if email already exists
            String checkEmailHql = "FROM Students WHERE email = :email";
            Students existingStudentByEmail = (Students) session.createQuery(checkEmailHql)
                    .setParameter("email", email)
                    .uniqueResult();

            if (existingStudentByEmail != null) {
                response.setStatus(HttpServletResponse.SC_CONFLICT);
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Email address already registered. Please use a different email.");
                jsonResponse.addProperty("errorType", "EMAIL_EXISTS");
                out.print(jsonResponse.toString()); // Make sure to write JSON response
                out.flush();
                return;
            }

            // Check if phone number already exists (if provided)
            if (phone != null && !phone.trim().isEmpty()) {
                String checkPhoneHql = "FROM Students WHERE mobile = :phone";
                Students existingStudentByPhone = (Students) session.createQuery(checkPhoneHql)
                        .setParameter("phone", phone)
                        .uniqueResult();

                if (existingStudentByPhone != null) {
                    response.setStatus(HttpServletResponse.SC_CONFLICT);
                    jsonResponse.addProperty("success", false);
                    jsonResponse.addProperty("message", "Phone number already registered. Please use a different phone number.");
                    jsonResponse.addProperty("errorType", "PHONE_EXISTS");
                    out.print(jsonResponse.toString());
                    out.flush();
                    return;
                }
            }

            // Check if grade exists and is active
            String checkGradeHql = "FROM Grade WHERE id = :gradeId AND is_active = 1";
            Grade grade = (Grade) session.createQuery(checkGradeHql)
                    .setParameter("gradeId", gradeId)
                    .uniqueResult();

            if (grade == null) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Invalid grade selection");
                out.print(jsonResponse.toString());
                return;
            }

            // Check if province exists
            String checkProvinceHql = "FROM Provinces WHERE id = :provinceId";
            Provinces province = (Provinces) session.createQuery(checkProvinceHql)
                    .setParameter("provinceId", provinceIdStr)
                    .uniqueResult();

            if (province == null) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Invalid province selection");
                out.print(jsonResponse.toString());
                return;
            }

            // Check if district exists
            String checkDistrictHql = "FROM Districts WHERE id = :districtId";
            Districts district = (Districts) session.createQuery(checkDistrictHql)
                    .setParameter("districtId", districtIdStr)
                    .uniqueResult();

            if (district == null) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Invalid district selection");
                out.print(jsonResponse.toString());
                return;
            }

            // Generate a unique student ID
            String studentId;
            Students studentWithId;
            int attempts = 0;

            do {
                studentId = generateStudentId();
                // Check if this ID already exists
                studentWithId = (Students) session.createQuery("FROM Students WHERE id = :id")
                        .setParameter("id", studentId)
                        .uniqueResult();
                attempts++;
            } while (studentWithId != null && attempts < 10); // Try up to 10 times to get a unique ID

            if (studentWithId != null) {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Could not generate a unique student ID. Please try again.");
                jsonResponse.addProperty("errorType", "ID_GENERATION_FAILED");
                out.print(jsonResponse.toString());
                return;
            }

            // Create new student
            transaction = session.beginTransaction();

            // Create address first
            Address address = new Address();
            String addressId;
            Address addressWithId;
            int addressAttempts = 0;

            do {
                addressId = generateStudentId(); // Use same method to generate unique ID
                addressWithId = (Address) session.createQuery("FROM Address WHERE id = :id")
                        .setParameter("id", addressId)
                        .uniqueResult();
                addressAttempts++;
            } while (addressWithId != null && addressAttempts < 10);

            address.setId(addressId);
            address.setLine1(line1);
            address.setLine2(line2 != null ? line2 : "");
            address.setCity(city);
            address.setPostalcode(postalcode != null ? postalcode : "");
            address.setProvinces(province);
            address.setDistricts(district);

            session.save(address);

            Students student = new Students();
            student.setId(studentId);
            student.setFirst_name(firstName);
            student.setLast_name(lastName);
            student.setEmail(email);
            student.setMobile(phone);
            student.setPassword(PasswordUtil.hashPassword(password)); // Hash password using BCrypt
            student.setIs_active(1);
            student.setCreated_at(new Date());
            student.setGrade(grade);
            student.setDate_of_birth(dateOfBirth);
            student.setSchool(school);
            student.setNic(nic);
            student.setAddress(address);
            // Remove classType from student as it will be managed through student_class table

            session.save(student);
            transaction.commit();

            jsonResponse.addProperty("success", true);
            jsonResponse.addProperty("message", "Registration successful. Your student ID is: " + studentId);
            jsonResponse.addProperty("studentId", studentId);

        } catch (Exception e) {
            e.printStackTrace();

            // Rollback transaction if it was started
            if (transaction != null && transaction.isActive()) {
                try {
                    transaction.rollback();
                } catch (Exception rollbackEx) {
                    rollbackEx.printStackTrace();
                }
            }

            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Registration failed due to a server error. Please try again.");
            jsonResponse.addProperty("errorType", "SERVER_ERROR");
        } finally {
            // Always close session in finally block
            if (session != null && session.isOpen()) {
                try {
                    session.close();
                } catch (Exception closeEx) {
                    closeEx.printStackTrace();
                }
            }

            out.print(jsonResponse.toString());
            out.flush();
        }
    }
}
