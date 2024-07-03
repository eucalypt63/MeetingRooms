package com.example.postgresql.exception;

public class UserNotFoundException extends Exception{
    public UserNotFoundException(String message) {
        super("User " + message + " not found in database");
    }
}
