package com.noeverything.dto;

import java.time.LocalDateTime;

public class FocusSessionResponse {
    private Long id;
    private Integer durationMinutes;
    private String sessionType;
    private String tag;
    private String notes;
    private LocalDateTime completedAt;

    public FocusSessionResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public String getSessionType() { return sessionType; }
    public void setSessionType(String sessionType) { this.sessionType = sessionType; }

    public String getTag() { return tag; }
    public void setTag(String tag) { this.tag = tag; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
