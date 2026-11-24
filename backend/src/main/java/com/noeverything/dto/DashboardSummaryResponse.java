package com.noeverything.dto;

import java.util.List;
import java.util.Map;

public class DashboardSummaryResponse {
    private String welcomeMessage;
    private String currentDate;
    private QuoteDto dailyQuote;
    private int completedTasksToday;
    private int totalTasksToday;
    private int habitsCompletedToday;
    private int totalHabitsToday;
    private int focusMinutesToday;
    private int focusGoalMinutes;
    private int currentStreakDays;
    private int bestStreakDays;
    private int readinessIndex; // 0 - 100 based on composite execution
    private List<TaskResponse> upcomingTasks;
    private List<ActivityItemDto> recentActivities;
    private List<HabitResponse> activeHabits;
    private Map<String, Integer> weeklyFocusMinutes;

    public static class QuoteDto {
        private Long id;
        private String quoteText;
        private String author;
        private String category;
        private String explanation;
        private boolean isFavorite;

        public QuoteDto() {}

        public QuoteDto(Long id, String quoteText, String author, String category, String explanation, boolean isFavorite) {
            this.id = id;
            this.quoteText = quoteText;
            this.author = author;
            this.category = category;
            this.explanation = explanation;
            this.isFavorite = isFavorite;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getQuoteText() { return quoteText; }
        public void setQuoteText(String quoteText) { this.quoteText = quoteText; }
        public String getAuthor() { return author; }
        public void setAuthor(String author) { this.author = author; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public String getExplanation() { return explanation; }
        public void setExplanation(String explanation) { this.explanation = explanation; }
        public boolean isFavorite() { return isFavorite; }
        public void setFavorite(boolean favorite) { isFavorite = favorite; }
    }

    public static class ActivityItemDto {
        private String id;
        private String type; // FOCUS, HABIT, TASK, NQT, JOURNAL
        private String title;
        private String description;
        private String timestamp;

        public ActivityItemDto() {}

        public ActivityItemDto(String id, String type, String title, String description, String timestamp) {
            this.id = id;
            this.type = type;
            this.title = title;
            this.description = description;
            this.timestamp = timestamp;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getTimestamp() { return timestamp; }
        public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
    }

    public DashboardSummaryResponse() {}

    public String getWelcomeMessage() { return welcomeMessage; }
    public void setWelcomeMessage(String welcomeMessage) { this.welcomeMessage = welcomeMessage; }

    public String getCurrentDate() { return currentDate; }
    public void setCurrentDate(String currentDate) { this.currentDate = currentDate; }

    public QuoteDto getDailyQuote() { return dailyQuote; }
    public void setDailyQuote(QuoteDto dailyQuote) { this.dailyQuote = dailyQuote; }

    public int getCompletedTasksToday() { return completedTasksToday; }
    public void setCompletedTasksToday(int completedTasksToday) { this.completedTasksToday = completedTasksToday; }

    public int getTotalTasksToday() { return totalTasksToday; }
    public void setTotalTasksToday(int totalTasksToday) { this.totalTasksToday = totalTasksToday; }

    public int getHabitsCompletedToday() { return habitsCompletedToday; }
    public void setHabitsCompletedToday(int habitsCompletedToday) { this.habitsCompletedToday = habitsCompletedToday; }

    public int getTotalHabitsToday() { return totalHabitsToday; }
    public void setTotalHabitsToday(int totalHabitsToday) { this.totalHabitsToday = totalHabitsToday; }

    public int getFocusMinutesToday() { return focusMinutesToday; }
    public void setFocusMinutesToday(int focusMinutesToday) { this.focusMinutesToday = focusMinutesToday; }

    public int getFocusGoalMinutes() { return focusGoalMinutes; }
    public void setFocusGoalMinutes(int focusGoalMinutes) { this.focusGoalMinutes = focusGoalMinutes; }

    public int getCurrentStreakDays() { return currentStreakDays; }
    public void setCurrentStreakDays(int currentStreakDays) { this.currentStreakDays = currentStreakDays; }

    public int getBestStreakDays() { return bestStreakDays; }
    public void setBestStreakDays(int bestStreakDays) { this.bestStreakDays = bestStreakDays; }

    public int getReadinessIndex() { return readinessIndex; }
    public void setReadinessIndex(int readinessIndex) { this.readinessIndex = readinessIndex; }

    public List<TaskResponse> getUpcomingTasks() { return upcomingTasks; }
    public void setUpcomingTasks(List<TaskResponse> upcomingTasks) { this.upcomingTasks = upcomingTasks; }

    public List<ActivityItemDto> getRecentActivities() { return recentActivities; }
    public void setRecentActivities(List<ActivityItemDto> recentActivities) { this.recentActivities = recentActivities; }

    public List<HabitResponse> getActiveHabits() { return activeHabits; }
    public void setActiveHabits(List<HabitResponse> activeHabits) { this.activeHabits = activeHabits; }

    public Map<String, Integer> getWeeklyFocusMinutes() { return weeklyFocusMinutes; }
    public void setWeeklyFocusMinutes(Map<String, Integer> weeklyFocusMinutes) { this.weeklyFocusMinutes = weeklyFocusMinutes; }
}
