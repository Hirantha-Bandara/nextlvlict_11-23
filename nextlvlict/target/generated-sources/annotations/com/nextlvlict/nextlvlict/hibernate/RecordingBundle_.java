package com.nextlvlict.nextlvlict.hibernate;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SetAttribute;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.util.Date;

@StaticMetamodel(RecordingBundle.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class RecordingBundle_ {

	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.RecordingBundle#accessType
	 **/
	public static volatile SingularAttribute<RecordingBundle, AccessType> accessType;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.RecordingBundle#is_active
	 **/
	public static volatile SingularAttribute<RecordingBundle, Integer> is_active;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.RecordingBundle#price
	 **/
	public static volatile SingularAttribute<RecordingBundle, Double> price;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.RecordingBundle#grade
	 **/
	public static volatile SingularAttribute<RecordingBundle, Grade> grade;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.RecordingBundle#bundleLessons
	 **/
	public static volatile SetAttribute<RecordingBundle, BundleLesson> bundleLessons;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.RecordingBundle#description
	 **/
	public static volatile SingularAttribute<RecordingBundle, String> description;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.RecordingBundle#created_at
	 **/
	public static volatile SingularAttribute<RecordingBundle, Date> created_at;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.RecordingBundle#id
	 **/
	public static volatile SingularAttribute<RecordingBundle, Integer> id;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.RecordingBundle#title
	 **/
	public static volatile SingularAttribute<RecordingBundle, String> title;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.RecordingBundle#thumbnail_url
	 **/
	public static volatile SingularAttribute<RecordingBundle, String> thumbnail_url;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.RecordingBundle
	 **/
	public static volatile EntityType<RecordingBundle> class_;

	public static final String ACCESS_TYPE = "accessType";
	public static final String IS_ACTIVE = "is_active";
	public static final String PRICE = "price";
	public static final String GRADE = "grade";
	public static final String BUNDLE_LESSONS = "bundleLessons";
	public static final String DESCRIPTION = "description";
	public static final String CREATED_AT = "created_at";
	public static final String ID = "id";
	public static final String TITLE = "title";
	public static final String THUMBNAIL_URL = "thumbnail_url";

}

