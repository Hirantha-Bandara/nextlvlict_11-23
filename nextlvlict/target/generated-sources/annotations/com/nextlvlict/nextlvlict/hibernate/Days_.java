package com.nextlvlict.nextlvlict.hibernate;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(Days.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class Days_ {

	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Days#name
	 **/
	public static volatile SingularAttribute<Days, String> name;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Days#id
	 **/
	public static volatile SingularAttribute<Days, Integer> id;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Days
	 **/
	public static volatile EntityType<Days> class_;

	public static final String NAME = "name";
	public static final String ID = "id";

}

