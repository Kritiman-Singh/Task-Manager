package com.auth.repositories.specifications;

import com.auth.entities.Task;
import com.auth.enums.TaskPriority;
import com.auth.enums.TaskStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class TaskSpecification {

    public static Specification<Task> getSpecification(
            UUID userId,
            LocalDate date,
            LocalDate from,
            LocalDate to,
            TaskStatus status,
            TaskPriority priority,
            String category,
            String search
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Always enforce ownership
            predicates.add(cb.equal(root.get("user").get("id"), userId));

            if (date != null) {
                predicates.add(cb.equal(root.get("taskDate"), date));
            } else {
                if (from != null) {
                    predicates.add(cb.greaterThanOrEqualTo(root.get("taskDate"), from));
                }
                if (to != null) {
                    predicates.add(cb.lessThanOrEqualTo(root.get("taskDate"), to));
                }
            }

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (priority != null) {
                predicates.add(cb.equal(root.get("priority"), priority));
            }

            if (StringUtils.hasText(category)) {
                predicates.add(cb.equal(cb.lower(root.get("category")), category.trim().toLowerCase()));
            }

            if (StringUtils.hasText(search)) {
                String pattern = "%" + search.trim().toLowerCase() + "%";
                Predicate titlePredicate = cb.like(cb.lower(root.get("title")), pattern);
                Predicate descPredicate = cb.like(cb.lower(root.get("description")), pattern);
                predicates.add(cb.or(titlePredicate, descPredicate));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
