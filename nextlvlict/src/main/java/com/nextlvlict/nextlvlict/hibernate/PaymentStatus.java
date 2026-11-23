package com.nextlvlict.nextlvlict.hibernate;

import jakarta.persistence.*;

@Entity
@Table(name = "payment_status")
public class PaymentStatus {

    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "value", length = 255)
    private String value;

    // Convenience constants
    public static final int PENDING = 1;
    public static final int PAID = 2;
    public static final int FAILED = 3;
    public static final int REFUNDED = 4;
    public static final int CANCELLED = 5;

    // Constructors
    public PaymentStatus() {}

    public PaymentStatus(Integer id) {
        this.id = id;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    // Helper methods
    public boolean isPending() {
        return id != null && id == PENDING;
    }

    public boolean isPaid() {
        return id != null && id == PAID;
    }

    @Override
    public String toString() {
        return value != null ? value : "UNKNOWN";
    }
}
