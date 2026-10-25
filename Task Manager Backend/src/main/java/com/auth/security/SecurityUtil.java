package com.auth.security;

import com.auth.authentication.entities.User;
import com.auth.exceptions.UnauthorizedResourceAccessException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.UUID;

public class SecurityUtil {

    public static User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new UnauthorizedResourceAccessException("User is not authenticated");
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof User user) {
            return user;
        }

        throw new UnauthorizedResourceAccessException("Invalid authentication principal");
    }

    public static UUID getCurrentUserId() {
        return getCurrentUser().getId();
    }
}
