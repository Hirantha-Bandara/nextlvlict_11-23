package com.nextlvlict.nextlvlict.hibernate;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.util.Date;

@StaticMetamodel(Recording_Request.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class Recording_Request_ {

	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Recording_Request#expires_at
	 **/
	public static volatile SingularAttribute<Recording_Request, Date> expires_at;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Recording_Request#student
	 **/
	public static volatile SingularAttribute<Recording_Request, Students> student;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Recording_Request#request_date
	 **/
	public static volatile SingularAttribute<Recording_Request, Date> request_date;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Recording_Request#recording
	 **/
	public static volatile SingularAttribute<Recording_Request, Recordings> recording;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Recording_Request#recording_status
	 **/
	public static volatile SingularAttribute<Recording_Request, Recording_Status> recording_status;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Recording_Request#id
	 **/
	public static volatile SingularAttribute<Recording_Request, Integer> id;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Recording_Request#is_paid
	 **/
	public static volatile SingularAttribute<Recording_Request, Integer> is_paid;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Recording_Request#unlocked_at
	 **/
	public static volatile SingularAttribute<Recording_Request, Date> unlocked_at;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Recording_Request
	 **/
	public static volatile EntityType<Recording_Request> class_;

	public static final String EXPIRES_AT = "expires_at";
	public static final String STUDENT = "student";
	public static final String REQUEST_DATE = "request_date";
	public static final String RECORDING = "recording";
	public static final String RECORDING_STATUS = "recording_status";
	public static final String ID = "id";
	public static final String IS_PAID = "is_paid";
	public static final String UNLOCKED_AT = "unlocked_at";

}

