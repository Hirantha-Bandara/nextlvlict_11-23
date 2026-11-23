package com.nextlvlict.nextlvlict.hibernate;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(Status.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class Status_ {

	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Status#name
	 **/
	public static volatile SingularAttribute<Status, String> name;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Status#id
	 **/
	public static volatile SingularAttribute<Status, String> id;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Status
	 **/
	public static volatile EntityType<Status> class_;

	public static final String NAME = "name";
	public static final String ID = "id";

}

