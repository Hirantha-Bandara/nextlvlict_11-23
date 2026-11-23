package com.nextlvlict.nextlvlict.hibernate;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "free_lessons")
public class FreeLesson {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;
    
    @Column(name = "unit_label", length = 100, nullable = false)
    private String unitLabel;
    
    @Column(name = "title", nullable = false, length = 255)
    private String title;
    
    @Column(name = "youtube_url", nullable = false, length = 500)
    private String youtubeUrl;
    
    @Column(name = "display_order", nullable = false)
    private int displayOrder;
    
    @Column(name = "is_active")
    private boolean isActive = true;
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at")
    private Date createdAt = new Date();
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "updated_at")
    private Date updatedAt = new Date();
    
    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    
    public String getUnitLabel() { return unitLabel; }
    public void setUnitLabel(String unitLabel) { this.unitLabel = unitLabel; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getYoutubeUrl() { return youtubeUrl; }
    public void setYoutubeUrl(String youtubeUrl) { this.youtubeUrl = youtubeUrl; }
    
    public int getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(int displayOrder) { this.displayOrder = displayOrder; }
    
    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
    
    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
    
    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }
}
