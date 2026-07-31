package com.auth.authentication.payload;

public record RefreshTokenRequest(
        String refreshToken
) {
}