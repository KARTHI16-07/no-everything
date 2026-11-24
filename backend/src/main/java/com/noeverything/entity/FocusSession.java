package com.noeverything.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "focus_sessions")
public class FocusSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes;

    @Column(name = "session_type", nullable = false, length = 30)
    private String sessionType = "POMODORO"; // POMODORO, SHORT_BREAK, LONG_BREAK, CUSTOM

    @Column(name = "completed_at", nullable = false)
    private LocalDateTime completedAt = LocalDateTime.now();

    @Column(length = 255)
    private String notes;

    @Column(length = 40)
    private String tag = "DEEP_WORK";

    public FocusSession() {}

    public FocusSession(User user, Integer durationMinutes, String sessionType, String tag, String notes) {
        this.user = user;
        this.durationMinutes = durationMinutes;
        this.sessionType = sessionType != null ? sessionType : "POMODORO";
        this.tag = tag != null ? tag : "DEEP_WORK";
        this.notes = notes;
        this.completedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public String getSessionType() { return sessionType; }
    public void setSessionType(String sessionType) { this.sessionType = sessionType; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getTag() { return tag; }
    public void setTag(String tag) { this.tag = tag; }
}
