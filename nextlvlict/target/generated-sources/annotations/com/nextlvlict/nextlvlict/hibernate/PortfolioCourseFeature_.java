package com.nextlvlict.nextlvlict.hibernate;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.util.Date;

@StaticMetamodel(PortfolioCourseFeature.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class PortfolioCourseFeature_ {

	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioCourseFeature#createdAt
	 **/
	public static volatile SingularAttribute<PortfolioCourseFeature, Date> createdAt;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioCourseFeature#featureText
	 **/
	public static volatile SingularAttribute<PortfolioCourseFeature, String> featureText;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioCourseFeature#displayOrder
	 **/
	public static volatile SingularAttribute<PortfolioCourseFeature, Integer> displayOrder;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioCourseFeature#id
	 **/
	public static volatile SingularAttribute<PortfolioCourseFeature, Integer> id;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioCourseFeature#isActive
	 **/
	public static volatile SingularAttribute<PortfolioCourseFeature, Boolean> isActive;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioCourseFeature
	 **/
	public static volatile EntityType<PortfolioCourseFeature> class_;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioCourseFeature#courseId
	 **/
	public static volatile SingularAttribute<PortfolioCourseFeature, Integer> courseId;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioCourseFeature#updatedAt
	 **/
	public static volatile SingularAttribute<PortfolioCourseFeature, Date> updatedAt;

	public static final String CREATED_AT = "createdAt";
	public static final String FEATURE_TEXT = "featureText";
	public static final String DISPLAY_ORDER = "displayOrder";
	public static final String ID = "id";
	public static final String IS_ACTIVE = "isActive";
	public static final String COURSE_ID = "courseId";
	public static final String UPDATED_AT = "updatedAt";

}

