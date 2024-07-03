package com.example.postgresql.exception;

public class EventNotFoundException extends Exception{
    public EventNotFoundException(Long message) {
        super("Event by id " + message + " not found in database");
    }
}
