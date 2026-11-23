package com.nextlvlict.nextlvlict.hibernate;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.util.Date;

@StaticMetamodel(PortfolioGalleryImage.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class PortfolioGalleryImage_ {

	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioGalleryImage#createdAt
	 **/
	public static volatile SingularAttribute<PortfolioGalleryImage, Date> createdAt;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioGalleryImage#imageUrl
	 **/
	public static volatile SingularAttribute<PortfolioGalleryImage, String> imageUrl;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioGalleryImage#displayOrder
	 **/
	public static volatile SingularAttribute<PortfolioGalleryImage, Integer> displayOrder;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioGalleryImage#id
	 **/
	public static volatile SingularAttribute<PortfolioGalleryImage, Integer> id;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioGalleryImage#isActive
	 **/
	public static volatile SingularAttribute<PortfolioGalleryImage, Boolean> isActive;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioGalleryImage
	 **/
	public static volatile EntityType<PortfolioGalleryImage> class_;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioGalleryImage#updatedAt
	 **/
	public static volatile SingularAttribute<PortfolioGalleryImage, Date> updatedAt;

	public static final String CREATED_AT = "createdAt";
	public static final String IMAGE_URL = "imageUrl";
	public static final String DISPLAY_ORDER = "displayOrder";
	public static final String ID = "id";
	public static final String IS_ACTIVE = "isActive";
	public static final String UPDATED_AT = "updatedAt";

}

