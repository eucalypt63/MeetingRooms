package com.example.postgresql.model;

import javax.persistence.*;
import java.time.LocalTime;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@RequiredArgsConstructor
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    private String eventContent;
    @NonNull
    private LocalTime startEventTime;
    @NonNull
    private LocalTime  stopEventTime;
    @NonNull
    private Date eventDate;

    @NonNull
    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonManagedReference
    private User user;

    @NonNull
    @ManyToOne
    @JoinColumn(name = "room_id")
    @JsonManagedReference
    private Room room;
}
