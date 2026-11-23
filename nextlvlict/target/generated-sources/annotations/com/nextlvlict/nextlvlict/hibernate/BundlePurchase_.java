package com.nextlvlict.nextlvlict.hibernate;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.util.Date;

@StaticMetamodel(BundlePurchase.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class BundlePurchase_ {

	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.BundlePurchase#amount_paid
	 **/
	public static volatile SingularAttribute<BundlePurchase, Double> amount_paid;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.BundlePurchase#student
	 **/
	public static volatile SingularAttribute<BundlePurchase, Students> student;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.BundlePurchase#studentsId
	 **/
	public static volatile SingularAttribute<BundlePurchase, String> studentsId;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.BundlePurchase#payment_status
	 **/
	public static volatile SingularAttribute<BundlePurchase, String> payment_status;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.BundlePurchase#bundleId
	 **/
	public static volatile SingularAttribute<BundlePurchase, Integer> bundleId;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.BundlePurchase#id
	 **/
	public static volatile SingularAttribute<BundlePurchase, Integer> id;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.BundlePurchase#purchase_date
	 **/
	public static volatile SingularAttribute<BundlePurchase, Date> purchase_date;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.BundlePurchase
	 **/
	public static volatile EntityType<BundlePurchase> class_;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.BundlePurchase#bundle
	 **/
	public static volatile SingularAttribute<BundlePurchase, RecordingBundle> bundle;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.BundlePurchase#order_id
	 **/
	public static volatile SingularAttribute<BundlePurchase, String> order_id;

	public static final String AMOUNT_PAID = "amount_paid";
	public static final String STUDENT = "student";
	public static final String STUDENTS_ID = "studentsId";
	public static final String PAYMENT_STATUS = "payment_status";
	public static final String BUNDLE_ID = "bundleId";
	public static final String ID = "id";
	public static final String PURCHASE_DATE = "purchase_date";
	public static final String BUNDLE = "bundle";
	public static final String ORDER_ID = "order_id";

}

