package com.nextlvlict.nextlvlict.controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.nextlvlict.nextlvlict.hibernate.HibernateUtil;
import com.nextlvlict.nextlvlict.hibernate.Students;
import com.nextlvlict.nextlvlict.hibernate.Address;
import com.nextlvlict.nextlvlict.hibernate.Provinces;
import org.hibernate.Session;
import org.hibernate.Transaction;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "UpdateProfileServlet", urlPatterns = {"/UpdateProfileServlet"})
public class UpdateProfileServlet extends HttpServlet {

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
            // Parse JSON request
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = request.getReader().readLine()) != null) {
                sb.append(line);
            }
            String requestBody = sb.toString();

            Gson gson = new Gson();
            JsonObject updateData = gson.fromJson(requestBody, JsonObject.class);

            String studentId = updateData.get("studentId").getAsString();
            String firstName = updateData.get("firstName").getAsString();
            String lastName = updateData.get("lastName").getAsString();
            String email = updateData.get("email").getAsString();
            String school = updateData.has("school") ? updateData.get("school").getAsString() : null;
            String line1 = updateData.has("line1") ? updateData.get("line1").getAsString() : null;
            String line2 = updateData.has("line2") ? updateData.get("line2").getAsString() : null;
            String city = updateData.has("city") ? updateData.get("city").getAsString() : null;
            String postalcode = updateData.has("postalcode") ? updateData.get("postalcode").getAsString() : null;
            String provinceId = updateData.has("provinceId") ? updateData.get("provinceId").getAsString() : null;

            // Validate required fields
            if (firstName.isEmpty() || lastName.isEmpty() || email.isEmpty() || school.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "All required fields must be filled");
                out.print(jsonResponse.toString());
                return;
            }

            session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();

            // Get student and update
            Students student = (Students) session.get(Students.class, studentId);

            if (student == null) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Student not found");
                out.print(jsonResponse.toString());
                return;
            }

            // Check if email is already used by another student
            if (!student.getEmail().equals(email)) {
                String checkEmailHql = "FROM Students WHERE email = :email AND id != :studentId";
                Students existingStudent = (Students) session.createQuery(checkEmailHql)
                        .setParameter("email", email)
                        .setParameter("studentId", studentId)
                        .uniqueResult();

                if (existingStudent != null) {
                    response.setStatus(HttpServletResponse.SC_CONFLICT);
                    jsonResponse.addProperty("success", false);
                    jsonResponse.addProperty("message", "Email address already in use by another student");
                    out.print(jsonResponse.toString());
                    transaction.rollback();
                    return;
                }
            }

            // Update student details (excluding mobile and date_of_birth as requested)
            student.setFirst_name(firstName);
            student.setLast_name(lastName);
            student.setEmail(email);
            student.setSchool(school);
            // Note: Mobile number is not updated here - it remains as registered

            // Update address if provided with valid province
            if (provinceId != null && (line1 != null || line2 != null || city != null || postalcode != null)) {
                Provinces province = (Provinces) session.get(Provinces.class, provinceId);
                if (province == null) {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    jsonResponse.addProperty("success", false);
                    jsonResponse.addProperty("message", "Invalid province ID");
                    out.print(jsonResponse.toString());
                    transaction.rollback();
                    return;
                }

                Address address = student.getAddress();
                if (address == null) {
                    address = new Address();
                    // Generate a short ID similar to student IDs
                    address.setId(String.valueOf(System.currentTimeMillis()).substring(0, 8));
                    address.setProvinces(province);
                    student.setAddress(address);
                    session.save(address);
                } else {
                    address.setProvinces(province);
                }

                if (line1 != null) address.setLine1(line1);
                if (line2 != null) address.setLine2(line2);
                if (city != null) address.setCity(city);
                if (postalcode != null) address.setPostalcode(postalcode);

                session.update(address);
            }

            session.update(student);
            transaction.commit();

            jsonResponse.addProperty("success", true);
            jsonResponse.addProperty("message", "Profile updated successfully");

        } catch (Exception e) {
            e.printStackTrace();
            if (transaction != null) {
                transaction.rollback();
            }
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error updating profile");
        } finally {
            if (session != null && session.isOpen()) {
                session.close();
            }
            out.print(jsonResponse.toString());
            out.flush();
        }
    }
}

