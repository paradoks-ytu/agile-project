package com.paradoks.agileproject.exception;

import org.springframework.http.HttpStatus;

import java.util.Map;

public class BadRequestException extends RestException {
    public BadRequestException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }

    public BadRequestException(String message, Map<String, Object> details) {
        super(message, HttpStatus.BAD_REQUEST, details);
    }
}
