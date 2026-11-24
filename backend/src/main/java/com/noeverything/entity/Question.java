package com.noeverything.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "questions")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 30)
    private String topic; // JAVA, PYTHON, SQL, APTITUDE, LOGICAL, TECHNICAL

    @Column(length = 60)
    private String subTopic;

    @Column(nullable = false, length = 20)
    private String difficulty = "INTERMEDIATE"; // FOUNDATION, INTERMEDIATE, ADVANCED

    @Column(nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(columnDefinition = "TEXT")
    private String codeSnippet;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(name = "is_previous_year")
    private boolean previousYear = false;

    @Column(name = "exam_source", length = 60)
    private String examSource; // TCS NQT, Infosys DSE, Wipro Elite, etc.

    @Column(name = "exam_year")
    private Integer examYear;

    @Column(nullable = false)
    private boolean verified = true;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<QuestionOption> options = new ArrayList<>();

    public Question() {}

    public Question(String topic, String subTopic, String difficulty, String questionText, String codeSnippet, String explanation, boolean previousYear, String examSource, Integer examYear) {
        this.topic = topic;
        this.subTopic = subTopic;
        this.difficulty = difficulty != null ? difficulty : "INTERMEDIATE";
        this.questionText = questionText;
        this.codeSnippet = codeSnippet;
        this.explanation = explanation;
        this.previousYear = previousYear;
        this.examSource = examSource;
        this.examYear = examYear;
        this.verified = true;
    }

    public void addOption(String key, String text, boolean isCorrect) {
        QuestionOption opt = new QuestionOption(this, key, text, isCorrect);
        this.options.add(opt);
    }

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

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }

    public List<QuestionOption> getOptions() { return options; }
    public void setOptions(List<QuestionOption> options) { this.options = options; }
}
