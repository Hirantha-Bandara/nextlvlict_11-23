package com.nextlvlict.nextlvlict.hibernate;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.util.Date;

@StaticMetamodel(PortfolioEvent.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class PortfolioEvent_ {

	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioEvent#date
	 **/
	public static volatile SingularAttribute<PortfolioEvent, String> date;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioEvent#image
	 **/
	public static volatile SingularAttribute<PortfolioEvent, String> image;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioEvent#fee
	 **/
	public static volatile SingularAttribute<PortfolioEvent, String> fee;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioEvent#displayOrder
	 **/
	public static volatile SingularAttribute<PortfolioEvent, Integer> displayOrder;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioEvent#description
	 **/
	public static volatile SingularAttribute<PortfolioEvent, String> description;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioEvent#title
	 **/
	public static volatile SingularAttribute<PortfolioEvent, String> title;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioEvent#fullDescription
	 **/
	public static volatile SingularAttribute<PortfolioEvent, String> fullDescription;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioEvent#isActive
	 **/
	public static volatile SingularAttribute<PortfolioEvent, Boolean> isActive;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioEvent#createdAt
	 **/
	public static volatile SingularAttribute<PortfolioEvent, Date> createdAt;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioEvent#location
	 **/
	public static volatile SingularAttribute<PortfolioEvent, String> location;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioEvent#id
	 **/
	public static volatile SingularAttribute<PortfolioEvent, Integer> id;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioEvent#time
	 **/
	public static volatile SingularAttribute<PortfolioEvent, String> time;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioEvent
	 **/
	public static volatile EntityType<PortfolioEvent> class_;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioEvent#updatedAt
	 **/
	public static volatile SingularAttribute<PortfolioEvent, Date> updatedAt;

	public static final String DATE = "date";
	public static final String IMAGE = "image";
	public static final String FEE = "fee";
	public static final String DISPLAY_ORDER = "displayOrder";
	public static final String DESCRIPTION = "description";
	public static final String TITLE = "title";
	public static final String FULL_DESCRIPTION = "fullDescription";
	public static final String IS_ACTIVE = "isActive";
	public static final String CREATED_AT = "createdAt";
	public static final String LOCATION = "location";
	public static final String ID = "id";
	public static final String TIME = "time";
	public static final String UPDATED_AT = "updatedAt";

}

