package com.nextlvlict.nextlvlict.hibernate;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(BundleLesson.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class BundleLesson_ {

	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.BundleLesson#youtubeUrl
	 **/
	public static volatile SingularAttribute<BundleLesson, String> youtubeUrl;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.BundleLesson#bundleId
	 **/
	public static volatile SingularAttribute<BundleLesson, Integer> bundleId;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.BundleLesson#displayOrder
	 **/
	public static volatile SingularAttribute<BundleLesson, Integer> displayOrder;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.BundleLesson#description
	 **/
	public static volatile SingularAttribute<BundleLesson, String> description;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.BundleLesson#id
	 **/
	public static volatile SingularAttribute<BundleLesson, Integer> id;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.BundleLesson#title
	 **/
	public static volatile SingularAttribute<BundleLesson, String> title;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.BundleLesson#isActive
	 **/
	public static volatile SingularAttribute<BundleLesson, Integer> isActive;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.BundleLesson
	 **/
	public static volatile EntityType<BundleLesson> class_;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.BundleLesson#bundle
	 **/
	public static volatile SingularAttribute<BundleLesson, RecordingBundle> bundle;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.BundleLesson#thumbnailUrl
	 **/
	public static volatile SingularAttribute<BundleLesson, String> thumbnailUrl;

	public static final String YOUTUBE_URL = "youtubeUrl";
	public static final String BUNDLE_ID = "bundleId";
	public static final String DISPLAY_ORDER = "displayOrder";
	public static final String DESCRIPTION = "description";
	public static final String ID = "id";
	public static final String TITLE = "title";
	public static final String IS_ACTIVE = "isActive";
	public static final String BUNDLE = "bundle";
	public static final String THUMBNAIL_URL = "thumbnailUrl";

}

