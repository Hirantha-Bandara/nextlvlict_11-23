package com.nextlvlict.nextlvlict.hibernate;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(TutesStatus.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class TutesStatus_ {

	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.TutesStatus#id
	 **/
	public static volatile SingularAttribute<TutesStatus, Integer> id;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.TutesStatus
	 **/
	public static volatile EntityType<TutesStatus> class_;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.TutesStatus#value
	 **/
	public static volatile SingularAttribute<TutesStatus, String> value;

	public static final String ID = "id";
	public static final String VALUE = "value";

}

