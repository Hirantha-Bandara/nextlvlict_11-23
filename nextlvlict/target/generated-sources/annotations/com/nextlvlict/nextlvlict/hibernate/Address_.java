package com.nextlvlict.nextlvlict.hibernate;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(Address.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class Address_ {

	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Address#provinces
	 **/
	public static volatile SingularAttribute<Address, Provinces> provinces;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Address#city
	 **/
	public static volatile SingularAttribute<Address, String> city;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Address#postalcode
	 **/
	public static volatile SingularAttribute<Address, String> postalcode;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Address#districts
	 **/
	public static volatile SingularAttribute<Address, Districts> districts;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Address#id
	 **/
	public static volatile SingularAttribute<Address, String> id;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Address
	 **/
	public static volatile EntityType<Address> class_;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Address#line2
	 **/
	public static volatile SingularAttribute<Address, String> line2;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Address#line1
	 **/
	public static volatile SingularAttribute<Address, String> line1;

	public static final String PROVINCES = "provinces";
	public static final String CITY = "city";
	public static final String POSTALCODE = "postalcode";
	public static final String DISTRICTS = "districts";
	public static final String ID = "id";
	public static final String LINE2 = "line2";
	public static final String LINE1 = "line1";

}

