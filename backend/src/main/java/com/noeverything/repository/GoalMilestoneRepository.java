package com.noeverything.repository;

import com.noeverything.entity.Goal;
import com.noeverything.entity.GoalMilestone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GoalMilestoneRepository extends JpaRepository<GoalMilestone, Long> {
    List<GoalMilestone> findByGoalOrderByOrderIndexAsc(Goal goal);
}
