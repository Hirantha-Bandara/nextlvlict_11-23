package com.nextlvlict.nextlvlict.hibernate;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.util.Date;

@StaticMetamodel(GradeClassFee.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class GradeClassFee_ {

	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.GradeClassFee#createdAt
	 **/
	public static volatile SingularAttribute<GradeClassFee, Date> createdAt;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.GradeClassFee#registrationFee
	 **/
	public static volatile SingularAttribute<GradeClassFee, Double> registrationFee;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.GradeClassFee#grade
	 **/
	public static volatile SingularAttribute<GradeClassFee, Grade> grade;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.GradeClassFee#id
	 **/
	public static volatile SingularAttribute<GradeClassFee, Integer> id;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.GradeClassFee#isActive
	 **/
	public static volatile SingularAttribute<GradeClassFee, Integer> isActive;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.GradeClassFee
	 **/
	public static volatile EntityType<GradeClassFee> class_;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.GradeClassFee#classType
	 **/
	public static volatile SingularAttribute<GradeClassFee, ClassType> classType;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.GradeClassFee#monthlyFee
	 **/
	public static volatile SingularAttribute<GradeClassFee, Double> monthlyFee;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.GradeClassFee#updatedAt
	 **/
	public static volatile SingularAttribute<GradeClassFee, Date> updatedAt;

	public static final String CREATED_AT = "createdAt";
	public static final String REGISTRATION_FEE = "registrationFee";
	public static final String GRADE = "grade";
	public static final String ID = "id";
	public static final String IS_ACTIVE = "isActive";
	public static final String CLASS_TYPE = "classType";
	public static final String MONTHLY_FEE = "monthlyFee";
	public static final String UPDATED_AT = "updatedAt";

}

