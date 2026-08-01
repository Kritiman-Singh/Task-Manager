package com.auth.services;

import com.auth.dtos.user.ChangePasswordRequest;
import com.auth.dtos.user.UpdateUserProfileRequest;
import com.auth.dtos.user.UserProfileResponse;

public interface UserProfileService {
    UserProfileResponse getCurrentUserProfile();
    UserProfileResponse updateCurrentUserProfile(UpdateUserProfileRequest request);
    void changePassword(ChangePasswordRequest request);
}
