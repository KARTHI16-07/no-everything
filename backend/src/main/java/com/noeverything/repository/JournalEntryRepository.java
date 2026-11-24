package com.noeverything.repository;

import com.noeverything.entity.JournalEntry;
import com.noeverything.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface JournalEntryRepository extends JpaRepository<JournalEntry, Long> {
    List<JournalEntry> findByUserOrderByEntryDateDescCreatedAtDesc(User user);
    Optional<JournalEntry> findByIdAndUser(Long id, User user);
    List<JournalEntry> findByUserAndIsFavoriteOrderByEntryDateDesc(User user, boolean isFavorite);
    List<JournalEntry> findByUserAndMoodOrderByEntryDateDesc(User user, String mood);

    @Query("SELECT j FROM JournalEntry j WHERE j.user = :user AND " +
           "(LOWER(j.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(j.content) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(j.tags) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "ORDER BY j.entryDate DESC")
    List<JournalEntry> searchEntries(@Param("user") User user, @Param("query") String query);

    long countByUser(User user);
}
