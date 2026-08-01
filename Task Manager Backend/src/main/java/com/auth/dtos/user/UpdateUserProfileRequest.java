package com.auth.dtos.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUserProfileRequest {

    @NotBlank(message = "User name is required")
    @Size(max = 255, message = "User name cannot exceed 255 characters")
    private String userName;

    private String image;
}
