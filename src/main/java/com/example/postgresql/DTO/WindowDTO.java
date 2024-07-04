package com.example.postgresql.DTO;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class WindowDTO {
    private Long currentWeek;
    private Long currentRoomId;
}