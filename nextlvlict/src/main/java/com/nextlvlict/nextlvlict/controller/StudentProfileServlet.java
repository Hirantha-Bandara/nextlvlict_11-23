package com.nextlvlict.nextlvlict.controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.nextlvlict.nextlvlict.hibernate.HibernateUtil;
import com.nextlvlict.nextlvlict.hibernate.Students;
import com.nextlvlict.nextlvlict.hibernate.Address;
import com.nextlvlict.nextlvlict.hibernate.Provinces;
import org.hibernate.Session;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;

@WebServlet(name = "StudentProfileServlet", urlPatterns = {"/StudentProfileServlet"})
public class StudentProfileServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        JsonObject jsonResponse = new JsonObject();

        Session session = null;

        try {
            // Parse JSON request
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = request.getReader().readLine()) != null) {
                sb.append(line);
            }
            String requestBody = sb.toString();

            Gson gson = new Gson();
            JsonObject requestData = gson.fromJson(requestBody, JsonObject.class);

            String studentId = requestData.get("studentId").getAsString();
//            System.out.println(studentId);

            session = HibernateUtil.getSessionFactory().openSession();

            // Get student data
            Students student = (Students) session.get(Students.class, studentId);

            if (student == null) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Student not found");
                out.print(jsonResponse.toString());
                return;
            }

            // Format date of birth
            String dateOfBirthFormatted = null;
            if (student.getDate_of_birth() != null) {
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                dateOfBirthFormatted = sdf.format(student.getDate_of_birth());
            }

            // Create response with student data
            JsonObject studentJson = new JsonObject();
            studentJson.addProperty("studentId", student.getId());
            studentJson.addProperty("firstName", student.getFirst_name());
            studentJson.addProperty("lastName", student.getLast_name());
            studentJson.addProperty("email", student.getEmail());
            studentJson.addProperty("mobile", student.getMobile());
            studentJson.addProperty("dateOfBirth", dateOfBirthFormatted);
            studentJson.addProperty("school", student.getSchool());

            // ADD GRADE AND FEE INFORMATION
            if (student.getGrade() != null) {
                studentJson.addProperty("gradeId", student.getGrade().getId());
                studentJson.addProperty("gradeName", student.getGrade().getName());
                studentJson.addProperty("monthlyFee", student.getGrade().getFee());
            }

            // ADD ADDRESS INFORMATION
            JsonObject addressJson = new JsonObject();
            Address address = student.getAddress();
            if (address != null) {
                addressJson.addProperty("line1", address.getLine1());
                addressJson.addProperty("line2", address.getLine2());
                addressJson.addProperty("city", address.getCity());
                addressJson.addProperty("postalcode", address.getPostalcode());

                Provinces province = address.getProvinces();
                if (province != null) {
                    addressJson.addProperty("provinceId", province.getId());
                    addressJson.addProperty("provinceName", province.getName());
                }
            } else {
                // Initialize empty address object
                addressJson.addProperty("line1", "");
                addressJson.addProperty("line2", "");
                addressJson.addProperty("city", "");
                addressJson.addProperty("postalcode", "");
                addressJson.addProperty("provinceId", "");
                addressJson.addProperty("provinceName", "");
            }

            studentJson.add("address", addressJson);

            jsonResponse.addProperty("success", true);
            jsonResponse.add("student", studentJson);

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Error fetching student data");
        } finally {
            if (session != null && session.isOpen()) {
                session.close();
            }
            out.print(jsonResponse.toString());
            out.flush();
        }
    }
}
