package com.noeverything.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public class HabitResponse {
    private Long id;
    private String title;
    private String description;
    private String category;
    private Integer targetDaysPerWeek;
    private Integer streakCount;
    private Integer bestStreak;
    private boolean completedToday;
    private boolean active;
    private Map<String, Boolean> recentLogs; // date string -> completed

    public HabitResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getTargetDaysPerWeek() { return targetDaysPerWeek; }
    public void setTargetDaysPerWeek(Integer targetDaysPerWeek) { this.targetDaysPerWeek = targetDaysPerWeek; }

    public Integer getStreakCount() { return streakCount; }
    public void setStreakCount(Integer streakCount) { this.streakCount = streakCount; }

    public Integer getBestStreak() { return bestStreak; }
    public void setBestStreak(Integer bestStreak) { this.bestStreak = bestStreak; }

    public boolean isCompletedToday() { return completedToday; }
    public void setCompletedToday(boolean completedToday) { this.completedToday = completedToday; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public Map<String, Boolean> getRecentLogs() { return recentLogs; }
    public void setRecentLogs(Map<String, Boolean> recentLogs) { this.recentLogs = recentLogs; }
}
