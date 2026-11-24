package com.noeverything.repository;

import com.noeverything.entity.DailyQuote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyQuoteRepository extends JpaRepository<DailyQuote, Long> {
    Optional<DailyQuote> findByDateKey(String dateKey);
    List<DailyQuote> findByCategoryIgnoreCase(String category);
    
    @Query("SELECT q FROM DailyQuote q ORDER BY function('RAND') LIMIT 1")
    Optional<DailyQuote> findRandomQuote();

    List<DailyQuote> findByQuoteTextContainingIgnoreCaseOrAuthorContainingIgnoreCase(String text, String author);
}
