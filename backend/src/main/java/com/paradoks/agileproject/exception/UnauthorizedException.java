package com.paradoks.agileproject.exception;

import org.springframework.http.HttpStatus;

import java.util.Map;

public class UnauthorizedException extends RestException {
    public UnauthorizedException(String message) {
        super(message, HttpStatus.UNAUTHORIZED);
    }

    public UnauthorizedException(String message, Map<String, Object> details) {
        super(message, HttpStatus.UNAUTHORIZED, details);
    }
}
