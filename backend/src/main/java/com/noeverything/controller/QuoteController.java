package com.noeverything.controller;

import com.noeverything.dto.ApiResponse;
import com.noeverything.dto.DashboardSummaryResponse;
import com.noeverything.service.QuoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quotes")
public class QuoteController {

    private final QuoteService quoteService;

    public QuoteController(QuoteService quoteService) {
        this.quoteService = quoteService;
    }

    @GetMapping("/daily")
    public ResponseEntity<ApiResponse<DashboardSummaryResponse.QuoteDto>> getDailyQuote() {
        DashboardSummaryResponse.QuoteDto quote = quoteService.getDailyQuote();
        return ResponseEntity.ok(ApiResponse.success(quote));
    }

    @GetMapping("/random")
    public ResponseEntity<ApiResponse<DashboardSummaryResponse.QuoteDto>> getRandomQuote() {
        DashboardSummaryResponse.QuoteDto quote = quoteService.getRandomQuote();
        return ResponseEntity.ok(ApiResponse.success(quote));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<DashboardSummaryResponse.QuoteDto>>> searchQuotes(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category) {
        List<DashboardSummaryResponse.QuoteDto> quotes = quoteService.searchQuotes(query, category);
        return ResponseEntity.ok(ApiResponse.success(quotes));
    }

    @PostMapping("/{id}/favorite")
    public ResponseEntity<ApiResponse<Boolean>> toggleFavorite(@PathVariable Long id) {
        boolean isFav = quoteService.toggleFavorite(id);
        String msg = isFav ? "Quote added to favorites" : "Quote removed from favorites";
        return ResponseEntity.ok(ApiResponse.success(msg, isFav));
    }

    @GetMapping("/favorites")
    public ResponseEntity<ApiResponse<List<DashboardSummaryResponse.QuoteDto>>> getFavorites() {
        List<DashboardSummaryResponse.QuoteDto> favorites = quoteService.getUserFavorites();
        return ResponseEntity.ok(ApiResponse.success(favorites));
    }
}
