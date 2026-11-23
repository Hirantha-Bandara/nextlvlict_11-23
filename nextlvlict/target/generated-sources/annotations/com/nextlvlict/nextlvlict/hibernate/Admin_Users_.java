package com.nextlvlict.nextlvlict.hibernate;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.util.Date;

@StaticMetamodel(Admin_Users.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class Admin_Users_ {

	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Admin_Users#password
	 **/
	public static volatile SingularAttribute<Admin_Users, String> password;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Admin_Users#is_active
	 **/
	public static volatile SingularAttribute<Admin_Users, Integer> is_active;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Admin_Users#created_at
	 **/
	public static volatile SingularAttribute<Admin_Users, Date> created_at;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Admin_Users#id
	 **/
	public static volatile SingularAttribute<Admin_Users, Integer> id;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Admin_Users
	 **/
	public static volatile EntityType<Admin_Users> class_;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Admin_Users#email
	 **/
	public static volatile SingularAttribute<Admin_Users, String> email;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.Admin_Users#username
	 **/
	public static volatile SingularAttribute<Admin_Users, String> username;

	public static final String PASSWORD = "password";
	public static final String IS_ACTIVE = "is_active";
	public static final String CREATED_AT = "created_at";
	public static final String ID = "id";
	public static final String EMAIL = "email";
	public static final String USERNAME = "username";

}

