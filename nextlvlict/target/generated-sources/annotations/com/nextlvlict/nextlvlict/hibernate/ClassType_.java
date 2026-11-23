package com.nextlvlict.nextlvlict.hibernate;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.util.Date;

@StaticMetamodel(ClassType.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class ClassType_ {

	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.ClassType#createdAt
	 **/
	public static volatile SingularAttribute<ClassType, Date> createdAt;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.ClassType#name
	 **/
	public static volatile SingularAttribute<ClassType, String> name;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.ClassType#description
	 **/
	public static volatile SingularAttribute<ClassType, String> description;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.ClassType#id
	 **/
	public static volatile SingularAttribute<ClassType, Integer> id;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.ClassType#isActive
	 **/
	public static volatile SingularAttribute<ClassType, Integer> isActive;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.ClassType
	 **/
	public static volatile EntityType<ClassType> class_;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.ClassType#updatedAt
	 **/
	public static volatile SingularAttribute<ClassType, Date> updatedAt;

	public static final String CREATED_AT = "createdAt";
	public static final String NAME = "name";
	public static final String DESCRIPTION = "description";
	public static final String ID = "id";
	public static final String IS_ACTIVE = "isActive";
	public static final String UPDATED_AT = "updatedAt";

}

