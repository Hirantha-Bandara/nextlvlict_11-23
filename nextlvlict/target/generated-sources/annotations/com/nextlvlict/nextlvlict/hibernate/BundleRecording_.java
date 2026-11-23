package com.nextlvlict.nextlvlict.hibernate;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(BundleRecording.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class BundleRecording_ {

	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.BundleRecording#recording
	 **/
	public static volatile SingularAttribute<BundleRecording, Recordings> recording;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.BundleRecording#id
	 **/
	public static volatile SingularAttribute<BundleRecording, BundleRecordingId> id;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.BundleRecording
	 **/
	public static volatile EntityType<BundleRecording> class_;
	
	/**
	 * @see com.nextlvlict.nextlvlict.hibernate.BundleRecording#bundle
	 **/
	public static volatile SingularAttribute<BundleRecording, RecordingBundle> bundle;

	public static final String RECORDING = "recording";
	public static final String ID = "id";
	public static final String BUNDLE = "bundle";

}

