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
        if (userDto.getPassword().length() < 8 )throw new IllegalArgumentException("Please put");
        userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));
        return userService.createUser(userDto);
    }
}