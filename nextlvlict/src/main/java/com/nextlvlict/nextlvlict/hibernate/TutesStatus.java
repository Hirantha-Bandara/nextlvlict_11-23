package com.nextlvlict.nextlvlict.hibernate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.io.Serializable;

@Entity
@Table(name = "tutes_status")
public class TutesStatus implements Serializable {
    
    @Id
    @Column(name = "id")
    private int id;

    @Column(name = "value")
    private String value;

    public TutesStatus() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
