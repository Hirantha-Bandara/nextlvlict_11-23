package com.nextlvlict.nextlvlict.hibernate;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "class_schedule")
public class Class_Schedule implements Serializable {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "start_time")
    private String start_time;

    @Column(name = "end_time", nullable = false)
    private String end_time;

    @Column(name = "is_active")
    private int is_active = 1;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", updatable = false)
    private Date created_at = new Date();
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "updated_at")
    private Date updated_at = new Date();

    @ManyToOne
    @JoinColumn(name = "grade_id")
    private Grade grade;
    
    @ManyToOne
    @JoinColumn(name = "days_id")
    private Days days;

    @ManyToOne
    @JoinColumn(name = "class_type_id")
    private ClassType classType;

    @Column(name = "zoom_link")
    private String zoom_link;
    
    @Column(name = "description")
    private String description;

    public Class_Schedule() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getStart_time() {
        return start_time;
    }

    public void setStart_time(String start_time) {
        this.start_time = start_time;
    }

    public String getEnd_time() {
        return end_time;
    }

    public void setEnd_time(String end_time) {
        this.end_time = end_time;
    }

    public int getIs_active() {
        return is_active;
    }

    public void setIs_active(int is_active) {
        this.is_active = is_active;
    }

    public Date getCreated_at() {
        return created_at;
    }

    public void setCreated_at(Date created_at) {
        this.created_at = created_at;
    }

    public Date getUpdated_at() {
        return updated_at;
    }

    public void setUpdated_at(Date updated_at) {
        this.updated_at = updated_at;
    }

    public Grade getGrade() {
        return grade;
    }

    public void setGrade(Grade grade) {
        this.grade = grade;
    }

    public Days getDays() {
        return days;
    }

    public void setDays(Days days) {
        this.days = days;
    }

    public ClassType getClassType() {
        return classType;
    }

    public void setClassType(ClassType classType) {
        this.classType = classType;
    }

    /**
     * @return the zoom_link
     */
    public String getZoom_link() {
        return zoom_link;
    }

    /**
     * @param zoom_link the zoom_link to set
     */
    public void setZoom_link(String zoom_link) {
        this.zoom_link = zoom_link;
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
}
