package com.nextlvlict.nextlvlict.hibernate;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SetAttribute;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.util.Date;

@StaticMetamodel(Students.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class Students_ {

	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Students#free_card
	 **/
	public static volatile SingularAttribute<Students, Integer> free_card;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Students#is_active
	 **/
	public static volatile SingularAttribute<Students, Integer> is_active;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Students#address
	 **/
	public static volatile SingularAttribute<Students, Address> address;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Students#date_of_birth
	 **/
	public static volatile SingularAttribute<Students, Date> date_of_birth;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Students#mobile
	 **/
	public static volatile SingularAttribute<Students, String> mobile;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Students#last_name
	 **/
	public static volatile SingularAttribute<Students, String> last_name;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Students#created_at
	 **/
	public static volatile SingularAttribute<Students, Date> created_at;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Students#nic
	 **/
	public static volatile SingularAttribute<Students, String> nic;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Students#password
	 **/
	public static volatile SingularAttribute<Students, String> password;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Students#recordingRequests
	 **/
	public static volatile SetAttribute<Students, Recording_Request> recordingRequests;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Students#school
	 **/
	public static volatile SingularAttribute<Students, String> school;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Students#grade
	 **/
	public static volatile SingularAttribute<Students, Grade> grade;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Students#id
	 **/
	public static volatile SingularAttribute<Students, String> id;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Students
	 **/
	public static volatile EntityType<Students> class_;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Students#first_name
	 **/
	public static volatile SingularAttribute<Students, String> first_name;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Students#email
	 **/
	public static volatile SingularAttribute<Students, String> email;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Students#classType
	 **/
	public static volatile SingularAttribute<Students, ClassType> classType;

	public static final String FREE_CARD = "free_card";
	public static final String IS_ACTIVE = "is_active";
	public static final String ADDRESS = "address";
	public static final String DATE_OF_BIRTH = "date_of_birth";
	public static final String MOBILE = "mobile";
	public static final String LAST_NAME = "last_name";
	public static final String CREATED_AT = "created_at";
	public static final String NIC = "nic";
	public static final String PASSWORD = "password";
	public static final String RECORDING_REQUESTS = "recordingRequests";
	public static final String SCHOOL = "school";
	public static final String GRADE = "grade";
	public static final String ID = "id";
	public static final String FIRST_NAME = "first_name";
	public static final String EMAIL = "email";
	public static final String CLASS_TYPE = "classType";

}

