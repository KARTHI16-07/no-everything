package com.noeverything.repository;

import com.noeverything.entity.TestAttempt;
import com.noeverything.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TestAttemptRepository extends JpaRepository<TestAttempt, Long> {
    List<TestAttempt> findByUserOrderByCompletedAtDesc(User user);
    long countByUser(User user);

    @Query("SELECT AVG(t.percentage) FROM TestAttempt t WHERE t.user = :user")
    Double getAverageScoreByUser(@Param("user") User user);
}
