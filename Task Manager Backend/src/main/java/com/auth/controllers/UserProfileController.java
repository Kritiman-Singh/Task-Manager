package com.auth.controllers;

import com.auth.dtos.ApiResponse;
import com.auth.dtos.user.ChangePasswordRequest;
import com.auth.dtos.user.UpdateUserProfileRequest;
import com.auth.dtos.user.UserProfileResponse;
import com.auth.services.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users/me")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;

    @GetMapping
    public ResponseEntity<ApiResponse<UserProfileResponse>> getCurrentUserProfile() {
        UserProfileResponse profile = userProfileService.getCurrentUserProfile();
        return ResponseEntity.ok(ApiResponse.success(profile, "User profile retrieved successfully"));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateCurrentUserProfile(
            @Valid @RequestBody UpdateUserProfileRequest request
    ) {
        UserProfileResponse updatedProfile = userProfileService.updateCurrentUserProfile(request);
        return ResponseEntity.ok(ApiResponse.success(updatedProfile, "User profile updated successfully"));
    }

    @PutMapping("/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        userProfileService.changePassword(request);
        return ResponseEntity.ok(ApiResponse.success(null, "Password updated successfully"));
    }
}
