package com.nextlvlict.nextlvlict.controller;

import com.nextlvlict.nextlvlict.hibernate.GradeClassFee;
import com.nextlvlict.nextlvlict.hibernate.Grade;
import com.nextlvlict.nextlvlict.hibernate.ClassType;
import com.nextlvlict.nextlvlict.hibernate.Ol_or_Al;
import com.nextlvlict.nextlvlict.service.GradeClassFeeService;
import com.nextlvlict.nextlvlict.util.AdminAuthTokenStore;
import org.json.JSONArray;
import org.json.JSONObject;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.List;

@WebServlet(name = "ClassFeeManagement", urlPatterns = {"/ClassFeeManagement"})
public class ClassFeeManagement extends HttpServlet {

    private GradeClassFeeService gradeClassFeeService = new GradeClassFeeService();

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // Check admin authentication using X-Auth-Token only
        String authToken = request.getHeader("X-Auth-Token");
        boolean isAuthenticated = authToken != null && !authToken.isEmpty()
            && AdminAuthTokenStore.validate(authToken) != null;

        if (!isAuthenticated) {
            PrintWriter out = response.getWriter();
            out.write("{\"error\": \"Unauthorized access. Admin login required.\"}");
            return;
        }

        String action = request.getParameter("action");

        try (PrintWriter out = response.getWriter()) {
            if ("getAll".equals(action)) {
                getAllClassFees(request, out);
            } else if ("save".equals(action)) {
                saveClassFee(request, out);
            } else if ("update".equals(action)) {
                updateClassFee(request, out);
            } else if ("delete".equals(action)) {
                deleteClassFee(request, out);
            } else if ("deactivate".equals(action)) {
                deactivateClassFee(request, out);
            } else if ("getGrades".equals(action)) {
                getGrades(out);
            } else if ("getClassTypes".equals(action)) {
                getClassTypes(out);
            } else if ("saveGrade".equals(action)) {
                saveGrade(request, out);
            } else if ("updateGrade".equals(action)) {
                updateGrade(request, out);
            } else if ("deleteGrade".equals(action)) {
                deleteGrade(request, out);
            } else if ("getOlOrAlTypes".equals(action)) {
                getOlOrAlTypes(out);
            } else {
                out.write("{\"error\": \"Invalid action\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void getAllClassFees(HttpServletRequest request, PrintWriter out) {
        try {
            // Get filter parameters
            String gradeIdStr = request.getParameter("gradeId");
            String classTypeIdStr = request.getParameter("classTypeId");
            String statusStr = request.getParameter("status");
            String searchQuery = request.getParameter("search");

            Integer gradeIdFilter = null;
            Integer classTypeIdFilter = null;
            Integer statusFilter = null;

            if (gradeIdStr != null && !gradeIdStr.isEmpty()) {
                gradeIdFilter = Integer.parseInt(gradeIdStr);
            }
            if (classTypeIdStr != null && !classTypeIdStr.isEmpty()) {
                classTypeIdFilter = Integer.parseInt(classTypeIdStr);
            }
            if (statusStr != null && !statusStr.isEmpty()) {
                statusFilter = Integer.parseInt(statusStr);
            }

            List<GradeClassFee> gradeClassFees = gradeClassFeeService.getAllGradeClassFees(
                gradeIdFilter, classTypeIdFilter, statusFilter, searchQuery);

            JSONArray jsonArray = new JSONArray();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

            for (GradeClassFee gcf : gradeClassFees) {
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("id", gcf.getId());
                jsonObject.put("gradeId", gcf.getGrade() != null ? gcf.getGrade().getId() : "");
                jsonObject.put("gradeName", gcf.getGrade() != null ? gcf.getGrade().getName() : "");
                jsonObject.put("classTypeId", gcf.getClassType() != null ? gcf.getClassType().getId() : "");
                jsonObject.put("classTypeName", gcf.getClassType() != null ? gcf.getClassType().getName() : "");
                jsonObject.put("monthlyFee", gcf.getMonthlyFee());
                jsonObject.put("registrationFee", gcf.getRegistrationFee());
                jsonObject.put("status", gcf.getIsActive());
                if (gcf.getCreatedAt() != null) {
                    jsonObject.put("createdAt", sdf.format(gcf.getCreatedAt()));
                }
                if (gcf.getUpdatedAt() != null) {
                    jsonObject.put("updatedAt", sdf.format(gcf.getUpdatedAt()));
                }

                jsonArray.put(jsonObject);
            }

            out.write(jsonArray.toString());
        } catch (Exception e) {
            e.printStackTrace();
            out.write("{\"error\": \"Error retrieving class fees: " + e.getMessage() + "\"}");
        }
    }

    private void saveClassFee(HttpServletRequest request, PrintWriter out) {
        try {
            String gradeIdStr = request.getParameter("gradeId");
            String classTypeIdStr = request.getParameter("classTypeId");
            String monthlyFeeStr = request.getParameter("monthlyFee");
            String registrationFeeStr = request.getParameter("registrationFee");
            String statusStr = request.getParameter("status");

            if (gradeIdStr == null || gradeIdStr.isEmpty()) {
                out.write("{\"error\": \"gradeId parameter is required\"}");
                return;
            }
            if (classTypeIdStr == null || classTypeIdStr.isEmpty()) {
                out.write("{\"error\": \"classTypeId parameter is required\"}");
                return;
            }

            Integer gradeId = Integer.parseInt(gradeIdStr);
            Integer classTypeId = Integer.parseInt(classTypeIdStr);
            Double monthlyFee = monthlyFeeStr != null && !monthlyFeeStr.isEmpty() ? Double.parseDouble(monthlyFeeStr) : 0.0;
            Double registrationFee = registrationFeeStr != null && !registrationFeeStr.isEmpty() ? Double.parseDouble(registrationFeeStr) : 0.0;
            Integer status = statusStr != null && !statusStr.isEmpty() ? Integer.parseInt(statusStr) : 1;

            GradeClassFee gradeClassFee = gradeClassFeeService.createGradeClassFee(
                gradeId, classTypeId, monthlyFee, registrationFee, status);

            JSONObject response = new JSONObject();
            response.put("success", "Class fee created successfully");
            response.put("id", gradeClassFee.getId());
            out.write(response.toString());

        } catch (Exception e) {
            e.printStackTrace();
            out.write("{\"error\": \"Error creating class fee: " + e.getMessage() + "\"}");
        }
    }

    private void updateClassFee(HttpServletRequest request, PrintWriter out) {
        try {
            String idStr = request.getParameter("id");
            if (idStr == null || idStr.isEmpty()) {
                out.write("{\"error\": \"ID parameter is required\"}");
                return;
            }

            Integer id = Integer.parseInt(idStr);
            String gradeIdStr = request.getParameter("gradeId");
            String classTypeIdStr = request.getParameter("classTypeId");
            String monthlyFeeStr = request.getParameter("monthlyFee");
            String registrationFeeStr = request.getParameter("registrationFee");
            String statusStr = request.getParameter("status");

            Integer gradeId = gradeIdStr != null && !gradeIdStr.isEmpty() ? Integer.parseInt(gradeIdStr) : null;
            Integer classTypeId = classTypeIdStr != null && !classTypeIdStr.isEmpty() ? Integer.parseInt(classTypeIdStr) : null;
            Double monthlyFee = monthlyFeeStr != null && !monthlyFeeStr.isEmpty() ? Double.parseDouble(monthlyFeeStr) : null;
            Double registrationFee = registrationFeeStr != null && !registrationFeeStr.isEmpty() ? Double.parseDouble(registrationFeeStr) : null;
            Integer status = statusStr != null && !statusStr.isEmpty() ? Integer.parseInt(statusStr) : null;

            GradeClassFee gradeClassFee = gradeClassFeeService.updateGradeClassFee(
                id, gradeId, classTypeId, monthlyFee, registrationFee, status);

            JSONObject response = new JSONObject();
            response.put("success", "Class fee updated successfully");
            response.put("id", gradeClassFee.getId());
            out.write(response.toString());

        } catch (Exception e) {
            e.printStackTrace();
            out.write("{\"error\": \"Error updating class fee: " + e.getMessage() + "\"}");
        }
    }

    private void deleteClassFee(HttpServletRequest request, PrintWriter out) {
        try {
            String idStr = request.getParameter("id");
            if (idStr == null || idStr.isEmpty()) {
                out.write("{\"error\": \"ID parameter is required\"}");
                return;
            }

            Integer id = Integer.parseInt(idStr);
            gradeClassFeeService.deleteGradeClassFee(id);

            out.write("{\"success\": \"Class fee deleted successfully\"}");
        } catch (Exception e) {
            e.printStackTrace();
            out.write("{\"error\": \"Error deleting class fee: " + e.getMessage() + "\"}");
        }
    }

    private void deactivateClassFee(HttpServletRequest request, PrintWriter out) {
        try {
            String idStr = request.getParameter("id");
            if (idStr == null || idStr.isEmpty()) {
                out.write("{\"error\": \"ID parameter is required\"}");
                return;
            }

            Integer id = Integer.parseInt(idStr);
            gradeClassFeeService.deactivateGradeClassFee(id);

            out.write("{\"success\": \"Class fee deactivated successfully\"}");
        } catch (Exception e) {
            e.printStackTrace();
            out.write("{\"error\": \"Error deactivating class fee: " + e.getMessage() + "\"}");
        }
    }

    private void getClassTypes(PrintWriter out) {
        try {
            List<ClassType> classTypes = gradeClassFeeService.getAllClassTypes();

            JSONArray jsonArray = new JSONArray();
            for (ClassType classType : classTypes) {
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("id", classType.getId());
                jsonObject.put("name", classType.getName());
                jsonArray.put(jsonObject);
            }

            out.write(jsonArray.toString());
        } catch (Exception e) {
            e.printStackTrace();
            out.write("{\"error\": \"Error retrieving class types: " + e.getMessage() + "\"}");
        }
    }

    private void getGrades(PrintWriter out) {
        try {
            List<Grade> grades = gradeClassFeeService.getAllGrades();

            JSONArray jsonArray = new JSONArray();
            for (Grade grade : grades) {
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("id", grade.getId());
                jsonObject.put("name", grade.getName());
                jsonArray.put(jsonObject);
            }

            out.write(jsonArray.toString());
        } catch (Exception e) {
            e.printStackTrace();
            out.write("{\"error\": \"Error retrieving grades: " + e.getMessage() + "\"}");
        }
    }

    private void saveGrade(HttpServletRequest request, PrintWriter out) {
        try {
            String name = request.getParameter("name");
            String isActiveStr = request.getParameter("isActive");
            String olOrAlIdStr = request.getParameter("ol_or_al_id");

            if (name == null || name.trim().isEmpty()) {
                out.write("{\"error\": \"name parameter is required\"}");
                return;
            }

            Integer isActive = isActiveStr != null && !isActiveStr.isEmpty() ? Integer.parseInt(isActiveStr) : 1;
            Integer olOrAlId = olOrAlIdStr != null && !olOrAlIdStr.isEmpty() ? Integer.parseInt(olOrAlIdStr) : null;

            Grade grade = gradeClassFeeService.createGrade(name, isActive, olOrAlId);

            JSONObject response = new JSONObject();
            response.put("success", "Grade created successfully");
            response.put("id", grade.getId());
            response.put("name", grade.getName());
            response.put("isActive", grade.getIs_active());
            response.put("olOrAlId", grade.getOl_or_al() != null ? grade.getOl_or_al().getId() : "");
            response.put("olOrAlName", grade.getOl_or_al() != null ? grade.getOl_or_al().getName() : "");
            out.write(response.toString());

        } catch (Exception e) {
            e.printStackTrace();
            out.write("{\"error\": \"Error creating grade: " + e.getMessage() + "\"}");
        }
    }

    private void updateGrade(HttpServletRequest request, PrintWriter out) {
        try {
            String idStr = request.getParameter("id");
            String name = request.getParameter("name");
            String isActiveStr = request.getParameter("isActive");
            String olOrAlIdStr = request.getParameter("ol_or_al_id");

            if (idStr == null || idStr.isEmpty()) {
                out.write("{\"error\": \"ID parameter is required\"}");
                return;
            }

            Integer id = Integer.parseInt(idStr);
            Integer isActive = isActiveStr != null && !isActiveStr.isEmpty() ? Integer.parseInt(isActiveStr) : null;
            Integer olOrAlId = olOrAlIdStr != null && !olOrAlIdStr.isEmpty() ? Integer.parseInt(olOrAlIdStr) : null;

            Grade grade = gradeClassFeeService.updateGrade(id, name, isActive, olOrAlId);

            JSONObject response = new JSONObject();
            response.put("success", "Grade updated successfully");
            response.put("id", grade.getId());
            response.put("name", grade.getName());
            response.put("isActive", grade.getIs_active());
            response.put("olOrAlId", grade.getOl_or_al() != null ? grade.getOl_or_al().getId() : "");
            response.put("olOrAlName", grade.getOl_or_al() != null ? grade.getOl_or_al().getName() : "");
            out.write(response.toString());

        } catch (Exception e) {
            e.printStackTrace();
            out.write("{\"error\": \"Error updating grade: " + e.getMessage() + "\"}");
        }
    }

    private void deleteGrade(HttpServletRequest request, PrintWriter out) {
        try {
            String idStr = request.getParameter("id");
            if (idStr == null || idStr.isEmpty()) {
                out.write("{\"error\": \"ID parameter is required\"}");
                return;
            }

            Integer id = Integer.parseInt(idStr);
            gradeClassFeeService.deleteGrade(id);

            out.write("{\"success\": \"Grade deleted successfully\"}");
        } catch (Exception e) {
            e.printStackTrace();
            out.write("{\"error\": \"Error deleting grade: " + e.getMessage() + "\"}");
        }
    }

    private void getOlOrAlTypes(PrintWriter out) {
        try {
            List<Ol_or_Al> olOrAlTypes = gradeClassFeeService.getAllOlOrAlTypes();

            JSONArray jsonArray = new JSONArray();
            for (Ol_or_Al olOrAl : olOrAlTypes) {
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("id", olOrAl.getId());
                jsonObject.put("name", olOrAl.getName());
                jsonArray.put(jsonObject);
            }

            out.write(jsonArray.toString());
        } catch (Exception e) {
            e.printStackTrace();
            out.write("{\"error\": \"Error retrieving OL/AL types: " + e.getMessage() + "\"}");
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
        return "Class Fee Management Servlet";
    }
}
