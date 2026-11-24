package com.noeverything.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "achievements")
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false, length = 120)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(length = 40)
    private String category = "GENERAL"; // FOCUS, HABIT, NQT, DISCIPLINE, MASTERY

    @Column(name = "badge_icon", length = 40)
    private String badgeIcon = "Award";

    @Column(name = "condition_type", nullable = false, length = 50)
    private String conditionType; // FOCUS_MINUTES, HABIT_STREAK, TASKS_COMPLETED, NQT_TESTS, JOURNAL_ENTRIES

    @Column(name = "threshold_value", nullable = false)
    private Integer thresholdValue = 1;

    @Column(length = 20)
    private String rarity = "COMMON"; // COMMON, RARE, EPIC, LEGENDARY

    public Achievement() {}

    public Achievement(String code, String title, String description, String category, String badgeIcon, String conditionType, Integer thresholdValue, String rarity) {
        this.code = code;
        this.title = title;
        this.description = description;
        this.category = category;
        this.badgeIcon = badgeIcon;
        this.conditionType = conditionType;
        this.thresholdValue = thresholdValue;
        this.rarity = rarity;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getBadgeIcon() { return badgeIcon; }
    public void setBadgeIcon(String badgeIcon) { this.badgeIcon = badgeIcon; }

    public String getConditionType() { return conditionType; }
    public void setConditionType(String conditionType) { this.conditionType = conditionType; }

    public Integer getThresholdValue() { return thresholdValue; }
    public void setThresholdValue(Integer thresholdValue) { this.thresholdValue = thresholdValue; }

    public String getRarity() { return rarity; }
    public void setRarity(String rarity) { this.rarity = rarity; }
}
