package com.noeverything.dto;

public class ProfileUpdateRequest {
    private String fullName;
    private String bio;
    private String avatarUrl;
    private Integer focusGoalDailyMinutes;
    private Integer habitGoalDailyCount;
    private Integer taskGoalDailyCount;
    private String themePreference;
    private Boolean soundEnabled;
    private Boolean notificationsEnabled;

    public ProfileUpdateRequest() {}

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public Integer getFocusGoalDailyMinutes() { return focusGoalDailyMinutes; }
    public void setFocusGoalDailyMinutes(Integer focusGoalDailyMinutes) { this.focusGoalDailyMinutes = focusGoalDailyMinutes; }

    public Integer getHabitGoalDailyCount() { return habitGoalDailyCount; }
    public void setHabitGoalDailyCount(Integer habitGoalDailyCount) { this.habitGoalDailyCount = habitGoalDailyCount; }

    public Integer getTaskGoalDailyCount() { return taskGoalDailyCount; }
    public void setTaskGoalDailyCount(Integer taskGoalDailyCount) { this.taskGoalDailyCount = taskGoalDailyCount; }

    public String getThemePreference() { return themePreference; }
    public void setThemePreference(String themePreference) { this.themePreference = themePreference; }

    public Boolean getSoundEnabled() { return soundEnabled; }
    public void setSoundEnabled(Boolean soundEnabled) { this.soundEnabled = soundEnabled; }

    public Boolean getNotificationsEnabled() { return notificationsEnabled; }
    public void setNotificationsEnabled(Boolean notificationsEnabled) { this.notificationsEnabled = notificationsEnabled; }
}
