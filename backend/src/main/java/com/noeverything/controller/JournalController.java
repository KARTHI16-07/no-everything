package com.noeverything.controller;

import com.noeverything.dto.ApiResponse;
import com.noeverything.dto.JournalEntryRequest;
import com.noeverything.dto.JournalEntryResponse;
import com.noeverything.service.JournalService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/journal")
public class JournalController {

    private final JournalService journalService;

    public JournalController(JournalService journalService) {
        this.journalService = journalService;
    }

    @GetMapping("/entries")
    public ResponseEntity<ApiResponse<List<JournalEntryResponse>>> getEntries(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String mood,
            @RequestParam(required = false) Boolean favorite) {
        List<JournalEntryResponse> entries = journalService.getEntriesForCurrentUser(query, mood, favorite);
        return ResponseEntity.ok(ApiResponse.success(entries));
    }

    @GetMapping("/entries/{id}")
    public ResponseEntity<ApiResponse<JournalEntryResponse>> getEntry(@PathVariable Long id) {
        JournalEntryResponse entry = journalService.getEntryById(id);
        return ResponseEntity.ok(ApiResponse.success(entry));
    }

    @PostMapping("/entries")
    public ResponseEntity<ApiResponse<JournalEntryResponse>> createEntry(@Valid @RequestBody JournalEntryRequest request) {
        JournalEntryResponse created = journalService.createEntry(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Journal entry recorded", created));
    }

    @PutMapping("/entries/{id}")
    public ResponseEntity<ApiResponse<JournalEntryResponse>> updateEntry(
            @PathVariable Long id,
            @RequestBody JournalEntryRequest request) {
        JournalEntryResponse updated = journalService.updateEntry(id, request);
        return ResponseEntity.ok(ApiResponse.success("Journal entry updated", updated));
    }

    @PostMapping("/entries/{id}/favorite")
    public ResponseEntity<ApiResponse<Boolean>> toggleFavorite(@PathVariable Long id) {
        boolean fav = journalService.toggleFavorite(id);
        return ResponseEntity.ok(ApiResponse.success("Favorite toggled", fav));
    }

    @DeleteMapping("/entries/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEntry(@PathVariable Long id) {
        journalService.deleteEntry(id);
        return ResponseEntity.ok(ApiResponse.success("Journal entry removed", null));
    }
}
