package com.noeverything.repository;

import com.noeverything.entity.Habit;
import com.noeverything.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface HabitRepository extends JpaRepository<Habit, Long> {
    List<Habit> findByUserAndActiveOrderByCreatedAtDesc(User user, boolean active);
    List<Habit> findByUserOrderByCreatedAtDesc(User user);
    Optional<Habit> findByIdAndUser(Long id, User user);
}
