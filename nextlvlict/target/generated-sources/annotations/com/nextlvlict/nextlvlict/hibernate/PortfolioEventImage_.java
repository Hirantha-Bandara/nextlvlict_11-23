package com.nextlvlict.nextlvlict.hibernate;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.util.Date;

@StaticMetamodel(PortfolioEventImage.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class PortfolioEventImage_ {

	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioEventImage#eventId
	 **/
	public static volatile SingularAttribute<PortfolioEventImage, Integer> eventId;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioEventImage#createdAt
	 **/
	public static volatile SingularAttribute<PortfolioEventImage, Date> createdAt;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioEventImage#imageUrl
	 **/
	public static volatile SingularAttribute<PortfolioEventImage, String> imageUrl;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioEventImage#displayOrder
	 **/
	public static volatile SingularAttribute<PortfolioEventImage, Integer> displayOrder;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioEventImage#id
	 **/
	public static volatile SingularAttribute<PortfolioEventImage, Integer> id;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioEventImage#isActive
	 **/
	public static volatile SingularAttribute<PortfolioEventImage, Boolean> isActive;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioEventImage
	 **/
	public static volatile EntityType<PortfolioEventImage> class_;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioEventImage#updatedAt
	 **/
	public static volatile SingularAttribute<PortfolioEventImage, Date> updatedAt;

	public static final String EVENT_ID = "eventId";
	public static final String CREATED_AT = "createdAt";
	public static final String IMAGE_URL = "imageUrl";
	public static final String DISPLAY_ORDER = "displayOrder";
	public static final String ID = "id";
	public static final String IS_ACTIVE = "isActive";
	public static final String UPDATED_AT = "updatedAt";

}

