package com.auth.authentication.payload;

public record LoginRequest(
        String email,
        String password
)
{
}