package com.noeverything.dto;

import java.util.List;
import java.util.Map;

public class FocusStatsResponse {
    private int todayMinutes;
    private int weekMinutes;
    private int totalMinutes;
    private long totalSessions;
    private int dailyGoalMinutes;
    private double dailyGoalProgress;
    private List<FocusSessionResponse> recentSessions;
    private Map<String, Integer> weeklyBreakdown; // day string -> minutes

    public FocusStatsResponse() {}

    public int getTodayMinutes() { return todayMinutes; }
    public void setTodayMinutes(int todayMinutes) { this.todayMinutes = todayMinutes; }

    public int getWeekMinutes() { return weekMinutes; }
    public void setWeekMinutes(int weekMinutes) { this.weekMinutes = weekMinutes; }

    public int getTotalMinutes() { return totalMinutes; }
    public void setTotalMinutes(int totalMinutes) { this.totalMinutes = totalMinutes; }

    public long getTotalSessions() { return totalSessions; }
    public void setTotalSessions(long totalSessions) { this.totalSessions = totalSessions; }

    public int getDailyGoalMinutes() { return dailyGoalMinutes; }
    public void setDailyGoalMinutes(int dailyGoalMinutes) { this.dailyGoalMinutes = dailyGoalMinutes; }

    public double getDailyGoalProgress() { return dailyGoalProgress; }
    public void setDailyGoalProgress(double dailyGoalProgress) { this.dailyGoalProgress = dailyGoalProgress; }

    public List<FocusSessionResponse> getRecentSessions() { return recentSessions; }
    public void setRecentSessions(List<FocusSessionResponse> recentSessions) { this.recentSessions = recentSessions; }

    public Map<String, Integer> getWeeklyBreakdown() { return weeklyBreakdown; }
    public void setWeeklyBreakdown(Map<String, Integer> weeklyBreakdown) { this.weeklyBreakdown = weeklyBreakdown; }
}
