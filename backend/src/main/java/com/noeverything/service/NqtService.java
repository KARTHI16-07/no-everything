package com.noeverything.service;

import com.noeverything.dto.*;
import com.noeverything.entity.*;
import com.noeverything.exception.ResourceNotFoundException;
import com.noeverything.repository.QuestionRepository;
import com.noeverything.repository.TestAttemptRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class NqtService {

    private final QuestionRepository questionRepository;
    private final TestAttemptRepository testAttemptRepository;
    private final AuthService authService;

    public NqtService(QuestionRepository questionRepository,
                      TestAttemptRepository testAttemptRepository,
                      AuthService authService) {
        this.questionRepository = questionRepository;
        this.testAttemptRepository = testAttemptRepository;
        this.authService = authService;
    }

    public List<QuestionDto> getPracticeQuestions(String topic, String difficulty, Boolean previousYear) {
        List<Question> questions;
        if (Boolean.TRUE.equals(previousYear)) {
            if (topic != null && !topic.isBlank() && !"ALL".equalsIgnoreCase(topic)) {
                questions = questionRepository.findByTopicIgnoreCaseAndPreviousYearTrue(topic);
            } else {
                questions = questionRepository.findByPreviousYearTrue();
            }
        } else if (topic != null && !topic.isBlank() && !"ALL".equalsIgnoreCase(topic)) {
            if (difficulty != null && !difficulty.isBlank() && !"ALL".equalsIgnoreCase(difficulty)) {
                questions = questionRepository.findByTopicIgnoreCaseAndDifficultyIgnoreCase(topic, difficulty);
            } else {
                questions = questionRepository.findByTopicIgnoreCase(topic);
            }
        } else {
            questions = questionRepository.findAll();
        }

        return questions.stream().map(q -> mapToDto(q, true)).collect(Collectors.toList());
    }

    public List<QuestionDto> generateMockTest(String topic, int questionCount) {
        int count = questionCount > 0 ? questionCount : 10;
        List<Question> list;
        if (topic != null && !topic.isBlank() && !"ALL".equalsIgnoreCase(topic)) {
            list = questionRepository.findRandomQuestionsByTopic(topic, count);
        } else {
            list = questionRepository.findRandomQuestions(count);
        }

        // Return questions without revealing correct answer for test mode
        return list.stream().map(q -> mapToDto(q, false)).collect(Collectors.toList());
    }

    @Transactional
    public TestResultResponse submitMockTest(TestSubmitRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        Map<Long, String> userAnswers = request.getAnswers() != null ? request.getAnswers() : new HashMap<>();

        List<Question> questions = questionRepository.findAllById(userAnswers.keySet());
        if (questions.isEmpty() && !userAnswers.isEmpty()) {
            throw new ResourceNotFoundException("No valid questions found for submitted test");
        }

        int score = 0;
        int totalMarks = questions.size();
        List<TestResultResponse.QuestionReviewDto> reviews = new ArrayList<>();
        Map<String, int[]> topicScores = new HashMap<>(); // topic -> [correct, total]

        for (Question q : questions) {
            String selectedKey = userAnswers.get(q.getId());
            String correctKey = q.getOptions().stream()
                    .filter(QuestionOption::isCorrect)
                    .map(QuestionOption::getOptionKey)
                    .findFirst().orElse("");

            boolean isCorrect = correctKey.equalsIgnoreCase(selectedKey);
            if (isCorrect) {
                score++;
            }

            // Track topic accuracy
            topicScores.putIfAbsent(q.getTopic(), new int[]{0, 0});
            topicScores.get(q.getTopic())[1]++;
            if (isCorrect) {
                topicScores.get(q.getTopic())[0]++;
            }

            TestResultResponse.QuestionReviewDto review = new TestResultResponse.QuestionReviewDto();
            review.setQuestionId(q.getId());
            review.setQuestionText(q.getQuestionText());
            review.setCodeSnippet(q.getCodeSnippet());
            review.setExplanation(q.getExplanation());
            review.setSelectedOption(selectedKey);
            review.setCorrectOption(correctKey);
            review.setCorrect(isCorrect);
            review.setOptions(q.getOptions().stream()
                    .map(opt -> new OptionDto(opt.getOptionKey(), opt.getOptionText(), opt.isCorrect()))
                    .collect(Collectors.toList()));

            reviews.add(review);
        }

        boolean passed = totalMarks > 0 && ((double) score / totalMarks >= 0.60);

        TestAttempt attempt = new TestAttempt(
                user,
                request.getTestTitle() != null ? request.getTestTitle() : "NQT Practice Simulation",
                request.getTopic() != null ? request.getTopic() : "MIXED",
                questions.size(),
                score,
                totalMarks,
                request.getTimeTakenSeconds() != null ? request.getTimeTakenSeconds() : 0,
                passed
        );

        // Add answer records
        for (Question q : questions) {
            String selected = userAnswers.get(q.getId());
            String correctKey = q.getOptions().stream()
                    .filter(QuestionOption::isCorrect)
                    .map(QuestionOption::getOptionKey)
                    .findFirst().orElse("");
            TestAnswer ans = new TestAnswer(attempt, q, selected, correctKey.equalsIgnoreCase(selected));
            attempt.getAnswers().add(ans);
        }

        TestAttempt savedAttempt = testAttemptRepository.save(attempt);

        Map<String, Integer> topicAccuracyMap = new HashMap<>();
        topicScores.forEach((top, counts) -> {
            int pct = counts[1] > 0 ? (int) Math.round(((double) counts[0] / counts[1]) * 100) : 0;
            topicAccuracyMap.put(top, pct);
        });

        TestResultResponse response = new TestResultResponse();
        response.setId(savedAttempt.getId());
        response.setTestTitle(savedAttempt.getTestTitle());
        response.setTopic(savedAttempt.getTopic());
        response.setTotalQuestions(savedAttempt.getTotalQuestions());
        response.setScore(savedAttempt.getScore());
        response.setTotalMarks(savedAttempt.getTotalMarks());
        response.setPercentage(savedAttempt.getPercentage());
        response.setTimeTakenSeconds(savedAttempt.getTimeTakenSeconds());
        response.setPassed(savedAttempt.isPassed());
        response.setCompletedAt(savedAttempt.getCompletedAt());
        response.setQuestionReviews(reviews);
        response.setTopicAccuracy(topicAccuracyMap);

        return response;
    }

    public List<TestResultResponse> getUserTestHistory() {
        User user = authService.getCurrentAuthenticatedUser();
        List<TestAttempt> attempts = testAttemptRepository.findByUserOrderByCompletedAtDesc(user);

        return attempts.stream().map(a -> {
            TestResultResponse res = new TestResultResponse();
            res.setId(a.getId());
            res.setTestTitle(a.getTestTitle());
            res.setTopic(a.getTopic());
            res.setTotalQuestions(a.getTotalQuestions());
            res.setScore(a.getScore());
            res.setTotalMarks(a.getTotalMarks());
            res.setPercentage(a.getPercentage());
            res.setTimeTakenSeconds(a.getTimeTakenSeconds());
            res.setPassed(a.isPassed());
            res.setCompletedAt(a.getCompletedAt());
            return res;
        }).collect(Collectors.toList());
    }

    private QuestionDto mapToDto(Question q, boolean includeAnswers) {
        QuestionDto dto = new QuestionDto();
        dto.setId(q.getId());
        dto.setTopic(q.getTopic());
        dto.setSubTopic(q.getSubTopic());
        dto.setDifficulty(q.getDifficulty());
        dto.setQuestionText(q.getQuestionText());
        dto.setCodeSnippet(q.getCodeSnippet());
        dto.setExplanation(includeAnswers ? q.getExplanation() : null);
        dto.setPreviousYear(q.isPreviousYear());
        dto.setExamSource(q.getExamSource());
        dto.setExamYear(q.getExamYear());

        List<OptionDto> optionDtos = q.getOptions().stream().map(opt ->
                new OptionDto(opt.getOptionKey(), opt.getOptionText(), includeAnswers ? opt.isCorrect() : null)
        ).collect(Collectors.toList());

        dto.setOptions(optionDtos);
        return dto;
    }
}
