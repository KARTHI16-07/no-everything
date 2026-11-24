package com.noeverything.dto;

import java.util.List;
import java.util.Map;

public class AnalyticsResponse {
    private double overallGrowthIndex;
    private double totalFocusHours;
    private long totalCompletedTasks;
    private long totalJournalEntries;
    private int totalNqtTestsTaken;
    private double nqtAverageScore;

    private List<ProductivityPoint> weeklyProductivity;
    private List<HabitConsistencyItem> habitConsistency;
    private List<FocusTrendItem> focusDistributionByTag;
    private Map<String, Integer> tasksByPriority;
    private Map<String, Integer> tasksByCategory;
    private Map<String, Double> topicAccuracy;

    public static class ProductivityPoint {
        private String day;
        private int focusMinutes;
        private int tasksCompleted;
        private int habitsCompleted;
        private int productivityScore;

        public ProductivityPoint() {}

        public ProductivityPoint(String day, int focusMinutes, int tasksCompleted, int habitsCompleted, int productivityScore) {
            this.day = day;
            this.focusMinutes = focusMinutes;
            this.tasksCompleted = tasksCompleted;
            this.habitsCompleted = habitsCompleted;
            this.productivityScore = productivityScore;
        }

        public String getDay() { return day; }
        public void setDay(String day) { this.day = day; }
        public int getFocusMinutes() { return focusMinutes; }
        public void setFocusMinutes(int focusMinutes) { this.focusMinutes = focusMinutes; }
        public int getTasksCompleted() { return tasksCompleted; }
        public void setTasksCompleted(int tasksCompleted) { this.tasksCompleted = tasksCompleted; }
        public int getHabitsCompleted() { return habitsCompleted; }
        public void setHabitsCompleted(int habitsCompleted) { this.habitsCompleted = habitsCompleted; }
        public int getProductivityScore() { return productivityScore; }
        public void setProductivityScore(int productivityScore) { this.productivityScore = productivityScore; }
    }

    public static class HabitConsistencyItem {
        private String habitName;
        private String category;
        private int streak;
        private int completionRate;

        public HabitConsistencyItem() {}

        public HabitConsistencyItem(String habitName, String category, int streak, int completionRate) {
            this.habitName = habitName;
            this.category = category;
            this.streak = streak;
            this.completionRate = completionRate;
        }

        public String getHabitName() { return habitName; }
        public void setHabitName(String habitName) { this.habitName = habitName; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public int getStreak() { return streak; }
        public void setStreak(int streak) { this.streak = streak; }
        public int getCompletionRate() { return completionRate; }
        public void setCompletionRate(int completionRate) { this.completionRate = completionRate; }
    }

    public static class FocusTrendItem {
        private String tag;
        private int minutes;

        public FocusTrendItem() {}

        public FocusTrendItem(String tag, int minutes) {
            this.tag = tag;
            this.minutes = minutes;
        }

        public String getTag() { return tag; }
        public void setTag(String tag) { this.tag = tag; }
        public int getMinutes() { return minutes; }
        public void setMinutes(int minutes) { this.minutes = minutes; }
    }

    public AnalyticsResponse() {}

    public double getOverallGrowthIndex() { return overallGrowthIndex; }
    public void setOverallGrowthIndex(double overallGrowthIndex) { this.overallGrowthIndex = overallGrowthIndex; }

    public double getTotalFocusHours() { return totalFocusHours; }
    public void setTotalFocusHours(double totalFocusHours) { this.totalFocusHours = totalFocusHours; }

    public long getTotalCompletedTasks() { return totalCompletedTasks; }
    public void setTotalCompletedTasks(long totalCompletedTasks) { this.totalCompletedTasks = totalCompletedTasks; }

    public long getTotalJournalEntries() { return totalJournalEntries; }
    public void setTotalJournalEntries(long totalJournalEntries) { this.totalJournalEntries = totalJournalEntries; }

    public int getTotalNqtTestsTaken() { return totalNqtTestsTaken; }
    public void setTotalNqtTestsTaken(int totalNqtTestsTaken) { this.totalNqtTestsTaken = totalNqtTestsTaken; }

    public double getNqtAverageScore() { return nqtAverageScore; }
    public void setNqtAverageScore(double nqtAverageScore) { this.nqtAverageScore = nqtAverageScore; }

    public List<ProductivityPoint> getWeeklyProductivity() { return weeklyProductivity; }
    public void setWeeklyProductivity(List<ProductivityPoint> weeklyProductivity) { this.weeklyProductivity = weeklyProductivity; }

    public List<HabitConsistencyItem> getHabitConsistency() { return habitConsistency; }
    public void setHabitConsistency(List<HabitConsistencyItem> habitConsistency) { this.habitConsistency = habitConsistency; }

    public List<FocusTrendItem> getFocusDistributionByTag() { return focusDistributionByTag; }
    public void setFocusDistributionByTag(List<FocusTrendItem> focusDistributionByTag) { this.focusDistributionByTag = focusDistributionByTag; }

    public Map<String, Integer> getTasksByPriority() { return tasksByPriority; }
    public void setTasksByPriority(Map<String, Integer> tasksByPriority) { this.tasksByPriority = tasksByPriority; }

    public Map<String, Integer> getTasksByCategory() { return tasksByCategory; }
    public void setTasksByCategory(Map<String, Integer> tasksByCategory) { this.tasksByCategory = tasksByCategory; }

    public Map<String, Double> getTopicAccuracy() { return topicAccuracy; }
    public void setTopicAccuracy(Map<String, Double> topicAccuracy) { this.topicAccuracy = topicAccuracy; }
}
