package com.nextlvlict.nextlvlict.hibernate;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "event_registrations")
public class EventRegistration {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;
    
    @Column(name = "event_id")
    private int eventId;
    
    @Column(name = "registration_number", unique = true, nullable = false, length = 50)
    private String registrationNumber;
    
    @Column(name = "name", nullable = false, length = 255)
    private String name;
    
    @Column(name = "contact_number", nullable = false, length = 20)
    private String contactNumber;
    
    @Column(name = "grade", nullable = false, length = 50)
    private String grade;
    
    @Column(name = "nic", length = 20)
    private String nic;
    
    @Column(name = "payment_status", nullable = false, length = 50)
    private String paymentStatus = "PENDING";
    
    @Column(name = "transaction_id", length = 100)
    private String transactionId;
    
    @Column(name = "amount_paid", precision = 10, scale = 2)
    private BigDecimal amountPaid = BigDecimal.ZERO;
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "payment_date")
    private Date paymentDate;
    
    @Column(name = "qr_code_data", columnDefinition = "TEXT")
    private String qrCodeData;
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at")
    private Date createdAt = new Date();
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "updated_at")
    private Date updatedAt = new Date();
    
    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    
    public int getEventId() { return eventId; }
    public void setEventId(int eventId) { this.eventId = eventId; }
    
    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
    
    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }
    
    public String getNic() { return nic; }
    public void setNic(String nic) { this.nic = nic; }
    
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
    
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    
    public BigDecimal getAmountPaid() { return amountPaid; }
    public void setAmountPaid(BigDecimal amountPaid) { this.amountPaid = amountPaid; }
    
    public Date getPaymentDate() { return paymentDate; }
    public void setPaymentDate(Date paymentDate) { this.paymentDate = paymentDate; }
    
    public String getQrCodeData() { return qrCodeData; }
    public void setQrCodeData(String qrCodeData) { this.qrCodeData = qrCodeData; }
    
    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
    
    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }
}
