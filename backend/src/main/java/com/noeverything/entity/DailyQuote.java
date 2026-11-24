package com.noeverything.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "daily_quotes")
public class DailyQuote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String quoteText;

    @Column(nullable = false, length = 100)
    private String author;

    @Column(length = 50)
    private String category; // DISCIPLINE, VISION, MASTERY, FOCUS, RESILIENCE, ARCHITECTURE

    @Column(name = "date_key", length = 10)
    private String dateKey; // YYYY-MM-DD or null for pool

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(length = 150)
    private String source;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public DailyQuote() {}

    public DailyQuote(String quoteText, String author, String category, String explanation, String source) {
        this.quoteText = quoteText;
        this.author = author;
        this.category = category;
        this.explanation = explanation;
        this.source = source;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getQuoteText() { return quoteText; }
    public void setQuoteText(String quoteText) { this.quoteText = quoteText; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDateKey() { return dateKey; }
    public void setDateKey(String dateKey) { this.dateKey = dateKey; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
