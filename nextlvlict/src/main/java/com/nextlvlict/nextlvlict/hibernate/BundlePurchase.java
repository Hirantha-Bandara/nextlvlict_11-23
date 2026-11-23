package com.nextlvlict.nextlvlict.hibernate;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "bundle_purchases")
public class BundlePurchase implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bundle_id", insertable = false, updatable = false)
    private RecordingBundle bundle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "students_id", insertable = false, updatable = false)
    private Students student;

    @Column(name = "bundle_id")
    private int bundleId;

    @Column(name = "students_id")
    private String studentsId;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "purchase_date")
    private Date purchase_date;

    @Column(name = "payment_status")
    private String payment_status = "COMPLETED";

    @Column(name = "order_id")
    private String order_id;

    @Column(name = "amount_paid")
    private double amount_paid;

    public BundlePurchase() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public RecordingBundle getBundle() {
        return bundle;
    }

    public void setBundle(RecordingBundle bundle) {
        this.bundle = bundle;
    }

    public Students getStudent() {
        return student;
    }

    public void setStudent(Students student) {
        this.student = student;
    }

    public int getBundleId() {
        return bundleId;
    }

    public void setBundleId(int bundleId) {
        this.bundleId = bundleId;
    }

    public String getStudentsId() {
        return studentsId;
    }

    public void setStudentsId(String studentsId) {
        this.studentsId = studentsId;
    }

    public Date getPurchase_date() {
        return purchase_date;
    }

    public void setPurchase_date(Date purchase_date) {
        this.purchase_date = purchase_date;
    }

    public String getPayment_status() {
        return payment_status;
    }

    public void setPayment_status(String payment_status) {
        this.payment_status = payment_status;
    }

    public String getOrder_id() {
        return order_id;
    }

    public void setOrder_id(String order_id) {
        this.order_id = order_id;
    }

    public double getAmount_paid() {
        return amount_paid;
    }

    public void setAmount_paid(double amount_paid) {
        this.amount_paid = amount_paid;
    }
}
