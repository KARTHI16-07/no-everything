package com.noeverything.controller;

import com.noeverything.dto.*;
import com.noeverything.service.NqtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nqt")
public class NqtController {

    private final NqtService nqtService;

    public NqtController(NqtService nqtService) {
        this.nqtService = nqtService;
    }

    @GetMapping("/practice")
    public ResponseEntity<ApiResponse<List<QuestionDto>>> getPracticeQuestions(
            @RequestParam(required = false) String topic,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) Boolean previousYear) {
        List<QuestionDto> questions = nqtService.getPracticeQuestions(topic, difficulty, previousYear);
        return ResponseEntity.ok(ApiResponse.success(questions));
    }

    @GetMapping("/sample-questions")
    public ResponseEntity<ApiResponse<List<QuestionDto>>> getSampleQuestions() {
        // Public sample preview for homepage showcase
        List<QuestionDto> questions = nqtService.getPracticeQuestions("JAVA", "INTERMEDIATE", null);
        List<QuestionDto> preview = questions.stream().limit(3).toList();
        return ResponseEntity.ok(ApiResponse.success(preview));
    }

    @GetMapping("/mock-test")
    public ResponseEntity<ApiResponse<List<QuestionDto>>> getMockTest(
            @RequestParam(required = false) String topic,
            @RequestParam(defaultValue = "10") int count) {
        List<QuestionDto> testQuestions = nqtService.generateMockTest(topic, count);
        return ResponseEntity.ok(ApiResponse.success(testQuestions));
    }

    @PostMapping("/submit-test")
    public ResponseEntity<ApiResponse<TestResultResponse>> submitTest(@RequestBody TestSubmitRequest request) {
        TestResultResponse result = nqtService.submitMockTest(request);
        return ResponseEntity.ok(ApiResponse.success("Test scored successfully", result));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<TestResultResponse>>> getTestHistory() {
        List<TestResultResponse> history = nqtService.getUserTestHistory();
        return ResponseEntity.ok(ApiResponse.success(history));
    }
}
