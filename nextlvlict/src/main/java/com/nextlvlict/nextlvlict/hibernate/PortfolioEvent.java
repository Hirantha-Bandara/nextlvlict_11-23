package com.nextlvlict.nextlvlict.hibernate;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "portfolio_events")
public class PortfolioEvent {  // Change from 'class' to 'public class'
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;
    
    @Column(name = "title")
    private String title;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "image")
    private String image;
    
    @Column(name = "date")
    private String date;
    
    @Column(name = "location")
    private String location;
    
    @Column(name = "full_description")
    private String fullDescription;
    
    @Column(name = "fee")
    private String fee;
    
    @Column(name = "display_order")
    private int displayOrder;
    
    @Column(name = "is_active")
    private boolean isActive = true;
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at")
    private Date createdAt = new Date();
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "updated_at")
    private Date updatedAt = new Date();
    
    // Add the missing 'time' field from SQL
    @Column(name = "time")
    private String time;
    
    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public String getFullDescription() { return fullDescription; }
    public void setFullDescription(String fullDescription) { this.fullDescription = fullDescription; }
    
    public String getFee() { return fee; }
    public void setFee(String fee) { this.fee = fee; }
    
    public int getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(int displayOrder) { this.displayOrder = displayOrder; }
    
    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
    
    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
    
    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }
    
    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }
}
