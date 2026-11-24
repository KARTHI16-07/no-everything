package com.noeverything.dto;

import java.time.LocalDateTime;

public class ChallengeDto {
    private Long id;
    private String code;
    private String title;
    private String description;
    private String category;
    private Integer targetValue;
    private String unitLabel;
    private Integer durationDays;
    private String type;
    private Integer xpReward;
    private String icon;
    private Integer userCurrentValue;
    private boolean userCompleted;
    private LocalDateTime userCompletedAt;
    private boolean joined;

    public ChallengeDto() {}

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

    public Integer getUserCurrentValue() { return userCurrentValue; }
    public void setUserCurrentValue(Integer userCurrentValue) { this.userCurrentValue = userCurrentValue; }

    public boolean isUserCompleted() { return userCompleted; }
    public void setUserCompleted(boolean userCompleted) { this.userCompleted = userCompleted; }

    public LocalDateTime getUserCompletedAt() { return userCompletedAt; }
    public void setUserCompletedAt(LocalDateTime userCompletedAt) { this.userCompletedAt = userCompletedAt; }

    public boolean isJoined() { return joined; }
    public void setJoined(boolean joined) { this.joined = joined; }
}
