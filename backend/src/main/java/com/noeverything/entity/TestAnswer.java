package com.noeverything.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "test_answers")
public class TestAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_attempt_id", nullable = false)
    @JsonIgnore
    private TestAttempt testAttempt;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(name = "selected_option_key", length = 5)
    private String selectedOptionKey;

    @Column(name = "is_correct", nullable = false)
    private boolean correct = false;

    public TestAnswer() {}

    public TestAnswer(TestAttempt testAttempt, Question question, String selectedOptionKey, boolean correct) {
        this.testAttempt = testAttempt;
        this.question = question;
        this.selectedOptionKey = selectedOptionKey;
        this.correct = correct;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public TestAttempt getTestAttempt() { return testAttempt; }
    public void setTestAttempt(TestAttempt testAttempt) { this.testAttempt = testAttempt; }

    public Question getQuestion() { return question; }
    public void setQuestion(Question question) { this.question = question; }

    public String getSelectedOptionKey() { return selectedOptionKey; }
    public void setSelectedOptionKey(String selectedOptionKey) { this.selectedOptionKey = selectedOptionKey; }

    public boolean isCorrect() { return correct; }
    public void setCorrect(boolean correct) { this.correct = correct; }
}
