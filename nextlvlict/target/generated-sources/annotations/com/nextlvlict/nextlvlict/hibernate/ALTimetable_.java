package com.nextlvlict.nextlvlict.hibernate;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.util.Date;

@StaticMetamodel(ALTimetable.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class ALTimetable_ {

	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.ALTimetable#createdAt
	 **/
	public static volatile SingularAttribute<ALTimetable, Date> createdAt;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.ALTimetable#year
	 **/
	public static volatile SingularAttribute<ALTimetable, String> year;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.ALTimetable#displayOrder
	 **/
	public static volatile SingularAttribute<ALTimetable, Integer> displayOrder;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.ALTimetable#id
	 **/
	public static volatile SingularAttribute<ALTimetable, Integer> id;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.ALTimetable#time
	 **/
	public static volatile SingularAttribute<ALTimetable, String> time;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.ALTimetable#isActive
	 **/
	public static volatile SingularAttribute<ALTimetable, Boolean> isActive;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.ALTimetable
	 **/
	public static volatile EntityType<ALTimetable> class_;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.ALTimetable#branch
	 **/
	public static volatile SingularAttribute<ALTimetable, String> branch;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.ALTimetable#classType
	 **/
	public static volatile SingularAttribute<ALTimetable, String> classType;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.ALTimetable#updatedAt
	 **/
	public static volatile SingularAttribute<ALTimetable, Date> updatedAt;

	public static final String CREATED_AT = "createdAt";
	public static final String YEAR = "year";
	public static final String DISPLAY_ORDER = "displayOrder";
	public static final String ID = "id";
	public static final String TIME = "time";
	public static final String IS_ACTIVE = "isActive";
	public static final String BRANCH = "branch";
	public static final String CLASS_TYPE = "classType";
	public static final String UPDATED_AT = "updatedAt";

}

