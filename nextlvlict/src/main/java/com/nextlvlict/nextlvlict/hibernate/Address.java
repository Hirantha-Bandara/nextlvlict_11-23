package com.nextlvlict.nextlvlict.hibernate;

import java.io.Serializable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "address")
public class Address implements Serializable {

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "line1")
    private String line1;

    @Column(name = "line2")
    private String line2;

    @Column(name = "postalcode")
    private String postalcode;

    @Column(name = "city")
    private String city;

    @ManyToOne
    @JoinColumn(name = "provinces_id")
    private Provinces provinces;

    @ManyToOne
    @JoinColumn(name = "districts_id")
    private Districts districts;

    /**
     * @return the id
     */
    public String getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(String id) {
        this.id = id;
    }

    /**
     * @return the line1
     */
    public String getLine1() {
        return line1;
    }

    /**
     * @param line1 the line1 to set
     */
    public void setLine1(String line1) {
        this.line1 = line1;
    }

    /**
     * @return the line2
     */
    public String getLine2() {
        return line2;
    }

    /**
     * @param line2 the line2 to set
     */
    public void setLine2(String line2) {
        this.line2 = line2;
    }

    /**
     * @return the postalcode
     */
    public String getPostalcode() {
        return postalcode;
    }

    /**
     * @param postalcode the postalcode to set
     */
    public void setPostalcode(String postalcode) {
        this.postalcode = postalcode;
    }

    /**
     * @return the city
     */
    public String getCity() {
        return city;
    }

    /**
     * @param city the city to set
     */
    public void setCity(String city) {
        this.city = city;
    }

    /**
     * @return the provinces
     */
    public Provinces getProvinces() {
        return provinces;
    }

    /**
     * @param provinces the provinces to set
     */
    public void setProvinces(Provinces provinces) {
        this.provinces = provinces;
    }

    /**
     * @return the districts
     */
    public Districts getDistricts() {
        return districts;
    }

    /**
     * @param districts the districts to set
     */
    public void setDistricts(Districts districts) {
        this.districts = districts;
    }

}

