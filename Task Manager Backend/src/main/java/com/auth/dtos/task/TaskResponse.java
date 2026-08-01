package com.auth.dtos.task;

import com.auth.enums.TaskPriority;
import com.auth.enums.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TaskResponse {
    private UUID taskId;
    private String title;
    private String description;
    private LocalDate taskDate;
    private LocalTime startTime;
    private LocalTime dueTime;
    private TaskStatus status;
    private TaskPriority priority;
    private String category;
    private Instant createdAt;
    private Instant updatedAt;
    private Instant completedAt;
}
