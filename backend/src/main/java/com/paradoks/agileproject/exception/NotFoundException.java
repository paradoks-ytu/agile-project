package com.paradoks.agileproject.exception;

import org.springframework.http.HttpStatus;

import java.util.Map;

public class NotFoundException extends RestException {
    public NotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }

    public NotFoundException(String message, Map<String, Object> details) {
        super(message, HttpStatus.NOT_FOUND, details);
    }
}
