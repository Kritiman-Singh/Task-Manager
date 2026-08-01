package com.auth.dtos.task;

import com.auth.enums.TaskPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TaskCreateRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title cannot exceed 255 characters")
    private String title;

    private String description;

    @NotNull(message = "Task date is required")
    private LocalDate taskDate;

    private LocalTime startTime;

    private LocalTime dueTime;

    private TaskPriority priority;

    @Size(max = 100, message = "Category cannot exceed 100 characters")
    private String category;
}
