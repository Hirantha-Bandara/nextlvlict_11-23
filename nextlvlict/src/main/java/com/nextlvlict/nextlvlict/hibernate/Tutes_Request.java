package com.nextlvlict.nextlvlict.hibernate;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "tutes_request")
public class Tutes_Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "request_date")
    private Date request_date;

    @ManyToOne
    @JoinColumn(name = "tutes_id")
    private Tutes tutes;

    @ManyToOne
    @JoinColumn(name = "tutes_status_id")
    private TutesStatus tuteStatus;

    @ManyToOne
    @JoinColumn(name = "students_id")
    private Students student;

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
     * @return the tutes
     */
    public Tutes getTutes() {
        return tutes;
    }

    /**
     * @param tutes the tutes to set
     */
    public void setTutes(Tutes tutes) {
        this.tutes = tutes;
    }

    /**
     * @return the tuteStatus
     */
    public TutesStatus getTuteStatus() {
        return tuteStatus;
    }

    /**
     * @param tuteStatus the tuteStatus to set
     */
    public void setTuteStatus(TutesStatus tuteStatus) {
        this.tuteStatus = tuteStatus;
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

}

