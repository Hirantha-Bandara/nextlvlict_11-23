package com.nextlvlict.nextlvlict.hibernate;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SetAttribute;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.util.Date;

@StaticMetamodel(Tutes.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class Tutes_ {

	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Tutes#coverImageUrl
	 **/
	public static volatile SingularAttribute<Tutes, String> coverImageUrl;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Tutes#tuteType
	 **/
	public static volatile SingularAttribute<Tutes, TuteType> tuteType;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Tutes#link
	 **/
	public static volatile SingularAttribute<Tutes, String> link;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Tutes#description
	 **/
	public static volatile SingularAttribute<Tutes, String> description;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Tutes#created_at
	 **/
	public static volatile SingularAttribute<Tutes, Date> created_at;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Tutes#grades
	 **/
	public static volatile SetAttribute<Tutes, Grade> grades;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Tutes#title
	 **/
	public static volatile SingularAttribute<Tutes, String> title;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Tutes#isActive
	 **/
	public static volatile SingularAttribute<Tutes, Boolean> isActive;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Tutes#accessType
	 **/
	public static volatile SingularAttribute<Tutes, AccessType> accessType;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Tutes#price
	 **/
	public static volatile SingularAttribute<Tutes, Double> price;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Tutes#grade
	 **/
	public static volatile SingularAttribute<Tutes, Grade> grade;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Tutes#id
	 **/
	public static volatile SingularAttribute<Tutes, Integer> id;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Tutes
	 **/
	public static volatile EntityType<Tutes> class_;

	public static final String COVER_IMAGE_URL = "coverImageUrl";
	public static final String TUTE_TYPE = "tuteType";
	public static final String LINK = "link";
	public static final String DESCRIPTION = "description";
	public static final String CREATED_AT = "created_at";
	public static final String GRADES = "grades";
	public static final String TITLE = "title";
	public static final String IS_ACTIVE = "isActive";
	public static final String ACCESS_TYPE = "accessType";
	public static final String PRICE = "price";
	public static final String GRADE = "grade";
	public static final String ID = "id";

}

