package com.nextlvlict.nextlvlict.hibernate;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "portfolio_testimonials")
public class PortfolioTestimonial {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;
    
    @Column(name = "name", length = 255)
    private String name;
    
    @Column(name = "role", length = 500)
    private String role;
    
    @Column(name = "image", length = 500)
    private String image;
    
    @Column(name = "text", columnDefinition = "TEXT")
    private String text;
    
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
    
    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    
    public int getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(int displayOrder) { this.displayOrder = displayOrder; }
    
    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
    
    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
    
    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }
}
