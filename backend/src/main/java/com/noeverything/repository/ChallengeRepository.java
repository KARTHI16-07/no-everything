package com.noeverything.repository;

import com.noeverything.entity.Challenge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChallengeRepository extends JpaRepository<Challenge, Long> {
    Optional<Challenge> findByCode(String code);
    List<Challenge> findByType(String type);
    List<Challenge> findByCategory(String category);
}
