package com.noeverything.controller;

import com.noeverything.dto.ApiResponse;
import com.noeverything.dto.FocusSessionRequest;
import com.noeverything.dto.FocusSessionResponse;
import com.noeverything.dto.FocusStatsResponse;
import com.noeverything.service.FocusService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/focus")
public class FocusController {

    private final FocusService focusService;

    public FocusController(FocusService focusService) {
        this.focusService = focusService;
    }

    @PostMapping("/session")
    public ResponseEntity<ApiResponse<FocusSessionResponse>> recordSession(@Valid @RequestBody FocusSessionRequest request) {
        FocusSessionResponse response = focusService.recordSession(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Focus session saved", response));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<FocusStatsResponse>> getStats() {
        FocusStatsResponse stats = focusService.getFocusStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
