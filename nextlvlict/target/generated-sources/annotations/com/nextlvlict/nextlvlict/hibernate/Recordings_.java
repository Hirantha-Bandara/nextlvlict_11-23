package com.nextlvlict.nextlvlict.hibernate;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SetAttribute;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.util.Date;

@StaticMetamodel(Recordings.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class Recordings_ {

	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Recordings#accessType
	 **/
	public static volatile SingularAttribute<Recordings, AccessType> accessType;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Recordings#is_active
	 **/
	public static volatile SingularAttribute<Recordings, Integer> is_active;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Recordings#price
	 **/
	public static volatile SingularAttribute<Recordings, Double> price;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Recordings#grade
	 **/
	public static volatile SingularAttribute<Recordings, Grade> grade;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Recordings#description
	 **/
	public static volatile SingularAttribute<Recordings, String> description;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Recordings#created_at
	 **/
	public static volatile SingularAttribute<Recordings, Date> created_at;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Recordings#id
	 **/
	public static volatile SingularAttribute<Recordings, Integer> id;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Recordings#grades
	 **/
	public static volatile SetAttribute<Recordings, Grade> grades;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Recordings#title
	 **/
	public static volatile SingularAttribute<Recordings, String> title;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Recordings#youtube_url
	 **/
	public static volatile SingularAttribute<Recordings, String> youtube_url;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Recordings#thumbnail_url
	 **/
	public static volatile SingularAttribute<Recordings, String> thumbnail_url;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Recordings
	 **/
	public static volatile EntityType<Recordings> class_;

	public static final String ACCESS_TYPE = "accessType";
	public static final String IS_ACTIVE = "is_active";
	public static final String PRICE = "price";
	public static final String GRADE = "grade";
	public static final String DESCRIPTION = "description";
	public static final String CREATED_AT = "created_at";
	public static final String ID = "id";
	public static final String GRADES = "grades";
	public static final String TITLE = "title";
	public static final String YOUTUBE_URL = "youtube_url";
	public static final String THUMBNAIL_URL = "thumbnail_url";

}

