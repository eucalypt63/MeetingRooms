package com.example.postgresql.DTO;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@NoArgsConstructor
public class EventRequestDTO {
    private Long id;
    private String formattedDate;
    private LocalTime  startTime;
    private LocalTime endTime;
    private String description;
    private String roomName;
}
