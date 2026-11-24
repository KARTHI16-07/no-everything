package com.noeverything.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user_profiles")
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "full_name")
    private String fullName;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "focus_goal_daily_minutes")
    private Integer focusGoalDailyMinutes = 100;

    @Column(name = "habit_goal_daily_count")
    private Integer habitGoalDailyCount = 5;

    @Column(name = "task_goal_daily_count")
    private Integer taskGoalDailyCount = 4;

    @Column(name = "theme_preference")
    private String themePreference = "dark";

    @Column(name = "sound_enabled")
    private boolean soundEnabled = true;

    @Column(name = "notifications_enabled")
    private boolean notificationsEnabled = true;

    public UserProfile() {}

    public UserProfile(User user) {
        this.user = user;
        this.fullName = user.getUsername();
        this.bio = "Dedicated to relentless self-mastery and deep execution.";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

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
