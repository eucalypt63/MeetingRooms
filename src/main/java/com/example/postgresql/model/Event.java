package com.example.postgresql.model;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;

@Entity
@Table(name = "events")
@Data
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String eventContent;
    private LocalTime startEventTime;
    private LocalTime  stopEventTime;
    private Date eventDate;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonManagedReference
    private User user;

    @ManyToOne
    @JoinColumn(name = "room_id")
    @JsonManagedReference
    private Room room;
}
