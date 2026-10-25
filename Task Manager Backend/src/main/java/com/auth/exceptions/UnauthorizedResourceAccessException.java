package com.auth.exceptions;

public class UnauthorizedResourceAccessException extends RuntimeException {

    public UnauthorizedResourceAccessException(String message) {
        super(message);
    }

    public UnauthorizedResourceAccessException() {
        super("Access denied to the requested resource");
    }
}
