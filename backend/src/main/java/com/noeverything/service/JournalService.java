package com.noeverything.service;

import com.noeverything.dto.JournalEntryRequest;
import com.noeverything.dto.JournalEntryResponse;
import com.noeverything.entity.JournalEntry;
import com.noeverything.entity.User;
import com.noeverything.exception.ResourceNotFoundException;
import com.noeverything.repository.JournalEntryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JournalService {

    private final JournalEntryRepository journalRepository;
    private final AuthService authService;

    public JournalService(JournalEntryRepository journalRepository, AuthService authService) {
        this.journalRepository = journalRepository;
        this.authService = authService;
    }

    public List<JournalEntryResponse> getEntriesForCurrentUser(String query, String mood, Boolean favorite) {
        User user = authService.getCurrentAuthenticatedUser();
        List<JournalEntry> entries;

        if (query != null && !query.isBlank()) {
            entries = journalRepository.searchEntries(user, query.trim());
        } else if (mood != null && !mood.isBlank() && !"ALL".equalsIgnoreCase(mood)) {
            entries = journalRepository.findByUserAndMoodOrderByEntryDateDesc(user, mood.toUpperCase());
        } else if (Boolean.TRUE.equals(favorite)) {
            entries = journalRepository.findByUserAndIsFavoriteOrderByEntryDateDesc(user, true);
        } else {
            entries = journalRepository.findByUserOrderByEntryDateDescCreatedAtDesc(user);
        }

        return entries.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public JournalEntryResponse getEntryById(Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        JournalEntry entry = journalRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Journal entry not found with id: " + id));
        return mapToResponse(entry);
    }

    @Transactional
    public JournalEntryResponse createEntry(JournalEntryRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        JournalEntry entry = new JournalEntry(
                user,
                request.getTitle().trim(),
                request.getContent(),
                request.getMood(),
                request.getTags(),
                request.getEntryDate() != null ? request.getEntryDate() : LocalDate.now()
        );
        if (request.getIsFavorite() != null) {
            entry.setFavorite(request.getIsFavorite());
        }
        JournalEntry saved = journalRepository.save(entry);
        return mapToResponse(saved);
    }

    @Transactional
    public JournalEntryResponse updateEntry(Long id, JournalEntryRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        JournalEntry entry = journalRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Journal entry not found with id: " + id));

        if (request.getTitle() != null) entry.setTitle(request.getTitle().trim());
        if (request.getContent() != null) entry.setContent(request.getContent());
        if (request.getMood() != null) entry.setMood(request.getMood());
        if (request.getTags() != null) entry.setTags(request.getTags());
        if (request.getEntryDate() != null) entry.setEntryDate(request.getEntryDate());
        if (request.getIsFavorite() != null) entry.setFavorite(request.getIsFavorite());

        JournalEntry saved = journalRepository.save(entry);
        return mapToResponse(saved);
    }

    @Transactional
    public boolean toggleFavorite(Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        JournalEntry entry = journalRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Journal entry not found with id: " + id));

        entry.setFavorite(!entry.isFavorite());
        journalRepository.save(entry);
        return entry.isFavorite();
    }

    @Transactional
    public void deleteEntry(Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        JournalEntry entry = journalRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Journal entry not found with id: " + id));
        journalRepository.delete(entry);
    }

    public JournalEntryResponse mapToResponse(JournalEntry e) {
        JournalEntryResponse res = new JournalEntryResponse();
        res.setId(e.getId());
        res.setTitle(e.getTitle());
        res.setContent(e.getContent());
        res.setMood(e.getMood());
        res.setTags(e.getTags());
        res.setEntryDate(e.getEntryDate());
        res.setFavorite(e.isFavorite());
        res.setCreatedAt(e.getCreatedAt());
        res.setUpdatedAt(e.getUpdatedAt());
        return res;
    }
}
