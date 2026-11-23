package com.nextlvlict.nextlvlict.hibernate;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.util.Date;

@StaticMetamodel(OfflinePaymentSubmission.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class OfflinePaymentSubmission_ {

	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.OfflinePaymentSubmission#student
	 **/
	public static volatile SingularAttribute<OfflinePaymentSubmission, Students> student;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.OfflinePaymentSubmission#transactionReference
	 **/
	public static volatile SingularAttribute<OfflinePaymentSubmission, String> transactionReference;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.OfflinePaymentSubmission#reviewedAt
	 **/
	public static volatile SingularAttribute<OfflinePaymentSubmission, Date> reviewedAt;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.OfflinePaymentSubmission#r2FileSize
	 **/
	public static volatile SingularAttribute<OfflinePaymentSubmission, Long> r2FileSize;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.OfflinePaymentSubmission#bankName
	 **/
	public static volatile SingularAttribute<OfflinePaymentSubmission, String> bankName;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.OfflinePaymentSubmission#reviewedBy
	 **/
	public static volatile SingularAttribute<OfflinePaymentSubmission, Admin_Users> reviewedBy;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.OfflinePaymentSubmission#r2ContentType
	 **/
	public static volatile SingularAttribute<OfflinePaymentSubmission, String> r2ContentType;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.OfflinePaymentSubmission#amountPaid
	 **/
	public static volatile SingularAttribute<OfflinePaymentSubmission, Double> amountPaid;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.OfflinePaymentSubmission#submissionStatus
	 **/
	public static volatile SingularAttribute<OfflinePaymentSubmission, String> submissionStatus;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.OfflinePaymentSubmission#r2FileName
	 **/
	public static volatile SingularAttribute<OfflinePaymentSubmission, String> r2FileName;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.OfflinePaymentSubmission#r2ObjectKey
	 **/
	public static volatile SingularAttribute<OfflinePaymentSubmission, String> r2ObjectKey;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.OfflinePaymentSubmission#paymentMethod
	 **/
	public static volatile SingularAttribute<OfflinePaymentSubmission, String> paymentMethod;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.OfflinePaymentSubmission#id
	 **/
	public static volatile SingularAttribute<OfflinePaymentSubmission, Integer> id;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.OfflinePaymentSubmission#paymentDate
	 **/
	public static volatile SingularAttribute<OfflinePaymentSubmission, Date> paymentDate;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.OfflinePaymentSubmission#rejectionReason
	 **/
	public static volatile SingularAttribute<OfflinePaymentSubmission, String> rejectionReason;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.OfflinePaymentSubmission#submittedAt
	 **/
	public static volatile SingularAttribute<OfflinePaymentSubmission, Date> submittedAt;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.OfflinePaymentSubmission#paymentTransaction
	 **/
	public static volatile SingularAttribute<OfflinePaymentSubmission, PaymentTransactions> paymentTransaction;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.OfflinePaymentSubmission
	 **/
	public static volatile EntityType<OfflinePaymentSubmission> class_;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.OfflinePaymentSubmission#monthlyFee
	 **/
	public static volatile SingularAttribute<OfflinePaymentSubmission, StudentMonthlyFees> monthlyFee;

	public static final String STUDENT = "student";
	public static final String TRANSACTION_REFERENCE = "transactionReference";
	public static final String REVIEWED_AT = "reviewedAt";
	public static final String R2_FILE_SIZE = "r2FileSize";
	public static final String BANK_NAME = "bankName";
	public static final String REVIEWED_BY = "reviewedBy";
	public static final String R2_CONTENT_TYPE = "r2ContentType";
	public static final String AMOUNT_PAID = "amountPaid";
	public static final String SUBMISSION_STATUS = "submissionStatus";
	public static final String R2_FILE_NAME = "r2FileName";
	public static final String R2_OBJECT_KEY = "r2ObjectKey";
	public static final String PAYMENT_METHOD = "paymentMethod";
	public static final String ID = "id";
	public static final String PAYMENT_DATE = "paymentDate";
	public static final String REJECTION_REASON = "rejectionReason";
	public static final String SUBMITTED_AT = "submittedAt";
	public static final String PAYMENT_TRANSACTION = "paymentTransaction";
	public static final String MONTHLY_FEE = "monthlyFee";

}

