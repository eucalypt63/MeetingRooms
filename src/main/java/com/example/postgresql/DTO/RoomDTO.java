package com.example.postgresql.DTO;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RoomDTO {
    private Long id;
    private String roomName;
    private String roomStatus;
}
