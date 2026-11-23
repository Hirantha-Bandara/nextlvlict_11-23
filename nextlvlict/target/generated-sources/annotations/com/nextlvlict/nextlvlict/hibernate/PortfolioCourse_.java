package com.nextlvlict.nextlvlict.hibernate;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.util.Date;

@StaticMetamodel(PortfolioCourse.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class PortfolioCourse_ {

	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioCourse#createdAt
	 **/
	public static volatile SingularAttribute<PortfolioCourse, Date> createdAt;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioCourse#icon
	 **/
	public static volatile SingularAttribute<PortfolioCourse, String> icon;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioCourse#displayOrder
	 **/
	public static volatile SingularAttribute<PortfolioCourse, Integer> displayOrder;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioCourse#description
	 **/
	public static volatile SingularAttribute<PortfolioCourse, String> description;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioCourse#id
	 **/
	public static volatile SingularAttribute<PortfolioCourse, Integer> id;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioCourse#title
	 **/
	public static volatile SingularAttribute<PortfolioCourse, String> title;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioCourse#isActive
	 **/
	public static volatile SingularAttribute<PortfolioCourse, Boolean> isActive;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioCourse
	 **/
	public static volatile EntityType<PortfolioCourse> class_;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioCourse#updatedAt
	 **/
	public static volatile SingularAttribute<PortfolioCourse, Date> updatedAt;

	public static final String CREATED_AT = "createdAt";
	public static final String ICON = "icon";
	public static final String DISPLAY_ORDER = "displayOrder";
	public static final String DESCRIPTION = "description";
	public static final String ID = "id";
	public static final String TITLE = "title";
	public static final String IS_ACTIVE = "isActive";
	public static final String UPDATED_AT = "updatedAt";

}

