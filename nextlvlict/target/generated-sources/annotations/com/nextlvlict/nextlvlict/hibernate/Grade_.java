package com.nextlvlict.nextlvlict.hibernate;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(Grade.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class Grade_ {

	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Grade#is_active
	 **/
	public static volatile SingularAttribute<Grade, Integer> is_active;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Grade#ol_or_al
	 **/
	public static volatile SingularAttribute<Grade, Ol_or_Al> ol_or_al;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Grade#fee
	 **/
	public static volatile SingularAttribute<Grade, Double> fee;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Grade#name
	 **/
	public static volatile SingularAttribute<Grade, String> name;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Grade#id
	 **/
	public static volatile SingularAttribute<Grade, Integer> id;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Grade
	 **/
	public static volatile EntityType<Grade> class_;

	public static final String IS_ACTIVE = "is_active";
	public static final String OL_OR_AL = "ol_or_al";
	public static final String FEE = "fee";
	public static final String NAME = "name";
	public static final String ID = "id";

}

