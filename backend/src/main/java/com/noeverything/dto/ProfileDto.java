package com.noeverything.dto;

public class ProfileDto {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String bio;
    private String avatarUrl;
    private Integer focusGoalDailyMinutes;
    private Integer habitGoalDailyCount;
    private Integer taskGoalDailyCount;
    private String themePreference;
    private boolean soundEnabled;
    private boolean notificationsEnabled;

    public ProfileDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

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

    public boolean isSoundEnabled() { return soundEnabled; }
    public void setSoundEnabled(boolean soundEnabled) { this.soundEnabled = soundEnabled; }

    public boolean isNotificationsEnabled() { return notificationsEnabled; }
    public void setNotificationsEnabled(boolean notificationsEnabled) { this.notificationsEnabled = notificationsEnabled; }
}
