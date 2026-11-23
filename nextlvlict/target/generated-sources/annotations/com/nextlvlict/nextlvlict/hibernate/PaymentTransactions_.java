package com.nextlvlict.nextlvlict.hibernate;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.util.Date;

@StaticMetamodel(PaymentTransactions.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class PaymentTransactions_ {

	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PaymentTransactions#amount
	 **/
	public static volatile SingularAttribute<PaymentTransactions, Double> amount;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PaymentTransactions#verificationNotes
	 **/
	public static volatile SingularAttribute<PaymentTransactions, String> verificationNotes;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PaymentTransactions#student
	 **/
	public static volatile SingularAttribute<PaymentTransactions, Students> student;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PaymentTransactions#verificationStatus
	 **/
	public static volatile SingularAttribute<PaymentTransactions, String> verificationStatus;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PaymentTransactions#description
	 **/
	public static volatile SingularAttribute<PaymentTransactions, String> description;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PaymentTransactions#verifiedBy
	 **/
	public static volatile SingularAttribute<PaymentTransactions, String> verifiedBy;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PaymentTransactions#transactionId
	 **/
	public static volatile SingularAttribute<PaymentTransactions, String> transactionId;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PaymentTransactions#verificationDate
	 **/
	public static volatile SingularAttribute<PaymentTransactions, Date> verificationDate;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PaymentTransactions#createdAt
	 **/
	public static volatile SingularAttribute<PaymentTransactions, Date> createdAt;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PaymentTransactions#paymentMethod
	 **/
	public static volatile SingularAttribute<PaymentTransactions, String> paymentMethod;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PaymentTransactions#currency
	 **/
	public static volatile SingularAttribute<PaymentTransactions, String> currency;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PaymentTransactions#id
	 **/
	public static volatile SingularAttribute<PaymentTransactions, Integer> id;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PaymentTransactions
	 **/
	public static volatile EntityType<PaymentTransactions> class_;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PaymentTransactions#updatedAt
	 **/
	public static volatile SingularAttribute<PaymentTransactions, Date> updatedAt;

	public static final String AMOUNT = "amount";
	public static final String VERIFICATION_NOTES = "verificationNotes";
	public static final String STUDENT = "student";
	public static final String VERIFICATION_STATUS = "verificationStatus";
	public static final String DESCRIPTION = "description";
	public static final String VERIFIED_BY = "verifiedBy";
	public static final String TRANSACTION_ID = "transactionId";
	public static final String VERIFICATION_DATE = "verificationDate";
	public static final String CREATED_AT = "createdAt";
	public static final String PAYMENT_METHOD = "paymentMethod";
	public static final String CURRENCY = "currency";
	public static final String ID = "id";
	public static final String UPDATED_AT = "updatedAt";

}

