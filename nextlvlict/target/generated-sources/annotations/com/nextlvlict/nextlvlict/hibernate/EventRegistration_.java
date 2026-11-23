package com.nextlvlict.nextlvlict.hibernate;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.math.BigDecimal;
import java.util.Date;

@StaticMetamodel(EventRegistration.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class EventRegistration_ {

	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.EventRegistration#eventId
	 **/
	public static volatile SingularAttribute<EventRegistration, Integer> eventId;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.EventRegistration#qrCodeData
	 **/
	public static volatile SingularAttribute<EventRegistration, String> qrCodeData;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.EventRegistration#nic
	 **/
	public static volatile SingularAttribute<EventRegistration, String> nic;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.EventRegistration#transactionId
	 **/
	public static volatile SingularAttribute<EventRegistration, String> transactionId;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.EventRegistration#createdAt
	 **/
	public static volatile SingularAttribute<EventRegistration, Date> createdAt;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.EventRegistration#amountPaid
	 **/
	public static volatile SingularAttribute<EventRegistration, BigDecimal> amountPaid;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.EventRegistration#registrationNumber
	 **/
	public static volatile SingularAttribute<EventRegistration, String> registrationNumber;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.EventRegistration#grade
	 **/
	public static volatile SingularAttribute<EventRegistration, String> grade;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.EventRegistration#name
	 **/
	public static volatile SingularAttribute<EventRegistration, String> name;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.EventRegistration#contactNumber
	 **/
	public static volatile SingularAttribute<EventRegistration, String> contactNumber;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.EventRegistration#id
	 **/
	public static volatile SingularAttribute<EventRegistration, Integer> id;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.EventRegistration#paymentDate
	 **/
	public static volatile SingularAttribute<EventRegistration, Date> paymentDate;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.EventRegistration
	 **/
	public static volatile EntityType<EventRegistration> class_;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.EventRegistration#paymentStatus
	 **/
	public static volatile SingularAttribute<EventRegistration, String> paymentStatus;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.EventRegistration#updatedAt
	 **/
	public static volatile SingularAttribute<EventRegistration, Date> updatedAt;

	public static final String EVENT_ID = "eventId";
	public static final String QR_CODE_DATA = "qrCodeData";
	public static final String NIC = "nic";
	public static final String TRANSACTION_ID = "transactionId";
	public static final String CREATED_AT = "createdAt";
	public static final String AMOUNT_PAID = "amountPaid";
	public static final String REGISTRATION_NUMBER = "registrationNumber";
	public static final String GRADE = "grade";
	public static final String NAME = "name";
	public static final String CONTACT_NUMBER = "contactNumber";
	public static final String ID = "id";
	public static final String PAYMENT_DATE = "paymentDate";
	public static final String PAYMENT_STATUS = "paymentStatus";
	public static final String UPDATED_AT = "updatedAt";

}

