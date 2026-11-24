package com.noeverything.service;

import com.noeverything.dto.GoalRequest;
import com.noeverything.dto.GoalResponse;
import com.noeverything.dto.MilestoneDto;
import com.noeverything.entity.Goal;
import com.noeverything.entity.GoalMilestone;
import com.noeverything.entity.User;
import com.noeverything.exception.ResourceNotFoundException;
import com.noeverything.repository.GoalMilestoneRepository;
import com.noeverything.repository.GoalRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GoalService {

    private final GoalRepository goalRepository;
    private final GoalMilestoneRepository milestoneRepository;
    private final AuthService authService;

    public GoalService(GoalRepository goalRepository,
                       GoalMilestoneRepository milestoneRepository,
                       AuthService authService) {
        this.goalRepository = goalRepository;
        this.milestoneRepository = milestoneRepository;
        this.authService = authService;
    }

    public List<GoalResponse> getGoalsForCurrentUser(String type) {
        User user = authService.getCurrentAuthenticatedUser();
        List<Goal> goals = (type != null && !type.isBlank() && !"ALL".equalsIgnoreCase(type))
                ? goalRepository.findByUserAndTypeOrderByCreatedAtDesc(user, type)
                : goalRepository.findByUserOrderByCreatedAtDesc(user);

        return goals.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public GoalResponse createGoal(GoalRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        Goal goal = new Goal(
                user,
                request.getTitle().trim(),
                request.getDescription(),
                request.getCategory(),
                request.getType(),
                request.getTargetDate()
        );

        if (request.getMilestones() != null && !request.getMilestones().isEmpty()) {
            int order = 0;
            for (String mTitle : request.getMilestones()) {
                if (!mTitle.isBlank()) {
                    GoalMilestone milestone = new GoalMilestone(goal, mTitle.trim(), order++);
                    goal.getMilestones().add(milestone);
                }
            }
            goal.recalculateProgress();
        }

        Goal saved = goalRepository.save(goal);
        return mapToResponse(saved);
    }

    @Transactional
    public GoalResponse toggleMilestone(Long goalId, Long milestoneId) {
        User user = authService.getCurrentAuthenticatedUser();
        Goal goal = goalRepository.findByIdAndUser(goalId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + goalId));

        GoalMilestone milestone = goal.getMilestones().stream()
                .filter(m -> m.getId().equals(milestoneId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Milestone not found with id: " + milestoneId));

        milestone.setCompleted(!milestone.isCompleted());
        goal.recalculateProgress();
        Goal updated = goalRepository.save(goal);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteGoal(Long goalId) {
        User user = authService.getCurrentAuthenticatedUser();
        Goal goal = goalRepository.findByIdAndUser(goalId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + goalId));
        goalRepository.delete(goal);
    }

    private GoalResponse mapToResponse(Goal goal) {
        GoalResponse res = new GoalResponse();
        res.setId(goal.getId());
        res.setTitle(goal.getTitle());
        res.setDescription(goal.getDescription());
        res.setCategory(goal.getCategory());
        res.setType(goal.getType());
        res.setTargetDate(goal.getTargetDate());
        res.setProgressPercentage(goal.getProgressPercentage());
        res.setCompleted(goal.isCompleted());
        res.setCreatedAt(goal.getCreatedAt());

        List<MilestoneDto> milestoneDtos = goal.getMilestones().stream()
                .map(m -> new MilestoneDto(m.getId(), m.getTitle(), m.isCompleted(), m.getCompletedAt(), m.getOrderIndex()))
                .collect(Collectors.toList());
        res.setMilestones(milestoneDtos);

        return res;
    }
}
