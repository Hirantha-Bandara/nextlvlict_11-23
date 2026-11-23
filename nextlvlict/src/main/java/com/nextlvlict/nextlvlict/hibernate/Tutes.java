package com.nextlvlict.nextlvlict.hibernate;

import com.google.gson.annotations.Expose;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "tutes")
public class Tutes implements Serializable {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "title")
    private String title;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "link")
    private String link;

    @Column(name = "cover_image_url")
    private String coverImageUrl;

    @Column(name = "price")
    private double price;

    @Enumerated(EnumType.STRING)
    @Column(name = "access_type")
    private AccessType accessType = AccessType.PAID;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", updatable = false)
    private Date created_at = new Date();
    
    @Column(name = "is_active")
    private boolean isActive = true;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "grade_id")
    private Grade grade;

    // New ManyToMany relationship for multiple grades support
    @Expose
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "tute_grades",
        joinColumns = @JoinColumn(name = "tute_id", referencedColumnName = "id"),
        inverseJoinColumns = @JoinColumn(name = "grade_id", referencedColumnName = "id")
    )
    private java.util.Set<Grade> grades = new java.util.HashSet<>();

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tute_type_id")
    private TuteType tuteType;

    public Tutes() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public String getCoverImageUrl() {
        return coverImageUrl;
    }

    public void setCoverImageUrl(String coverImageUrl) {
        this.coverImageUrl = coverImageUrl;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public AccessType getAccessType() {
        return accessType;
    }

    public void setAccessType(AccessType accessType) {
        this.accessType = accessType;
    }

    public Date getCreated_at() {
        return created_at;
    }

    public void setCreated_at(Date created_at) {
        this.created_at = created_at;
    }

    public Grade getGrade() {
        return grade;
    }

    public void setGrade(Grade grade) {
        this.grade = grade;
    }

    public boolean isIsActive() {
        return isActive;
    }

    public void setIsActive(boolean isActive) {
        this.isActive = isActive;
    }

    public TuteType getTuteType() {
        return tuteType;
    }

    public void setTuteType(TuteType tuteType) {
        this.tuteType = tuteType;
    }

    public java.util.Set<Grade> getGrades() {
        return grades;
    }

    public void setGrades(java.util.Set<Grade> grades) {
        this.grades = grades;
    }
}
