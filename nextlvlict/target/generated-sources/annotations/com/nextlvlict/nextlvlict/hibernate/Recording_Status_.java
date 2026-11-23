package com.nextlvlict.nextlvlict.hibernate;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(Recording_Status.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class Recording_Status_ {

	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Recording_Status#id
	 **/
	public static volatile SingularAttribute<Recording_Status, Integer> id;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Recording_Status
	 **/
	public static volatile EntityType<Recording_Status> class_;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Recording_Status#value
	 **/
	public static volatile SingularAttribute<Recording_Status, String> value;

	public static final String ID = "id";
	public static final String VALUE = "value";

}

