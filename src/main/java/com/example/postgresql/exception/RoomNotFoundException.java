package com.example.postgresql.exception;

public class RoomNotFoundException extends Exception {
    public RoomNotFoundException(String message) {
        super("Room " + message + " not found in database");
    }

    public RoomNotFoundException(Long message) {
        super("Room by id" + message + " not found in database");
    }
}