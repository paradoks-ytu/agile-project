package com.paradoks.agileproject.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.util.Collections;
import java.util.Map;

@Getter
public class RestException extends RuntimeException {
    private final HttpStatus httpStatus;
    private final Map<String, Object> details;

    public RestException(String message, HttpStatus httpStatus) {
        this(message, httpStatus, Collections.emptyMap());
    }

    public RestException(String message, HttpStatus httpStatus, Map<String, Object> details) {
        super(message);
        this.httpStatus = httpStatus;
        this.details = details;
    }
}
