package com.noeverything.controller;

import com.noeverything.dto.AnalyticsResponse;
import com.noeverything.dto.ApiResponse;
import com.noeverything.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<AnalyticsResponse>> getAnalytics() {
        AnalyticsResponse analytics = analyticsService.getPersonalAnalytics();
        return ResponseEntity.ok(ApiResponse.success(analytics));
    }
}
