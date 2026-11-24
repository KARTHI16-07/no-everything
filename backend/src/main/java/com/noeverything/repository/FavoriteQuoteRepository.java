package com.noeverything.repository;

import com.noeverything.entity.DailyQuote;
import com.noeverything.entity.FavoriteQuote;
import com.noeverything.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteQuoteRepository extends JpaRepository<FavoriteQuote, Long> {
    List<FavoriteQuote> findByUserOrderBySavedAtDesc(User user);
    Optional<FavoriteQuote> findByUserAndQuote(User user, DailyQuote quote);
    boolean existsByUserAndQuote(User user, DailyQuote quote);
    void deleteByUserAndQuote(User user, DailyQuote quote);
}
