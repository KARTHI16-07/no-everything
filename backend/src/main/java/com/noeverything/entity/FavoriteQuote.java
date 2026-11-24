package com.noeverything.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "favorite_quotes", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "quote_id"})
})
public class FavoriteQuote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "quote_id", nullable = false)
    private DailyQuote quote;

    @Column(name = "saved_at")
    private LocalDateTime savedAt = LocalDateTime.now();

    public FavoriteQuote() {}

    public FavoriteQuote(User user, DailyQuote quote) {
        this.user = user;
        this.quote = quote;
        this.savedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public DailyQuote getQuote() { return quote; }
    public void setQuote(DailyQuote quote) { this.quote = quote; }

    public LocalDateTime getSavedAt() { return savedAt; }
    public void setSavedAt(LocalDateTime savedAt) { this.savedAt = savedAt; }
}
