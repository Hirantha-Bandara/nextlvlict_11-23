/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nextlvlict.nextlvlict.hibernate;

import com.google.gson.annotations.Expose;
import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "grade")
public class Grade implements Serializable {

    @Expose
    @Id
    @Column(name = "id")
    private int id;

    @Expose
    @Column(name = "name")
    private String name;

    @Expose
    @Column(name = "fee")
    private double fee;

    @Expose
    @Column(name = "is_active")
    private int is_active;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ol_or_al_id")
    @Expose(serialize = false, deserialize = false)
    private Ol_or_Al ol_or_al;

    public Grade() {

    }

    /**
     * @return the id
     */
    public int getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * @param name the name to set
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return the fee
     */
    public double getFee() {
        return fee;
    }

    /**
     * @param fee the fee to set
     */
    public void setFee(double fee) {
        this.fee = fee;
    }

    /**
     * @return the is_active
     */
    public int getIs_active() {
        return is_active;
    }

    /**
     * @param is_active the is_active to set
     */
    public void setIs_active(int is_active) {
        this.is_active = is_active;
    }

    /**
     * @return the ol_or_al
     */
    public Ol_or_Al getOl_or_al() {
        return ol_or_al;
    }

    /**
     * @param ol_or_al the ol_or_al to set
     */
    public void setOl_or_al(Ol_or_Al ol_or_al) {
        this.ol_or_al = ol_or_al;
    }

}

