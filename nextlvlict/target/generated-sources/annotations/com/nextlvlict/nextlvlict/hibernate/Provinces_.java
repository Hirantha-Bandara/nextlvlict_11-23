package com.nextlvlict.nextlvlict.hibernate;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(Provinces.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class Provinces_ {

	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Provinces#name
	 **/
	public static volatile SingularAttribute<Provinces, String> name;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Provinces#id
	 **/
	public static volatile SingularAttribute<Provinces, String> id;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Provinces
	 **/
	public static volatile EntityType<Provinces> class_;

	public static final String NAME = "name";
	public static final String ID = "id";

}

