package com.example.postgresql.model;

import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name = "rooms")
@Data
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String roomName;
    private String status;
}
