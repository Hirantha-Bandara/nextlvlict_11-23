package com.nextlvlict.nextlvlict.hibernate;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.util.Date;

@StaticMetamodel(FreeLesson.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class FreeLesson_ {

	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.FreeLesson#createdAt
	 **/
	public static volatile SingularAttribute<FreeLesson, Date> createdAt;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.FreeLesson#unitLabel
	 **/
	public static volatile SingularAttribute<FreeLesson, String> unitLabel;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.FreeLesson#youtubeUrl
	 **/
	public static volatile SingularAttribute<FreeLesson, String> youtubeUrl;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.FreeLesson#displayOrder
	 **/
	public static volatile SingularAttribute<FreeLesson, Integer> displayOrder;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.FreeLesson#id
	 **/
	public static volatile SingularAttribute<FreeLesson, Integer> id;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.FreeLesson#title
	 **/
	public static volatile SingularAttribute<FreeLesson, String> title;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.FreeLesson#isActive
	 **/
	public static volatile SingularAttribute<FreeLesson, Boolean> isActive;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.FreeLesson
	 **/
	public static volatile EntityType<FreeLesson> class_;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.FreeLesson#updatedAt
	 **/
	public static volatile SingularAttribute<FreeLesson, Date> updatedAt;

	public static final String CREATED_AT = "createdAt";
	public static final String UNIT_LABEL = "unitLabel";
	public static final String YOUTUBE_URL = "youtubeUrl";
	public static final String DISPLAY_ORDER = "displayOrder";
	public static final String ID = "id";
	public static final String TITLE = "title";
	public static final String IS_ACTIVE = "isActive";
	public static final String UPDATED_AT = "updatedAt";

}

