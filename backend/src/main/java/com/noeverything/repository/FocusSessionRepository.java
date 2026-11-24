package com.noeverything.repository;

import com.noeverything.entity.FocusSession;
import com.noeverything.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FocusSessionRepository extends JpaRepository<FocusSession, Long> {
    List<FocusSession> findByUserOrderByCompletedAtDesc(User user);
    List<FocusSession> findByUserAndCompletedAtBetweenOrderByCompletedAtDesc(User user, LocalDateTime start, LocalDateTime end);

    @Query("SELECT COALESCE(SUM(fs.durationMinutes), 0) FROM FocusSession fs WHERE fs.user = :user AND fs.completedAt >= :since")
    int sumDurationMinutesSince(@Param("user") User user, @Param("since") LocalDateTime since);

    @Query("SELECT COALESCE(SUM(fs.durationMinutes), 0) FROM FocusSession fs WHERE fs.user = :user")
    int sumTotalDurationMinutes(@Param("user") User user);

    @Query("SELECT COUNT(fs) FROM FocusSession fs WHERE fs.user = :user")
    long countTotalSessions(@Param("user") User user);
}
