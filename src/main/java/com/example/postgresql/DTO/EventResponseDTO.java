package com.example.postgresql.DTO;

import com.example.postgresql.model.Room;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

import java.time.LocalTime;
import java.util.Date;

@Data
@NoArgsConstructor
@RequiredArgsConstructor
public class EventResponseDTO {
    @NonNull
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
    private Long userId;
    @NonNull
    private Room room;
}
