package com.auth.services.impl;

import com.auth.authentication.entities.Provider;
import com.auth.authentication.entities.User;
import com.auth.authentication.repositories.UserRepository;
import com.auth.dtos.user.ChangePasswordRequest;
import com.auth.dtos.user.UpdateUserProfileRequest;
import com.auth.dtos.user.UserProfileResponse;
import com.auth.exceptions.ResourceNotFoundException;
import com.auth.security.SecurityUtil;
import com.auth.services.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class UserProfileServiceImpl implements UserProfileService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUserProfile() {
        User user = getAuthenticatedUserEntity();
        return mapToResponse(user);
    }

    @Override
    public UserProfileResponse updateCurrentUserProfile(UpdateUserProfileRequest request) {
        User user = getAuthenticatedUserEntity();

        if (request.getUserName() != null && !request.getUserName().isBlank()) {
            user.setName(request.getUserName().trim());
        }
        if (request.getImage() != null) {
            user.setImage(request.getImage().trim());
        }

        User updatedUser = userRepository.save(user);
        return mapToResponse(updatedUser);
    }

    @Override
    public void changePassword(ChangePasswordRequest request) {
        User user = getAuthenticatedUserEntity();

        if (user.getProvider() != Provider.LOCAL) {
            throw new IllegalStateException("Password change is only permitted for local accounts. Social login accounts (Google/GitHub) cannot change password.");
        }

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadCredentialsException("Current password provided is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private User getAuthenticatedUserEntity() {
        UUID userId = SecurityUtil.getCurrentUserId();
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User entity not found with id: " + userId));
    }

    private UserProfileResponse mapToResponse(User user) {
        return UserProfileResponse.builder()
                .userId(user.getId())
                .userName(user.getName())
                .email(user.getEmail())
                .image(user.getImage())
                .provider(user.getProvider())
                .build();
    }
}
