package com.nextlvlict.nextlvlict.hibernate;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.Set;

@Entity
@Table(name = "students")
public class Students implements Serializable {

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "first_name", nullable = false)
    private String first_name;

    @Column(name = "last_name", nullable = false)
    private String last_name;

    @Column(name = "email")
    private String email;

    @Column(name = "mobile")
    private String mobile;

    @Column(name = "password")
    private String password;

    @Column(name = "is_active")
    private int is_active;

    @Column(name = "created_at")
    private Date created_at;

    @ManyToOne
    @JoinColumn(name = "grade_id")
    private Grade grade;

    @Column(name = "date_of_birth")
    private Date date_of_birth;

    @Column(name = "school")
    private String school;

    @Column(name = "nic")
    private String nic;

    @Column(name = "free_card")
    private int free_card;

    @ManyToOne
    @JoinColumn(name = "class_type_id")
    private ClassType classType;

    @ManyToOne
    @JoinColumn(name = "address_id")
    private Address address;

    // Add this field to the Students class
    @OneToMany(mappedBy = "student")
    private Set<Recording_Request> recordingRequests;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFirst_name() {
        return first_name;
    }

    public void setFirst_name(String first_name) {
        this.first_name = first_name;
    }

    public String getLast_name() {
        return last_name;
    }

    public void setLast_name(String last_name) {
        this.last_name = last_name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public Grade getGrade() {
        return grade;
    }

    public void setGrade(Grade grade) {
        this.grade = grade;
    }

    public Set<Recording_Request> getRecordingRequests() {
        return recordingRequests;
    }

    public void setRecordingRequests(Set<Recording_Request> recordingRequests) {
        this.recordingRequests = recordingRequests;
    }

    /**
     * @return the date_of_birth
     */
    public Date getDate_of_birth() {
        return date_of_birth;
    }

    /**
     * @param date_of_birth the date_of_birth to set
     */
    public void setDate_of_birth(Date date_of_birth) {
        this.date_of_birth = date_of_birth;
    }

    /**
     * @return the school
     */
    public String getSchool() {
        return school;
    }

    /**
     * @param school the school to set
     */
    public void setSchool(String school) {
        this.school = school;
    }

    /**
     * @return the nic
     */
    public String getNic() {
        return nic;
    }

    /**
     * @param nic the nic to set
     */
    public void setNic(String nic) {
        this.nic = nic;
    }

    /**
     * @return the free_card
     */
    public int getFree_card() {
        return free_card;
    }

    /**
     * @param free_card the free_card to set
     */
    public void setFree_card(int free_card) {
        this.free_card = free_card;
    }

    /**
     * @return the classType
     */
    public ClassType getClassType() {
        return classType;
    }

    /**
     * @param classType the classType to set
     */
    public void setClassType(ClassType classType) {
        this.classType = classType;
    }

    /**
     * @return the address
     */
    public Address getAddress() {
        return address;
    }

    /**
     * @param address the address to set
     */
    public void setAddress(Address address) {
        this.address = address;
    }

}
