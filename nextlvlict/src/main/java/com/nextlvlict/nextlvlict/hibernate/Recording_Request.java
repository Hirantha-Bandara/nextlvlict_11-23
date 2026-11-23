package com.nextlvlict.nextlvlict.hibernate;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "recording_request")
public class Recording_Request implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @ManyToOne
    @JoinColumn(name = "students_id")
    private Students student;

    @ManyToOne
    @JoinColumn(name = "recordings_id")
    private Recordings recording;

    @ManyToOne
    @JoinColumn(name = "recording_status_id")
    private Recording_Status recording_status;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "request_date")
    private Date request_date;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "unlocked_at")
    private Date unlocked_at;

    @Column(name = "is_paid")
    private int is_paid;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "expires_at")
    private Date expires_at;

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
     * @return the student
     */
    public Students getStudent() {
        return student;
    }

    /**
     * @param student the student to set
     */
    public void setStudent(Students student) {
        this.student = student;
    }

    /**
     * @return the recording
     */
    public Recordings getRecording() {
        return recording;
    }

    /**
     * @param recording the recording to set
     */
    public void setRecording(Recordings recording) {
        this.recording = recording;
    }

    /**
     * @return the recording_status
     */
    public Recording_Status getRecording_status() {
        return recording_status;
    }

    /**
     * @param recording_status the recording_status to set
     */
    public void setRecording_status(Recording_Status recording_status) {
        this.recording_status = recording_status;
    }

    /**
     * @return the request_date
     */
    public Date getRequest_date() {
        return request_date;
    }

    /**
     * @param request_date the request_date to set
     */
    public void setRequest_date(Date request_date) {
        this.request_date = request_date;
    }

    /**
     * @return the unlocked_at
     */
    public Date getUnlocked_at() {
        return unlocked_at;
    }

    /**
     * @param unlocked_at the unlocked_at to set
     */
    public void setUnlocked_at(Date unlocked_at) {
        this.unlocked_at = unlocked_at;
    }

    /**
     * @return the is_paid
     */
    public int getIs_paid() {
        return is_paid;
    }

    /**
     * @param is_paid the is_paid to set
     */
    public void setIs_paid(int is_paid) {
        this.is_paid = is_paid;
    }

    /**
     * @return the expires_at
     */
    public Date getExpires_at() {
        return expires_at;
    }

    /**
     * @param expires_at the expires_at to set
     */
    public void setExpires_at(Date expires_at) {
        this.expires_at = expires_at;
    }

}

