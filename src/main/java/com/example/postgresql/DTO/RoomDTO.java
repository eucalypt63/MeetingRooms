package com.example.postgresql.DTO;

import lombok.Data;

@Data
public class RoomDTO {
    private Long id;
    private String roomName;
    private String roomStatus;
}
