package com.noeverything.dto;

import java.util.List;

public class QuestionDto {
    private Long id;
    private String topic;
    private String subTopic;
    private String difficulty;
    private String questionText;
    private String codeSnippet;
    private String explanation;
    private boolean previousYear;
    private String examSource;
    private Integer examYear;
    private List<OptionDto> options;

    public QuestionDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public String getSubTopic() { return subTopic; }
    public void setSubTopic(String subTopic) { this.subTopic = subTopic; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public String getCodeSnippet() { return codeSnippet; }
    public void setCodeSnippet(String codeSnippet) { this.codeSnippet = codeSnippet; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public boolean isPreviousYear() { return previousYear; }
    public void setPreviousYear(boolean previousYear) { this.previousYear = previousYear; }

    public String getExamSource() { return examSource; }
    public void setExamSource(String examSource) { this.examSource = examSource; }

    public Integer getExamYear() { return examYear; }
    public void setExamYear(Integer examYear) { this.examYear = examYear; }

    public List<OptionDto> getOptions() { return options; }
    public void setOptions(List<OptionDto> options) { this.options = options; }
}
