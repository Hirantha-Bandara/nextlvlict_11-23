package com.nextlvlict.nextlvlict.dto;

import java.util.Date;

/**
 * Data Transfer Object for Student entity.
 * Excludes sensitive information like passwords and includes only necessary fields for API responses.
 */
public class StudentDTO {
    
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String mobile;
    private int isActive;
    private Date createdAt;
    private String gradeId;
    private String gradeName;
    private Date dateOfBirth;
    private String school;
    private Integer classTypeId;
    private String classTypeName;

    public StudentDTO() {
    }

    public StudentDTO(String id, String firstName, String lastName, String email, String mobile, 
                      int isActive, Date createdAt, String gradeId, String gradeName, 
                      Date dateOfBirth, String school, Integer classTypeId, String classTypeName) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.mobile = mobile;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.gradeId = gradeId;
        this.gradeName = gradeName;
        this.dateOfBirth = dateOfBirth;
        this.school = school;
        this.classTypeId = classTypeId;
        this.classTypeName = classTypeName;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public int getIsActive() {
        return isActive;
    }

    public void setIsActive(int isActive) {
        this.isActive = isActive;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public String getGradeId() {
        return gradeId;
    }

    public void setGradeId(String gradeId) {
        this.gradeId = gradeId;
    }

    public String getGradeName() {
        return gradeName;
    }

    public void setGradeName(String gradeName) {
        this.gradeName = gradeName;
    }

    public Date getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(Date dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getSchool() {
        return school;
    }

    public void setSchool(String school) {
        this.school = school;
    }

    public Integer getClassTypeId() {
        return classTypeId;
    }

    public void setClassTypeId(Integer classTypeId) {
        this.classTypeId = classTypeId;
    }

    public String getClassTypeName() {
        return classTypeName;
    }

    public void setClassTypeName(String classTypeName) {
        this.classTypeName = classTypeName;
    }
}
