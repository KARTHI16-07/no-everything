package com.noeverything.service;

import com.noeverything.dto.AnalyticsResponse;
import com.noeverything.entity.*;
import com.noeverything.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final AuthService authService;
    private final FocusSessionRepository focusSessionRepository;
    private final TaskRepository taskRepository;
    private final HabitRepository habitRepository;
    private final HabitLogRepository habitLogRepository;
    private final JournalEntryRepository journalRepository;
    private final TestAttemptRepository testAttemptRepository;

    public AnalyticsService(AuthService authService,
                            FocusSessionRepository focusSessionRepository,
                            TaskRepository taskRepository,
                            HabitRepository habitRepository,
                            HabitLogRepository habitLogRepository,
                            JournalEntryRepository journalRepository,
                            TestAttemptRepository testAttemptRepository) {
        this.authService = authService;
        this.focusSessionRepository = focusSessionRepository;
        this.taskRepository = taskRepository;
        this.habitRepository = habitRepository;
        this.habitLogRepository = habitLogRepository;
        this.journalRepository = journalRepository;
        this.testAttemptRepository = testAttemptRepository;
    }

    public AnalyticsResponse getPersonalAnalytics() {
        User user = authService.getCurrentAuthenticatedUser();
        LocalDate today = LocalDate.now();

        // 1. Overall aggregates
        int totalFocusMinutes = focusSessionRepository.sumTotalDurationMinutes(user);
        double totalFocusHours = Math.round(((double) totalFocusMinutes / 60.0) * 10.0) / 10.0;

        List<Task> allTasks = taskRepository.findByUserOrderByDueDateAscCreatedAtDesc(user);
        long totalCompletedTasks = allTasks.stream().filter(Task::isCompleted).count();
        long totalJournalEntries = journalRepository.countByUser(user);

        List<TestAttempt> attempts = testAttemptRepository.findByUserOrderByCompletedAtDesc(user);
        int totalNqtTests = attempts.size();
        Double avgNqtScore = testAttemptRepository.getAverageScoreByUser(user);
        double nqtAvg = avgNqtScore != null ? Math.round(avgNqtScore * 10.0) / 10.0 : 0.0;

        // 2. Weekly Productivity Points (Last 7 Days)
        List<AnalyticsResponse.ProductivityPoint> weeklyPoints = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate d = today.minusDays(i);
            LocalDateTime start = d.atStartOfDay();
            LocalDateTime end = d.atTime(LocalTime.MAX);

            List<FocusSession> dayFocus = focusSessionRepository.findByUserAndCompletedAtBetweenOrderByCompletedAtDesc(user, start, end);
            int focusMins = dayFocus.stream().mapToInt(FocusSession::getDurationMinutes).sum();

            int tasksDone = (int) allTasks.stream()
                    .filter(t -> t.isCompleted() && t.getCompletedAt() != null &&
                            !t.getCompletedAt().isBefore(start) && !t.getCompletedAt().isAfter(end))
                    .count();

            List<HabitLog> dayHabitLogs = habitLogRepository.findCompletedLogsForUserOnDate(user.getId(), d);
            int habitsDone = dayHabitLogs.size();

            int score = Math.min(100, (focusMins / 2) + (tasksDone * 15) + (habitsDone * 10));

            weeklyPoints.add(new AnalyticsResponse.ProductivityPoint(
                    d.format(DateTimeFormatter.ofPattern("EEE")),
                    focusMins,
                    tasksDone,
                    habitsDone,
                    score
            ));
        }

        // 3. Habit Consistency
        List<Habit> habits = habitRepository.findByUserAndActiveOrderByCreatedAtDesc(user, true);
        List<AnalyticsResponse.HabitConsistencyItem> habitItems = new ArrayList<>();
        LocalDate thirtyDaysAgo = today.minusDays(29);

        for (Habit h : habits) {
            List<HabitLog> logs = habitLogRepository.findByHabitAndLogDateBetweenOrderByLogDateAsc(h, thirtyDaysAgo, today);
            long completedCount = logs.stream().filter(HabitLog::isCompleted).count();
            int rate = (int) Math.round(((double) completedCount / 30.0) * 100);
            habitItems.add(new AnalyticsResponse.HabitConsistencyItem(
                    h.getTitle(),
                    h.getCategory(),
                    h.getStreakCount(),
                    rate
            ));
        }

        // 4. Focus Distribution by Tag
        List<FocusSession> allSessions = focusSessionRepository.findByUserOrderByCompletedAtDesc(user);
        Map<String, Integer> tagMap = new HashMap<>();
        for (FocusSession s : allSessions) {
            String tag = s.getTag() != null ? s.getTag() : "GENERAL";
            tagMap.put(tag, tagMap.getOrDefault(tag, 0) + s.getDurationMinutes());
        }
        List<AnalyticsResponse.FocusTrendItem> focusDistribution = tagMap.entrySet().stream()
                .map(e -> new AnalyticsResponse.FocusTrendItem(e.getKey(), e.getValue()))
                .collect(Collectors.toList());

        // 5. Tasks by Priority & Category
        Map<String, Integer> priorityMap = new HashMap<>();
        Map<String, Integer> categoryMap = new HashMap<>();
        for (Task t : allTasks) {
            priorityMap.put(t.getPriority(), priorityMap.getOrDefault(t.getPriority(), 0) + 1);
            categoryMap.put(t.getCategory(), categoryMap.getOrDefault(t.getCategory(), 0) + 1);
        }

        // 6. Topic accuracy
        Map<String, Double> topicAccuracy = new HashMap<>();
        Map<String, List<Double>> topicScores = new HashMap<>();
        for (TestAttempt ta : attempts) {
            String top = ta.getTopic() != null ? ta.getTopic() : "GENERAL";
            topicScores.putIfAbsent(top, new ArrayList<>());
            topicScores.get(top).add(ta.getPercentage());
        }
        topicScores.forEach((top, scores) -> {
            double avg = scores.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
            topicAccuracy.put(top, Math.round(avg * 10.0) / 10.0);
        });

        // 7. Overall Growth Index
        double taskRatio = allTasks.isEmpty() ? 0.5 : (double) totalCompletedTasks / allTasks.size();
        double growth = (taskRatio * 30.0) + Math.min(35.0, (totalFocusHours / 20.0) * 35.0) + (nqtAvg * 0.35);

        AnalyticsResponse response = new AnalyticsResponse();
        response.setOverallGrowthIndex(Math.min(100.0, Math.round(growth * 10.0) / 10.0));
        response.setTotalFocusHours(totalFocusHours);
        response.setTotalCompletedTasks(totalCompletedTasks);
        response.setTotalJournalEntries(totalJournalEntries);
        response.setTotalNqtTestsTaken(totalNqtTests);
        response.setNqtAverageScore(nqtAvg);
        response.setWeeklyProductivity(weeklyPoints);
        response.setHabitConsistency(habitItems);
        response.setFocusDistributionByTag(focusDistribution);
        response.setTasksByPriority(priorityMap);
        response.setTasksByCategory(categoryMap);
        response.setTopicAccuracy(topicAccuracy);

        return response;
    }
}
