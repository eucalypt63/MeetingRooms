package com.example.postgresql.DTO;

import lombok.Data;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
public class EventDTO {
    private Long id;
    private String formattedDate;
    private LocalTime  startTime;
    private LocalTime endTime;
    private String description;
    private String roomName;
}
