package com.paradoks.agileproject.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class FileUploadException extends RestException {

    public FileUploadException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }

    public FileUploadException(String message, Throwable cause) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}