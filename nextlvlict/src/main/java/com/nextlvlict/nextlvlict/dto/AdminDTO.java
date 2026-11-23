package com.nextlvlict.nextlvlict.dto;

import java.util.Date;

/**
 * Data Transfer Object for Admin_Users entity.
 * Excludes sensitive information like passwords and includes only necessary fields for API responses.
 */
public class AdminDTO {
    
    private int id;
    private String username;
    private String email;
    private int isActive;
    private Date createdAt;

    public AdminDTO() {
    }

    public AdminDTO(int id, String username, String email, int isActive, Date createdAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.isActive = isActive;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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
}
