package com.noeverything.dto;

import java.time.LocalDateTime;

public class MilestoneDto {
    private Long id;
    private String title;
    private boolean completed;
    private LocalDateTime completedAt;
    private Integer orderIndex;

    public MilestoneDto() {}

    public MilestoneDto(Long id, String title, boolean completed, LocalDateTime completedAt, Integer orderIndex) {
        this.id = id;
        this.title = title;
        this.completed = completed;
        this.completedAt = completedAt;
        this.orderIndex = orderIndex;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
}
