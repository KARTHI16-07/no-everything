package com.noeverything.controller;

import com.noeverything.dto.ApiResponse;
import com.noeverything.dto.HabitRequest;
import com.noeverything.dto.HabitResponse;
import com.noeverything.service.HabitService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/habits")
public class HabitController {

    private final HabitService habitService;

    public HabitController(HabitService habitService) {
        this.habitService = habitService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<HabitResponse>>> getHabits() {
        List<HabitResponse> habits = habitService.getHabitsForCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(habits));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<HabitResponse>> createHabit(@Valid @RequestBody HabitRequest request) {
        HabitResponse created = habitService.createHabit(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Habit created", created));
    }

    @PostMapping("/{id}/toggle")
    public ResponseEntity<ApiResponse<HabitResponse>> toggleHabit(
            @PathVariable Long id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        HabitResponse updated = habitService.toggleHabit(id, date);
        return ResponseEntity.ok(ApiResponse.success("Habit updated", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteHabit(@PathVariable Long id) {
        habitService.deleteHabit(id);
        return ResponseEntity.ok(ApiResponse.success("Habit deleted", null));
    }
}
