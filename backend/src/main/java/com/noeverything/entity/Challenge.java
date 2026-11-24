package com.noeverything.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "challenges")
public class Challenge {

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
    private String category = "FOCUS"; // FOCUS, HABIT, NQT, DISCIPLINE

    @Column(name = "target_value", nullable = false)
    private Integer targetValue = 1;

    @Column(name = "unit_label", length = 30)
    private String unitLabel = "sessions";

    @Column(name = "duration_days")
    private Integer durationDays = 1;

    @Column(nullable = false, length = 20)
    private String type = "DAILY"; // DAILY, WEEKLY, SPECIAL

    @Column(name = "xp_reward")
    private Integer xpReward = 100;

    @Column(length = 40)
    private String icon = "Zap";

    public Challenge() {}

    public Challenge(String code, String title, String description, String category, Integer targetValue, String unitLabel, String type, Integer xpReward, String icon) {
        this.code = code;
        this.title = title;
        this.description = description;
        this.category = category;
        this.targetValue = targetValue;
        this.unitLabel = unitLabel;
        this.type = type;
        this.xpReward = xpReward;
        this.icon = icon;
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

    public Integer getTargetValue() { return targetValue; }
    public void setTargetValue(Integer targetValue) { this.targetValue = targetValue; }

    public String getUnitLabel() { return unitLabel; }
    public void setUnitLabel(String unitLabel) { this.unitLabel = unitLabel; }

    public Integer getDurationDays() { return durationDays; }
    public void setDurationDays(Integer durationDays) { this.durationDays = durationDays; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Integer getXpReward() { return xpReward; }
    public void setXpReward(Integer xpReward) { this.xpReward = xpReward; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
}
