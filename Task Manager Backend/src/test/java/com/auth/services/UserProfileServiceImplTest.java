package com.auth.services;

import com.auth.authentication.entities.Provider;
import com.auth.authentication.entities.User;
import com.auth.authentication.repositories.UserRepository;
import com.auth.dtos.user.ChangePasswordRequest;
import com.auth.dtos.user.UpdateUserProfileRequest;
import com.auth.dtos.user.UserProfileResponse;
import com.auth.services.impl.UserProfileServiceImpl;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.HashSet;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserProfileServiceImplTest {

    @Mock
    private UserRepository userRepository;

    private UserProfileServiceImpl userProfileService;

    private UUID userId;

    @BeforeEach
    void setUp() {
        userProfileService = new UserProfileServiceImpl(userRepository, new BCryptPasswordEncoder());
        userId = UUID.randomUUID();
        User user = User.builder().id(userId).email("owner@example.com").roles(new HashSet<>()).enable(true).build();
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities())
        );
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void getCurrentUserProfile_mapsSafeFields() {
        User user = User.builder()
                .id(userId)
                .email("owner@example.com")
                .name("Owner Name")
                .image("https://img/1.png")
                .provider(Provider.LOCAL)
                .build();
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        UserProfileResponse response = userProfileService.getCurrentUserProfile();

        assertEquals(userId, response.getUserId());
        assertEquals("Owner Name", response.getUserName());
        assertEquals("owner@example.com", response.getEmail());
        assertEquals("https://img/1.png", response.getImage());
        assertEquals(Provider.LOCAL, response.getProvider());
    }

    @Test
    void updateCurrentUserProfile_updatesNameAndImage() {
        User user = User.builder().id(userId).email("owner@example.com").build();
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UpdateUserProfileRequest request = UpdateUserProfileRequest.builder()
                .userName("  New Name  ")
                .image("  https://img/2.png  ")
                .build();

        UserProfileResponse response = userProfileService.updateCurrentUserProfile(request);

        assertEquals("New Name", response.getUserName());
        assertEquals("https://img/2.png", response.getImage());
    }

    @Test
    void changePassword_localUserWithCorrectPasswordUpdatesPassword() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        userProfileService = new UserProfileServiceImpl(userRepository, encoder);

        User user = User.builder()
                .id(userId)
                .email("owner@example.com")
                .provider(Provider.LOCAL)
                .password(encoder.encode("old-password"))
                .build();
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ChangePasswordRequest request = ChangePasswordRequest.builder()
                .currentPassword("old-password")
                .newPassword("new-password")
                .build();

        userProfileService.changePassword(request);

        verify(userRepository).save(argThat(updated -> encoder.matches("new-password", updated.getPassword())));
    }

    @Test
    void changePassword_wrongCurrentPasswordThrowsBadCredentials() {
        User user = User.builder()
                .id(userId)
                .email("owner@example.com")
                .provider(Provider.LOCAL)
                .password(new BCryptPasswordEncoder().encode("actual-password"))
                .build();
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        ChangePasswordRequest request = ChangePasswordRequest.builder()
                .currentPassword("wrong-password")
                .newPassword("new-password")
                .build();

        assertThrows(BadCredentialsException.class, () -> userProfileService.changePassword(request));
        verify(userRepository, never()).save(any());
    }

    @Test
    void changePassword_socialAccountThrowsIllegalState() {
        User user = User.builder()
                .id(userId)
                .email("owner@example.com")
                .provider(Provider.GOOGLE)
                .build();
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        ChangePasswordRequest request = ChangePasswordRequest.builder()
                .currentPassword("whatever")
                .newPassword("new-password")
                .build();

        assertThrows(IllegalStateException.class, () -> userProfileService.changePassword(request));
        verify(userRepository, never()).save(any());
    }
}
