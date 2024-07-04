package com.example.postgresql.DTO;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Data
@NoArgsConstructor
@RequiredArgsConstructor
public class UserDTO {
    @NonNull
    private Long id;
    @NonNull
    private String username;
    @NonNull
    private String role;
}
