package com.noeverything.controller;

import com.noeverything.dto.AchievementDto;
import com.noeverything.dto.ApiResponse;
import com.noeverything.service.AchievementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/achievements")
public class AchievementController {

    private final AchievementService achievementService;

    public AchievementController(AchievementService achievementService) {
        this.achievementService = achievementService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AchievementDto>>> getAchievements() {
        List<AchievementDto> achievements = achievementService.getAchievementsForCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(achievements));
    }
}
