package com.nextlvlict.nextlvlict.hibernate;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.util.Date;

@StaticMetamodel(Tutes_Request.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class Tutes_Request_ {

	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Tutes_Request#student
	 **/
	public static volatile SingularAttribute<Tutes_Request, Students> student;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Tutes_Request#request_date
	 **/
	public static volatile SingularAttribute<Tutes_Request, Date> request_date;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Tutes_Request#tutes
	 **/
	public static volatile SingularAttribute<Tutes_Request, Tutes> tutes;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Tutes_Request#tuteStatus
	 **/
	public static volatile SingularAttribute<Tutes_Request, TutesStatus> tuteStatus;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Tutes_Request#id
	 **/
	public static volatile SingularAttribute<Tutes_Request, Integer> id;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Tutes_Request
	 **/
	public static volatile EntityType<Tutes_Request> class_;

	public static final String STUDENT = "student";
	public static final String REQUEST_DATE = "request_date";
	public static final String TUTES = "tutes";
	public static final String TUTE_STATUS = "tuteStatus";
	public static final String ID = "id";

}

