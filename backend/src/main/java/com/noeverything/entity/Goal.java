package com.noeverything.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "goals")
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 40)
    private String category = "CAREER"; // CAREER, MASTERY, FITNESS, CODE

    @Column(name = "target_date")
    private LocalDate targetDate;

    @Column(name = "progress_percentage")
    private Integer progressPercentage = 0;

    @Column(nullable = false)
    private boolean completed = false;

    @Column(nullable = false, length = 20)
    private String type = "LONG_TERM"; // DAILY, WEEKLY, LONG_TERM

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "goal", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GoalMilestone> milestones = new ArrayList<>();

    public Goal() {}

    public Goal(User user, String title, String description, String category, String type, LocalDate targetDate) {
        this.user = user;
        this.title = title;
        this.description = description;
        this.category = category;
        this.type = type != null ? type : "LONG_TERM";
        this.targetDate = targetDate;
        this.progressPercentage = 0;
        this.completed = false;
        this.createdAt = LocalDateTime.now();
    }

    public void recalculateProgress() {
        if (milestones == null || milestones.isEmpty()) return;
        long doneCount = milestones.stream().filter(GoalMilestone::isCompleted).count();
        this.progressPercentage = (int) Math.round(((double) doneCount / milestones.size()) * 100);
        this.completed = this.progressPercentage == 100;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public LocalDate getTargetDate() { return targetDate; }
    public void setTargetDate(LocalDate targetDate) { this.targetDate = targetDate; }

    public Integer getProgressPercentage() { return progressPercentage; }
    public void setProgressPercentage(Integer progressPercentage) { this.progressPercentage = progressPercentage; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<GoalMilestone> getMilestones() { return milestones; }
    public void setMilestones(List<GoalMilestone> milestones) { this.milestones = milestones; }
}
