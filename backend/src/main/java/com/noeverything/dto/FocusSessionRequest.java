package com.noeverything.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class FocusSessionRequest {
    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be at least 1 minute")
    private Integer durationMinutes;
    private String sessionType = "POMODORO";
    private String tag = "DEEP_WORK";
    private String notes;

    public FocusSessionRequest() {}

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public String getSessionType() { return sessionType; }
    public void setSessionType(String sessionType) { this.sessionType = sessionType; }

    public String getTag() { return tag; }
    public void setTag(String tag) { this.tag = tag; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
