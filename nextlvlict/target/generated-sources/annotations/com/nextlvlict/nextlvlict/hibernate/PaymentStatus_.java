package com.nextlvlict.nextlvlict.hibernate;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(PaymentStatus.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class PaymentStatus_ {

	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PaymentStatus#id
	 **/
	public static volatile SingularAttribute<PaymentStatus, Integer> id;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PaymentStatus
	 **/
	public static volatile EntityType<PaymentStatus> class_;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.PaymentStatus#value
	 **/
	public static volatile SingularAttribute<PaymentStatus, String> value;

	public static final String ID = "id";
	public static final String VALUE = "value";

}

