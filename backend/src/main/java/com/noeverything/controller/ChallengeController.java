package com.noeverything.controller;

import com.noeverything.dto.ApiResponse;
import com.noeverything.dto.ChallengeDto;
import com.noeverything.service.ChallengeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/challenges")
public class ChallengeController {

    private final ChallengeService challengeService;

    public ChallengeController(ChallengeService challengeService) {
        this.challengeService = challengeService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ChallengeDto>>> getChallenges(@RequestParam(required = false) String type) {
        List<ChallengeDto> challenges = challengeService.getChallengesForCurrentUser(type);
        return ResponseEntity.ok(ApiResponse.success(challenges));
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<ApiResponse<ChallengeDto>> joinChallenge(@PathVariable Long id) {
        ChallengeDto dto = challengeService.joinChallenge(id);
        return ResponseEntity.ok(ApiResponse.success("Enrolled in challenge", dto));
    }
}
