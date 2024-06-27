package com.example.postgresql.model;

import javax.persistence.*;
import java.util.Date;
import lombok.Data;

@Entity
@Table(name = "events")
@Data
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String eventContent;
    private String startEventTime;
    private String stopEventTime;
    private Date eventDate;
    private Long userId;
    private Long roomId;
}
