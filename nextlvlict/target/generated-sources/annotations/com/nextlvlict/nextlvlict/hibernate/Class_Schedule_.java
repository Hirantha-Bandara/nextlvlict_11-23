package com.nextlvlict.nextlvlict.hibernate;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.util.Date;

@StaticMetamodel(Class_Schedule.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class Class_Schedule_ {

	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Class_Schedule#start_time
	 **/
	public static volatile SingularAttribute<Class_Schedule, String> start_time;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Class_Schedule#is_active
	 **/
	public static volatile SingularAttribute<Class_Schedule, Integer> is_active;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Class_Schedule#updated_at
	 **/
	public static volatile SingularAttribute<Class_Schedule, Date> updated_at;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Class_Schedule#zoom_link
	 **/
	public static volatile SingularAttribute<Class_Schedule, String> zoom_link;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Class_Schedule#grade
	 **/
	public static volatile SingularAttribute<Class_Schedule, Grade> grade;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Class_Schedule#end_time
	 **/
	public static volatile SingularAttribute<Class_Schedule, String> end_time;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Class_Schedule#created_at
	 **/
	public static volatile SingularAttribute<Class_Schedule, Date> created_at;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Class_Schedule#days
	 **/
	public static volatile SingularAttribute<Class_Schedule, Days> days;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Class_Schedule#description
	 **/
	public static volatile SingularAttribute<Class_Schedule, String> description;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Class_Schedule#id
	 **/
	public static volatile SingularAttribute<Class_Schedule, Integer> id;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Class_Schedule
	 **/
	public static volatile EntityType<Class_Schedule> class_;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Class_Schedule#classType
	 **/
	public static volatile SingularAttribute<Class_Schedule, ClassType> classType;

	public static final String START_TIME = "start_time";
	public static final String IS_ACTIVE = "is_active";
	public static final String UPDATED_AT = "updated_at";
	public static final String ZOOM_LINK = "zoom_link";
	public static final String GRADE = "grade";
	public static final String END_TIME = "end_time";
	public static final String CREATED_AT = "created_at";
	public static final String DAYS = "days";
	public static final String DESCRIPTION = "description";
	public static final String ID = "id";
	public static final String CLASS_TYPE = "classType";

}

