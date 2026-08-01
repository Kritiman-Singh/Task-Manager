package com.auth.repositories;

import com.auth.authentication.entities.User;
import com.auth.entities.Task;
import com.auth.enums.TaskPriority;
import com.auth.enums.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID>, JpaSpecificationExecutor<Task> {

    Optional<Task> findByIdAndUserId(UUID id, UUID userId);

    List<Task> findByUserIdAndTaskDateOrderByStartTimeAsc(UUID userId, LocalDate taskDate);

    List<Task> findByUserIdAndTaskDateBetweenOrderByTaskDateAscStartTimeAsc(UUID userId, LocalDate from, LocalDate to);

    Page<Task> findByUserIdAndStatus(UUID userId, TaskStatus status, Pageable pageable);

    long countByUserId(UUID userId);

    long countByUserIdAndTaskDate(UUID userId, LocalDate taskDate);

    long countByUserIdAndStatus(UUID userId, TaskStatus status);

    long countByUserIdAndTaskDateAndStatus(UUID userId, LocalDate taskDate, TaskStatus status);

    long countByUserIdAndTaskDateBetween(UUID userId, LocalDate from, LocalDate to);

    long countByUserIdAndTaskDateBetweenAndStatus(UUID userId, LocalDate from, LocalDate to, TaskStatus status);

    @Query("SELECT t.taskDate AS date, COUNT(t) AS total, " +
           "SUM(CASE WHEN t.status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed, " +
           "SUM(CASE WHEN t.status = 'PENDING' THEN 1 ELSE 0 END) AS pending " +
           "FROM Task t WHERE t.user.id = :userId AND t.taskDate BETWEEN :from AND :to " +
           "GROUP BY t.taskDate ORDER BY t.taskDate ASC")
    List<Object[]> AggregateTaskActivityByDateRange(@Param("userId") UUID userId,
                                                   @Param("from") LocalDate from,
                                                   @Param("to") LocalDate to);

    @Query("SELECT t.taskDate AS date, COUNT(t) AS completedCount " +
           "FROM Task t WHERE t.user.id = :userId AND t.status = 'COMPLETED' " +
           "GROUP BY t.taskDate ORDER BY completedCount DESC")
    List<Object[]> findMostProductiveDays(@Param("userId") UUID userId, Pageable pageable);
}
