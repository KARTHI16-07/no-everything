package com.noeverything.dto;

import java.util.Map;

public class TestSubmitRequest {
    private String testTitle;
    private String topic;
    private Integer timeTakenSeconds;
    private Map<Long, String> answers; // questionId -> selectedOptionKey

    public TestSubmitRequest() {}

    public String getTestTitle() { return testTitle; }
    public void setTestTitle(String testTitle) { this.testTitle = testTitle; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public Integer getTimeTakenSeconds() { return timeTakenSeconds; }
    public void setTimeTakenSeconds(Integer timeTakenSeconds) { this.timeTakenSeconds = timeTakenSeconds; }

    public Map<Long, String> getAnswers() { return answers; }
    public void setAnswers(Map<Long, String> answers) { this.answers = answers; }
}
