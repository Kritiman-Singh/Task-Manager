package com.auth.dtos;

import org.springframework.http.HttpStatus;

public record ErrorResponse(
        String message,
        HttpStatus status,
        int statusCode

) {
}