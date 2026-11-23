package com.nextlvlict.nextlvlict.hibernate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.io.Serializable;

@Entity
@Table(name = "days")
public class Days implements Serializable {
    
    @Id
    @Column(name = "id")
    private int id;

    @Column(name = "name")
    private String name;

    public Days() {
    }

    public Days(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
