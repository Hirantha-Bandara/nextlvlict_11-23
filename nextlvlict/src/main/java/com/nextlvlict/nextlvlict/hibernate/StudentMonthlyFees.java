package com.nextlvlict.nextlvlict.hibernate;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "student_monthly_fees")
public class StudentMonthlyFees {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "student_id", referencedColumnName = "id")
    private Students student;

    @ManyToOne
    @JoinColumn(name = "grade_id", referencedColumnName = "id")
    private Grade grade;

    @ManyToOne
    @JoinColumn(name = "class_type_id", referencedColumnName = "id")
    private ClassType classType;

    @Column(name = "month_year", length = 7)
    private String monthYear;

    @Column(name = "fee_amount")
    private Double feeAmount;

    @ManyToOne
    @JoinColumn(name = "status_id", referencedColumnName = "id")
    private PaymentStatus status;

    @Temporal(TemporalType.DATE)
    @Column(name = "due_date")
    private Date dueDate;

    @Temporal(TemporalType.DATE)
    @Column(name = "paid_date")
    private Date paidDate;

    @Column(name = "transaction_id", length = 100)
    private String transactionId;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at")
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "updated_at")
    private Date updatedAt;

    // Helper method to check if paid
    public boolean isPaid() {
        return status != null && status.isPaid();
    }

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Students getStudent() { return student; }
    public void setStudent(Students student) { this.student = student; }

    public Grade getGrade() { return grade; }
    public void setGrade(Grade grade) { this.grade = grade; }

    public ClassType getClassType() { return classType; }
    public void setClassType(ClassType classType) { this.classType = classType; }

    public String getMonthYear() { return monthYear; }
    public void setMonthYear(String monthYear) { this.monthYear = monthYear; }

    public Double getFeeAmount() { return feeAmount; }
    public void setFeeAmount(Double feeAmount) { this.feeAmount = feeAmount; }

    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus status) { this.status = status; }

    public Date getDueDate() { return dueDate; }
    public void setDueDate(Date dueDate) { this.dueDate = dueDate; }

    public Date getPaidDate() { return paidDate; }
    public void setPaidDate(Date paidDate) { this.paidDate = paidDate; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }
}
