package com.example.postgresql.DTO;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class UserDTO {
    private final Long id;
    private final String username;
    private final String role;
}
