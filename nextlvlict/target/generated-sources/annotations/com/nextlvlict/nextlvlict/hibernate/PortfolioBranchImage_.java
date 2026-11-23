package com.nextlvlict.nextlvlict.hibernate;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.util.Date;

@StaticMetamodel(PortfolioBranchImage.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class PortfolioBranchImage_ {

	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioBranchImage#createdAt
	 **/
	public static volatile SingularAttribute<PortfolioBranchImage, Date> createdAt;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioBranchImage#imageUrl
	 **/
	public static volatile SingularAttribute<PortfolioBranchImage, String> imageUrl;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioBranchImage#branchName
	 **/
	public static volatile SingularAttribute<PortfolioBranchImage, String> branchName;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioBranchImage#id
	 **/
	public static volatile SingularAttribute<PortfolioBranchImage, Integer> id;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioBranchImage#isActive
	 **/
	public static volatile SingularAttribute<PortfolioBranchImage, Boolean> isActive;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioBranchImage
	 **/
	public static volatile EntityType<PortfolioBranchImage> class_;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PortfolioBranchImage#updatedAt
	 **/
	public static volatile SingularAttribute<PortfolioBranchImage, Date> updatedAt;

	public static final String CREATED_AT = "createdAt";
	public static final String IMAGE_URL = "imageUrl";
	public static final String BRANCH_NAME = "branchName";
	public static final String ID = "id";
	public static final String IS_ACTIVE = "isActive";
	public static final String UPDATED_AT = "updatedAt";

}

