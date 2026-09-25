package com.auth.authentication.services.impl;

import com.auth.authentication.payload.UserDto;
import com.auth.authentication.services.AuthService;
import com.auth.authentication.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserService userService;
    private  final PasswordEncoder passwordEncoder;


    @Override
    public UserDto registerUser(UserDto userDto) {

        //verify email
        //verify password
        //default roles
        if (userDto.getName() == null || userDto.getName().isBlank()) {
            throw new IllegalArgumentException("Please enter your name");
        }
        if (userDto.getEmail() == null || userDto.getEmail().isBlank()) {
            throw new IllegalArgumentException("Please enter your email address");
        }
        if (userDto.getPassword() == null || userDto.getPassword().isBlank()) {
            throw new IllegalArgumentException("Please enter a password");
        }
        if (userDto.getPassword().length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long");
        }
        userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));
        UserDto created = userService.createUser(userDto);
        // Response me password/hash kabhi wapas mat bhejo
        created.setPassword(null);
        return created;
    }
}