package com.noeverything.repository;

import com.noeverything.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByTopicIgnoreCase(String topic);
    List<Question> findByTopicIgnoreCaseAndDifficultyIgnoreCase(String topic, String difficulty);
    List<Question> findByPreviousYearTrue();
    List<Question> findByTopicIgnoreCaseAndPreviousYearTrue(String topic);
    List<Question> findByExamSourceIgnoreCase(String examSource);

    @Query("SELECT q FROM Question q ORDER BY function('RAND') LIMIT :limit")
    List<Question> findRandomQuestions(@Param("limit") int limit);

    @Query("SELECT q FROM Question q WHERE LOWER(q.topic) = LOWER(:topic) ORDER BY function('RAND') LIMIT :limit")
    List<Question> findRandomQuestionsByTopic(@Param("topic") String topic, @Param("limit") int limit);

    @Query("SELECT COUNT(q) FROM Question q WHERE LOWER(q.topic) = LOWER(:topic)")
    long countByTopic(@Param("topic") String topic);
}
