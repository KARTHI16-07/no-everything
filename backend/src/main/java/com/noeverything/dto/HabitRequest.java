package com.noeverything.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public class HabitRequest {
    @NotBlank(message = "Title is required")
    private String title;
    private String description;
    private String category = "DISCIPLINE";
    private Integer targetDaysPerWeek = 7;

    public HabitRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getTargetDaysPerWeek() { return targetDaysPerWeek; }
    public void setTargetDaysPerWeek(Integer targetDaysPerWeek) { this.targetDaysPerWeek = targetDaysPerWeek; }
}
