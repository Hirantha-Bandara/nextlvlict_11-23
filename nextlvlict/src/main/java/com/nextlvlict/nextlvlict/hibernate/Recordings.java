package com.nextlvlict.nextlvlict.hibernate;

import com.google.gson.annotations.Expose;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "recordings")
public class Recordings implements Serializable {

    @Expose
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Expose
    @Column(name = "title")
    private String title;

    @Expose
    @Column(name = "description")
    private String description;

    @Expose
    @Column(name = "youtube_url")
    private String youtube_url;

    @Expose
    @Column(name = "thumbnail_url")
    private String thumbnail_url;

    @Expose
    @Column(name = "is_active")
    private int is_active = 1;

    @Expose
    @Column(name = "price")
    private double price;

    @Expose
    @Enumerated(EnumType.STRING)
    @Column(name = "access_type")
    private AccessType accessType = AccessType.PAID;

    @Expose
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", updatable = false)
    private Date created_at = new Date();

    @Expose
    // Legacy single grade field (kept for backward compatibility)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "grade_id")
    private Grade grade;

    // New ManyToMany relationship for multiple grades support
    @Expose
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "recording_grades",
        joinColumns = @JoinColumn(name = "recording_id", referencedColumnName = "id"),
        inverseJoinColumns = @JoinColumn(name = "grade_id", referencedColumnName = "id")
    )
    private java.util.Set<Grade> grades = new java.util.HashSet<>();

    public Recordings() {
    }

    /**
     * @return the id
     */
    public int getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * @return the title
     */
    public String getTitle() {
        return title;
    }

    /**
     * @param title the title to set
     */
    public void setTitle(String title) {
        this.title = title;
    }

    /**
     * @return the description
     */
    public String getDescription() {
        return description;
    }

    /**
     * @param description the description to set
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * @return the youtube_url
     */
    public String getYoutube_url() {
        return youtube_url;
    }

    /**
     * @param youtube_url the youtube_url to set
     */
    public void setYoutube_url(String youtube_url) {
        this.youtube_url = youtube_url;
    }

    /**
     * @return the thumbnail_url
     */
    public String getThumbnail_url() {
        return thumbnail_url;
    }

    /**
     * @param thumbnail_url the thumbnail_url to set
     */
    public void setThumbnail_url(String thumbnail_url) {
        this.thumbnail_url = thumbnail_url;
    }

    /**
     * @return the is_active
     */
    public int getIs_active() {
        return is_active;
    }

    /**
     * @param is_active the is_active to set
     */
    public void setIs_active(int is_active) {
        this.is_active = is_active;
    }

    /**
     * @return the price
     */
    public double getPrice() {
        return price;
    }

    /**
     * @param price the price to set
     */
    public void setPrice(double price) {
        this.price = price;
    }

    /**
     * @return the accessType
     */
    public AccessType getAccessType() {
        return accessType;
    }

    /**
     * @param accessType the accessType to set
     */
    public void setAccessType(AccessType accessType) {
        this.accessType = accessType;
    }

    /**
     * @return the created_at
     */
    public Date getCreated_at() {
        return created_at;
    }

    /**
     * @param created_at the created_at to set
     */
    public void setCreated_at(Date created_at) {
        this.created_at = created_at;
    }

    /**
     * @return the grade
     */
    public Grade getGrade() {
        return grade;
    }

    /**
     * @param grade the grade to set
     */
    public void setGrade(Grade grade) {
        this.grade = grade;
    }

    /**
     * @return the grades
     */
    public java.util.Set<Grade> getGrades() {
        return grades;
    }

    /**
     * @param grades the grades to set
     */
    public void setGrades(java.util.Set<Grade> grades) {
        this.grades = grades;
    }

}

