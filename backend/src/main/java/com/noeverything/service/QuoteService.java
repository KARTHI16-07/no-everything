package com.noeverything.service;

import com.noeverything.dto.DashboardSummaryResponse;
import com.noeverything.entity.DailyQuote;
import com.noeverything.entity.FavoriteQuote;
import com.noeverything.entity.User;
import com.noeverything.exception.ResourceNotFoundException;
import com.noeverything.repository.DailyQuoteRepository;
import com.noeverything.repository.FavoriteQuoteRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class QuoteService {

    private final DailyQuoteRepository dailyQuoteRepository;
    private final FavoriteQuoteRepository favoriteQuoteRepository;
    private final AuthService authService;

    public QuoteService(DailyQuoteRepository dailyQuoteRepository,
                        FavoriteQuoteRepository favoriteQuoteRepository,
                        AuthService authService) {
        this.dailyQuoteRepository = dailyQuoteRepository;
        this.favoriteQuoteRepository = favoriteQuoteRepository;
        this.authService = authService;
    }

    public DashboardSummaryResponse.QuoteDto getDailyQuote() {
        String todayKey = LocalDate.now().toString();
        Optional<DailyQuote> quoteOpt = dailyQuoteRepository.findByDateKey(todayKey);

        DailyQuote quote = quoteOpt.orElseGet(() -> {
            List<DailyQuote> all = dailyQuoteRepository.findAll();
            if (all.isEmpty()) {
                DailyQuote fallback = new DailyQuote(
                        "We exist to create and champion the exceptional.",
                        "NO EVERYTHING MANIFESTO",
                        "VISION",
                        "Mastery requires radical elimination of the non-essential.",
                        "Foundational Architecture"
                );
                return dailyQuoteRepository.save(fallback);
            }
            int index = Math.abs(LocalDate.now().getDayOfYear()) % all.size();
            return all.get(index);
        });

        boolean isFav = false;
        try {
            User user = authService.getCurrentAuthenticatedUser();
            isFav = favoriteQuoteRepository.existsByUserAndQuote(user, quote);
        } catch (Exception ignored) {}

        return new DashboardSummaryResponse.QuoteDto(
                quote.getId(),
                quote.getQuoteText(),
                quote.getAuthor(),
                quote.getCategory(),
                quote.getExplanation(),
                isFav
        );
    }

    public DashboardSummaryResponse.QuoteDto getRandomQuote() {
        List<DailyQuote> all = dailyQuoteRepository.findAll();
        if (all.isEmpty()) {
            return getDailyQuote();
        }
        int randIndex = (int) (Math.random() * all.size());
        DailyQuote quote = all.get(randIndex);

        boolean isFav = false;
        try {
            User user = authService.getCurrentAuthenticatedUser();
            isFav = favoriteQuoteRepository.existsByUserAndQuote(user, quote);
        } catch (Exception ignored) {}

        return new DashboardSummaryResponse.QuoteDto(
                quote.getId(),
                quote.getQuoteText(),
                quote.getAuthor(),
                quote.getCategory(),
                quote.getExplanation(),
                isFav
        );
    }

    public List<DashboardSummaryResponse.QuoteDto> searchQuotes(String query, String category) {
        List<DailyQuote> quotes;
        if (category != null && !category.isBlank() && !"ALL".equalsIgnoreCase(category)) {
            quotes = dailyQuoteRepository.findByCategoryIgnoreCase(category);
        } else if (query != null && !query.isBlank()) {
            quotes = dailyQuoteRepository.findByQuoteTextContainingIgnoreCaseOrAuthorContainingIgnoreCase(query, query);
        } else {
            quotes = dailyQuoteRepository.findAll();
        }

        User user = null;
        try {
            user = authService.getCurrentAuthenticatedUser();
        } catch (Exception ignored) {}

        final User currentUser = user;
        return quotes.stream().map(q -> {
            boolean isFav = currentUser != null && favoriteQuoteRepository.existsByUserAndQuote(currentUser, q);
            return new DashboardSummaryResponse.QuoteDto(
                    q.getId(),
                    q.getQuoteText(),
                    q.getAuthor(),
                    q.getCategory(),
                    q.getExplanation(),
                    isFav
            );
        }).collect(Collectors.toList());
    }

    @Transactional
    public boolean toggleFavorite(Long quoteId) {
        User user = authService.getCurrentAuthenticatedUser();
        DailyQuote quote = dailyQuoteRepository.findById(quoteId)
                .orElseThrow(() -> new ResourceNotFoundException("Quote not found with id: " + quoteId));

        Optional<FavoriteQuote> existing = favoriteQuoteRepository.findByUserAndQuote(user, quote);
        if (existing.isPresent()) {
            favoriteQuoteRepository.delete(existing.get());
            return false;
        } else {
            FavoriteQuote fav = new FavoriteQuote(user, quote);
            favoriteQuoteRepository.save(fav);
            return true;
        }
    }

    public List<DashboardSummaryResponse.QuoteDto> getUserFavorites() {
        User user = authService.getCurrentAuthenticatedUser();
        return favoriteQuoteRepository.findByUserOrderBySavedAtDesc(user).stream()
                .map(fq -> new DashboardSummaryResponse.QuoteDto(
                        fq.getQuote().getId(),
                        fq.getQuote().getQuoteText(),
                        fq.getQuote().getAuthor(),
                        fq.getQuote().getCategory(),
                        fq.getQuote().getExplanation(),
                        true
                ))
                .collect(Collectors.toList());
    }
}
