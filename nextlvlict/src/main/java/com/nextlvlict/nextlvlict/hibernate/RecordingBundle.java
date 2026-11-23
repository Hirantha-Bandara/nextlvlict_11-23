package com.nextlvlict.nextlvlict.hibernate;

import com.google.gson.annotations.Expose;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.Set;

@Entity
@Table(name = "recording_bundles")
public class RecordingBundle implements Serializable {

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
    @Column(name = "price")
    private double price;

    @Expose
    @Enumerated(EnumType.STRING)
    @Column(name = "access_type")
    private AccessType accessType = AccessType.PAID;

    @Expose
    @Column(name = "is_active")
    private int is_active = 1;

    @Expose
    @Column(name = "thumbnail_url")
    private String thumbnail_url;

    @Expose
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", updatable = false)
    private Date created_at = new Date();

    @Expose
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "grade_id")
    private Grade grade;

    @Expose
    @OneToMany(mappedBy = "bundle", cascade = CascadeType.ALL, orphanRemoval = true, targetEntity = BundleLesson.class)
    private java.util.Set<BundleLesson> bundleLessons;

    public RecordingBundle() {
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

    public int getIs_active() {
        return is_active;
    }

    public void setIs_active(int is_active) {
        this.is_active = is_active;
    }

    public String getThumbnail_url() {
        return thumbnail_url;
    }

    public void setThumbnail_url(String thumbnail_url) {
        this.thumbnail_url = thumbnail_url;
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

    public java.util.Set<BundleLesson> getBundleLessons() {
        return bundleLessons;
    }

    public void setBundleLessons(java.util.Set<BundleLesson> bundleLessons) {
        this.bundleLessons = bundleLessons;
    }
}
