package com.nextlvlict.nextlvlict.hibernate;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.util.Date;

@StaticMetamodel(StudentClass.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class StudentClass_ {

	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.StudentClass#createdAt
	 **/
	public static volatile SingularAttribute<StudentClass, Date> createdAt;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.StudentClass#student
	 **/
	public static volatile SingularAttribute<StudentClass, Students> student;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.StudentClass#grade
	 **/
	public static volatile SingularAttribute<StudentClass, Grade> grade;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.StudentClass#id
	 **/
	public static volatile SingularAttribute<StudentClass, Integer> id;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.StudentClass#isActive
	 **/
	public static volatile SingularAttribute<StudentClass, Integer> isActive;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.StudentClass
	 **/
	public static volatile EntityType<StudentClass> class_;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.StudentClass#classType
	 **/
	public static volatile SingularAttribute<StudentClass, ClassType> classType;

	public static final String CREATED_AT = "createdAt";
	public static final String STUDENT = "student";
	public static final String GRADE = "grade";
	public static final String ID = "id";
	public static final String IS_ACTIVE = "isActive";
	public static final String CLASS_TYPE = "classType";

}

