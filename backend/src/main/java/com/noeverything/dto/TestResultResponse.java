package com.noeverything.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class TestResultResponse {
    private Long id;
    private String testTitle;
    private String topic;
    private Integer totalQuestions;
    private Integer score;
    private Integer totalMarks;
    private Double percentage;
    private Integer timeTakenSeconds;
    private boolean passed;
    private LocalDateTime completedAt;
    private List<QuestionReviewDto> questionReviews;
    private Map<String, Integer> topicAccuracy; // topic -> accuracy %

    public static class QuestionReviewDto {
        private Long questionId;
        private String questionText;
        private String codeSnippet;
        private String explanation;
        private String selectedOption;
        private String correctOption;
        private boolean isCorrect;
        private List<OptionDto> options;

        public QuestionReviewDto() {}

        public Long getQuestionId() { return questionId; }
        public void setQuestionId(Long questionId) { this.questionId = questionId; }

        public String getQuestionText() { return questionText; }
        public void setQuestionText(String questionText) { this.questionText = questionText; }

        public String getCodeSnippet() { return codeSnippet; }
        public void setCodeSnippet(String codeSnippet) { this.codeSnippet = codeSnippet; }

        public String getExplanation() { return explanation; }
        public void setExplanation(String explanation) { this.explanation = explanation; }

        public String getSelectedOption() { return selectedOption; }
        public void setSelectedOption(String selectedOption) { this.selectedOption = selectedOption; }

        public String getCorrectOption() { return correctOption; }
        public void setCorrectOption(String correctOption) { this.correctOption = correctOption; }

        public boolean isCorrect() { return isCorrect; }
        public void setCorrect(boolean correct) { isCorrect = correct; }

        public List<OptionDto> getOptions() { return options; }
        public void setOptions(List<OptionDto> options) { this.options = options; }
    }

    public TestResultResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTestTitle() { return testTitle; }
    public void setTestTitle(String testTitle) { this.testTitle = testTitle; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public Integer getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(Integer totalQuestions) { this.totalQuestions = totalQuestions; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public Integer getTotalMarks() { return totalMarks; }
    public void setTotalMarks(Integer totalMarks) { this.totalMarks = totalMarks; }

    public Double getPercentage() { return percentage; }
    public void setPercentage(Double percentage) { this.percentage = percentage; }

    public Integer getTimeTakenSeconds() { return timeTakenSeconds; }
    public void setTimeTakenSeconds(Integer timeTakenSeconds) { this.timeTakenSeconds = timeTakenSeconds; }

    public boolean isPassed() { return passed; }
    public void setPassed(boolean passed) { this.passed = passed; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public List<QuestionReviewDto> getQuestionReviews() { return questionReviews; }
    public void setQuestionReviews(List<QuestionReviewDto> questionReviews) { this.questionReviews = questionReviews; }

    public Map<String, Integer> getTopicAccuracy() { return topicAccuracy; }
    public void setTopicAccuracy(Map<String, Integer> topicAccuracy) { this.topicAccuracy = topicAccuracy; }
}
