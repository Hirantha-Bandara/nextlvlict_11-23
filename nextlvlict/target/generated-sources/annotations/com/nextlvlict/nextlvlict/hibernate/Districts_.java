package com.nextlvlict.nextlvlict.hibernate;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(Districts.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class Districts_ {

	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Districts#name
	 **/
	public static volatile SingularAttribute<Districts, String> name;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Districts#id
	 **/
	public static volatile SingularAttribute<Districts, String> id;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Districts
	 **/
	public static volatile EntityType<Districts> class_;

	public static final String NAME = "name";
	public static final String ID = "id";

}

