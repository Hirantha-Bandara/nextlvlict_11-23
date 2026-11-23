package com.nextlvlict.nextlvlict.hibernate;

import jakarta.persistence.*;
import java.util.Date;

/**
 * Hibernate entity for offline payment submissions
 * Represents student payment slip uploads for bank transfer/ATM payments
 */
@Entity
@Table(name = "offline_payment_submissions")
public class OfflinePaymentSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "student_id", referencedColumnName = "id")
    private Students student;

    @ManyToOne
    @JoinColumn(name = "monthly_fee_id", referencedColumnName = "id")
    private StudentMonthlyFees monthlyFee;

    @Column(name = "payment_method", nullable = false, length = 50)
    private String paymentMethod;

    @Column(name = "amount_paid", nullable = false)
    private Double amountPaid;

    @Temporal(TemporalType.DATE)
    @Column(name = "payment_date", nullable = false)
    private Date paymentDate;

    @Column(name = "transaction_reference", length = 100)
    private String transactionReference;

    @Column(name = "bank_name", length = 100)
    private String bankName;

    @Column(name = "r2_object_key", nullable = false, length = 500)
    private String r2ObjectKey;

    @Column(name = "r2_file_name", length = 255)
    private String r2FileName;

    @Column(name = "r2_file_size")
    private Long r2FileSize;

    @Column(name = "r2_content_type", length = 100)
    private String r2ContentType;

    @Column(name = "submission_status", nullable = false, length = 50)
    private String submissionStatus = "PENDING_REVIEW";

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "submitted_at", nullable = false, updatable = false)
    private Date submittedAt;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "reviewed_at")
    private Date reviewedAt;

    @ManyToOne
    @JoinColumn(name = "reviewed_by", referencedColumnName = "id")
    private Admin_Users reviewedBy;

    @ManyToOne
    @JoinColumn(name = "payment_transaction_id", referencedColumnName = "id")
    private PaymentTransactions paymentTransaction;

    // Payment method constants
    public static final String METHOD_BANK_TRANSFER = "BANK_TRANSFER";
    public static final String METHOD_ATM_DEPOSIT = "ATM_DEPOSIT";
    public static final String METHOD_ATM_TRANSFER = "ATM_TRANSFER";

    // Submission status constants
    public static final String STATUS_PENDING_REVIEW = "PENDING_REVIEW";
    public static final String STATUS_APPROVED = "APPROVED";
    public static final String STATUS_REJECTED = "REJECTED";

    // Constructors
    public OfflinePaymentSubmission() {
        this.submittedAt = new Date();
        this.submissionStatus = STATUS_PENDING_REVIEW;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Students getStudent() {
        return student;
    }

    public void setStudent(Students student) {
        this.student = student;
    }

    public StudentMonthlyFees getMonthlyFee() {
        return monthlyFee;
    }

    public void setMonthlyFee(StudentMonthlyFees monthlyFee) {
        this.monthlyFee = monthlyFee;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public Double getAmountPaid() {
        return amountPaid;
    }

    public void setAmountPaid(Double amountPaid) {
        this.amountPaid = amountPaid;
    }

    public Date getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(Date paymentDate) {
        this.paymentDate = paymentDate;
    }

    public String getTransactionReference() {
        return transactionReference;
    }

    public void setTransactionReference(String transactionReference) {
        this.transactionReference = transactionReference;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public String getR2ObjectKey() {
        return r2ObjectKey;
    }

    public void setR2ObjectKey(String r2ObjectKey) {
        this.r2ObjectKey = r2ObjectKey;
    }

    public String getR2FileName() {
        return r2FileName;
    }

    public void setR2FileName(String r2FileName) {
        this.r2FileName = r2FileName;
    }

    public Long getR2FileSize() {
        return r2FileSize;
    }

    public void setR2FileSize(Long r2FileSize) {
        this.r2FileSize = r2FileSize;
    }

    public String getR2ContentType() {
        return r2ContentType;
    }

    public void setR2ContentType(String r2ContentType) {
        this.r2ContentType = r2ContentType;
    }

    public String getSubmissionStatus() {
        return submissionStatus;
    }

    public void setSubmissionStatus(String submissionStatus) {
        this.submissionStatus = submissionStatus;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public Date getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(Date submittedAt) {
        this.submittedAt = submittedAt;
    }

    public Date getReviewedAt() {
        return reviewedAt;
    }

    public void setReviewedAt(Date reviewedAt) {
        this.reviewedAt = reviewedAt;
    }

    public Admin_Users getReviewedBy() {
        return reviewedBy;
    }

    public void setReviewedBy(Admin_Users reviewedBy) {
        this.reviewedBy = reviewedBy;
    }

    public PaymentTransactions getPaymentTransaction() {
        return paymentTransaction;
    }

    public void setPaymentTransaction(PaymentTransactions paymentTransaction) {
        this.paymentTransaction = paymentTransaction;
    }

    // Helper methods
    public boolean isPendingReview() {
        return STATUS_PENDING_REVIEW.equals(submissionStatus);
    }

    public boolean isApproved() {
        return STATUS_APPROVED.equals(submissionStatus);
    }

    public boolean isRejected() {
        return STATUS_REJECTED.equals(submissionStatus);
    }
}
