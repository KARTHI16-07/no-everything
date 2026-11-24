package com.noeverything.repository;

import com.noeverything.entity.Task;
import com.noeverything.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserOrderByDueDateAscCreatedAtDesc(User user);
    List<Task> findByUserAndCompletedOrderByDueDateAsc(User user, boolean completed);
    Optional<Task> findByIdAndUser(Long id, User user);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.user = :user AND t.completed = true AND t.completedAt >= :since")
    long countCompletedSince(@Param("user") User user, @Param("since") LocalDateTime since);

    @Query("SELECT t FROM Task t WHERE t.user = :user AND t.dueDate = :date")
    List<Task> findByUserAndDueDate(@Param("user") User user, @Param("date") LocalDate date);

    @Query("SELECT t FROM Task t WHERE t.user = :user AND t.completed = false ORDER BY t.dueDate ASC")
    List<Task> findUpcomingTasks(@Param("user") User user);
}
