package com.noeverything.controller;

import com.noeverything.dto.ApiResponse;
import com.noeverything.dto.GoalRequest;
import com.noeverything.dto.GoalResponse;
import com.noeverything.service.GoalService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

    private final GoalService goalService;

    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<GoalResponse>>> getGoals(@RequestParam(required = false) String type) {
        List<GoalResponse> goals = goalService.getGoalsForCurrentUser(type);
        return ResponseEntity.ok(ApiResponse.success(goals));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<GoalResponse>> createGoal(@Valid @RequestBody GoalRequest request) {
        GoalResponse created = goalService.createGoal(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Goal created", created));
    }

    @PostMapping("/{goalId}/milestones/{milestoneId}/toggle")
    public ResponseEntity<ApiResponse<GoalResponse>> toggleMilestone(
            @PathVariable Long goalId,
            @PathVariable Long milestoneId) {
        GoalResponse updated = goalService.toggleMilestone(goalId, milestoneId);
        return ResponseEntity.ok(ApiResponse.success("Milestone updated", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteGoal(@PathVariable Long id) {
        goalService.deleteGoal(id);
        return ResponseEntity.ok(ApiResponse.success("Goal deleted", null));
    }
}
