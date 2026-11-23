package com.nextlvlict.nextlvlict.hibernate;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.util.Date;

@StaticMetamodel(OLTimetable.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class OLTimetable_ {

	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.OLTimetable#createdAt
	 **/
	public static volatile SingularAttribute<OLTimetable, Date> createdAt;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.OLTimetable#grade
	 **/
	public static volatile SingularAttribute<OLTimetable, String> grade;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.OLTimetable#classGroup
	 **/
	public static volatile SingularAttribute<OLTimetable, String> classGroup;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.OLTimetable#displayOrder
	 **/
	public static volatile SingularAttribute<OLTimetable, Integer> displayOrder;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.OLTimetable#location
	 **/
	public static volatile SingularAttribute<OLTimetable, String> location;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.OLTimetable#id
	 **/
	public static volatile SingularAttribute<OLTimetable, Integer> id;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.OLTimetable#time
	 **/
	public static volatile SingularAttribute<OLTimetable, String> time;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.OLTimetable#isActive
	 **/
	public static volatile SingularAttribute<OLTimetable, Boolean> isActive;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.OLTimetable
	 **/
	public static volatile EntityType<OLTimetable> class_;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.OLTimetable#branch
	 **/
	public static volatile SingularAttribute<OLTimetable, String> branch;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.OLTimetable#updatedAt
	 **/
	public static volatile SingularAttribute<OLTimetable, Date> updatedAt;

	public static final String CREATED_AT = "createdAt";
	public static final String GRADE = "grade";
	public static final String CLASS_GROUP = "classGroup";
	public static final String DISPLAY_ORDER = "displayOrder";
	public static final String LOCATION = "location";
	public static final String ID = "id";
	public static final String TIME = "time";
	public static final String IS_ACTIVE = "isActive";
	public static final String BRANCH = "branch";
	public static final String UPDATED_AT = "updatedAt";

}

