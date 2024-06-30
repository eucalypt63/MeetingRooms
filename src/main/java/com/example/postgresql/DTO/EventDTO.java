package com.example.postgresql.DTO;

import lombok.Data;

@Data
public class EventDTO {
    private Long id;
    private String formattedDate;
    private String startTime;
    private String endTime;
    private String description;
    private String roomName;
}
