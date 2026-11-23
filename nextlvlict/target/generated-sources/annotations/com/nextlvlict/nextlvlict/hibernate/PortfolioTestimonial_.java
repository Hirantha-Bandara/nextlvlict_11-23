package com.nextlvlict.nextlvlict.hibernate;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.util.Date;

@StaticMetamodel(PortfolioTestimonial.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class PortfolioTestimonial_ {

	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioTestimonial#image
	 **/
	public static volatile SingularAttribute<PortfolioTestimonial, String> image;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioTestimonial#createdAt
	 **/
	public static volatile SingularAttribute<PortfolioTestimonial, Date> createdAt;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioTestimonial#role
	 **/
	public static volatile SingularAttribute<PortfolioTestimonial, String> role;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioTestimonial#name
	 **/
	public static volatile SingularAttribute<PortfolioTestimonial, String> name;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioTestimonial#displayOrder
	 **/
	public static volatile SingularAttribute<PortfolioTestimonial, Integer> displayOrder;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioTestimonial#id
	 **/
	public static volatile SingularAttribute<PortfolioTestimonial, Integer> id;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioTestimonial#text
	 **/
	public static volatile SingularAttribute<PortfolioTestimonial, String> text;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioTestimonial#isActive
	 **/
	public static volatile SingularAttribute<PortfolioTestimonial, Boolean> isActive;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioTestimonial
	 **/
	public static volatile EntityType<PortfolioTestimonial> class_;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioTestimonial#updatedAt
	 **/
	public static volatile SingularAttribute<PortfolioTestimonial, Date> updatedAt;

	public static final String IMAGE = "image";
	public static final String CREATED_AT = "createdAt";
	public static final String ROLE = "role";
	public static final String NAME = "name";
	public static final String DISPLAY_ORDER = "displayOrder";
	public static final String ID = "id";
	public static final String TEXT = "text";
	public static final String IS_ACTIVE = "isActive";
	public static final String UPDATED_AT = "updatedAt";

}

