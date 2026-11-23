package com.nextlvlict.nextlvlict.hibernate;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.util.Date;

@StaticMetamodel(TuteType.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class TuteType_ {

	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.TuteType#createdAt
	 **/
	public static volatile SingularAttribute<TuteType, Date> createdAt;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.TuteType#name
	 **/
	public static volatile SingularAttribute<TuteType, String> name;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.TuteType#description
	 **/
	public static volatile SingularAttribute<TuteType, String> description;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.TuteType#id
	 **/
	public static volatile SingularAttribute<TuteType, Integer> id;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.TuteType#isActive
	 **/
	public static volatile SingularAttribute<TuteType, Boolean> isActive;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.TuteType
	 **/
	public static volatile EntityType<TuteType> class_;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.TuteType#updatedAt
	 **/
	public static volatile SingularAttribute<TuteType, Date> updatedAt;

	public static final String CREATED_AT = "createdAt";
	public static final String NAME = "name";
	public static final String DESCRIPTION = "description";
	public static final String ID = "id";
	public static final String IS_ACTIVE = "isActive";
	public static final String UPDATED_AT = "updatedAt";

}

