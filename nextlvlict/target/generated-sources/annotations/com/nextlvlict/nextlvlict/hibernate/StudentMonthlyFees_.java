package com.nextlvlict.nextlvlict.hibernate;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.util.Date;

@StaticMetamodel(StudentMonthlyFees.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class StudentMonthlyFees_ {

	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.StudentMonthlyFees#student
	 **/
	public static volatile SingularAttribute<StudentMonthlyFees, Students> student;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.StudentMonthlyFees#dueDate
	 **/
	public static volatile SingularAttribute<StudentMonthlyFees, Date> dueDate;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.StudentMonthlyFees#transactionId
	 **/
	public static volatile SingularAttribute<StudentMonthlyFees, String> transactionId;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.StudentMonthlyFees#feeAmount
	 **/
	public static volatile SingularAttribute<StudentMonthlyFees, Double> feeAmount;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.StudentMonthlyFees#createdAt
	 **/
	public static volatile SingularAttribute<StudentMonthlyFees, Date> createdAt;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.StudentMonthlyFees#paidDate
	 **/
	public static volatile SingularAttribute<StudentMonthlyFees, Date> paidDate;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.StudentMonthlyFees#monthYear
	 **/
	public static volatile SingularAttribute<StudentMonthlyFees, String> monthYear;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.StudentMonthlyFees#grade
	 **/
	public static volatile SingularAttribute<StudentMonthlyFees, Grade> grade;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.StudentMonthlyFees#id
	 **/
	public static volatile SingularAttribute<StudentMonthlyFees, Integer> id;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.StudentMonthlyFees
	 **/
	public static volatile EntityType<StudentMonthlyFees> class_;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.StudentMonthlyFees#classType
	 **/
	public static volatile SingularAttribute<StudentMonthlyFees, ClassType> classType;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.StudentMonthlyFees#status
	 **/
	public static volatile SingularAttribute<StudentMonthlyFees, PaymentStatus> status;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.StudentMonthlyFees#updatedAt
	 **/
	public static volatile SingularAttribute<StudentMonthlyFees, Date> updatedAt;

	public static final String STUDENT = "student";
	public static final String DUE_DATE = "dueDate";
	public static final String TRANSACTION_ID = "transactionId";
	public static final String FEE_AMOUNT = "feeAmount";
	public static final String CREATED_AT = "createdAt";
	public static final String PAID_DATE = "paidDate";
	public static final String MONTH_YEAR = "monthYear";
	public static final String GRADE = "grade";
	public static final String ID = "id";
	public static final String CLASS_TYPE = "classType";
	public static final String STATUS = "status";
	public static final String UPDATED_AT = "updatedAt";

}

