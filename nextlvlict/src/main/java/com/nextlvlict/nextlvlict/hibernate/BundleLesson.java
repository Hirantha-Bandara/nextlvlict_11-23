package com.nextlvlict.nextlvlict.hibernate;

import com.google.gson.annotations.Expose;
import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "bundle_lessons")
public class BundleLesson implements Serializable {

    @Expose
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Expose
    @Column(name = "bundle_id")
    private int bundleId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bundle_id", insertable = false, updatable = false)
    private RecordingBundle bundle;

    @Expose
    @Column(name = "title")
    private String title;

    @Expose
    @Column(name = "description")
    private String description;

    @Expose
    @Column(name = "youtube_url")
    private String youtubeUrl;

    @Expose
    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @Expose
    @Column(name = "display_order")
    private int displayOrder = 0;

    @Expose
    @Column(name = "is_active")
    private int isActive = 1;

    public BundleLesson() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getBundleId() {
        return bundleId;
    }

    public void setBundleId(int bundleId) {
        this.bundleId = bundleId;
    }

    public RecordingBundle getBundle() {
        return bundle;
    }

    public void setBundle(RecordingBundle bundle) {
        this.bundle = bundle;
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

    public String getYoutubeUrl() {
        return youtubeUrl;
    }

    public void setYoutubeUrl(String youtubeUrl) {
        this.youtubeUrl = youtubeUrl;
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public int getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(int displayOrder) {
        this.displayOrder = displayOrder;
    }

    public int getIsActive() {
        return isActive;
    }

    public void setIsActive(int isActive) {
        this.isActive = isActive;
    }
}
