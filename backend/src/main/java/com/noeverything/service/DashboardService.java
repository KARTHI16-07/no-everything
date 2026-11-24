package com.noeverything.service;

import com.noeverything.dto.DashboardSummaryResponse;
import com.noeverything.dto.HabitResponse;
import com.noeverything.dto.TaskResponse;
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
public class DashboardService {

    private final AuthService authService;
    private final QuoteService quoteService;
    private final HabitService habitService;
    private final TaskService taskService;
    private final TaskRepository taskRepository;
    private final HabitRepository habitRepository;
    private final HabitLogRepository habitLogRepository;
    private final FocusSessionRepository focusSessionRepository;
    private final UserProfileRepository userProfileRepository;
    private final TestAttemptRepository testAttemptRepository;

    public DashboardService(AuthService authService,
                            QuoteService quoteService,
                            HabitService habitService,
                            TaskService taskService,
                            TaskRepository taskRepository,
                            HabitRepository habitRepository,
                            HabitLogRepository habitLogRepository,
                            FocusSessionRepository focusSessionRepository,
                            UserProfileRepository userProfileRepository,
                            TestAttemptRepository testAttemptRepository) {
        this.authService = authService;
        this.quoteService = quoteService;
        this.habitService = habitService;
        this.taskService = taskService;
        this.taskRepository = taskRepository;
        this.habitRepository = habitRepository;
        this.habitLogRepository = habitLogRepository;
        this.focusSessionRepository = focusSessionRepository;
        this.userProfileRepository = userProfileRepository;
        this.testAttemptRepository = testAttemptRepository;
    }

    public DashboardSummaryResponse getDashboardSummary() {
        User user = authService.getCurrentAuthenticatedUser();
        UserProfile profile = userProfileRepository.findByUser(user).orElse(null);

        LocalDate today = LocalDate.now();
        LocalDateTime startOfToday = today.atStartOfDay();
        LocalDateTime endOfToday = today.atTime(LocalTime.MAX);

        // Quotes
        DashboardSummaryResponse.QuoteDto dailyQuote = quoteService.getDailyQuote();

        // Tasks
        List<Task> allUserTasks = taskRepository.findByUserOrderByDueDateAscCreatedAtDesc(user);
        int completedTasksToday = (int) allUserTasks.stream()
                .filter(t -> t.isCompleted() && t.getCompletedAt() != null && t.getCompletedAt().isAfter(startOfToday))
                .count();
        int totalTasksToday = (int) allUserTasks.stream()
                .filter(t -> t.getDueDate() != null && t.getDueDate().equals(today))
                .count();
        if (totalTasksToday == 0) totalTasksToday = completedTasksToday; // baseline

        List<TaskResponse> upcomingTasks = allUserTasks.stream()
                .filter(t -> !t.isCompleted())
                .limit(5)
                .map(taskService::mapToResponse)
                .collect(Collectors.toList());

        // Habits
        List<HabitResponse> activeHabits = habitService.getHabitsForCurrentUser();
        int totalHabitsToday = activeHabits.size();
        int habitsCompletedToday = (int) activeHabits.stream().filter(HabitResponse::isCompletedToday).count();

        int currentStreak = activeHabits.stream()
                .mapToInt(HabitResponse::getStreakCount)
                .max().orElse(0);
        int bestStreak = activeHabits.stream()
                .mapToInt(HabitResponse::getBestStreak)
                .max().orElse(0);

        // Focus
        int focusMinutesToday = focusSessionRepository.sumDurationMinutesSince(user, startOfToday);
        int focusGoal = profile != null && profile.getFocusGoalDailyMinutes() != null ? profile.getFocusGoalDailyMinutes() : 100;

        // Weekly Focus map
        Map<String, Integer> weeklyFocus = new LinkedHashMap<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate d = today.minusDays(i);
            List<FocusSession> daySessions = focusSessionRepository.findByUserAndCompletedAtBetweenOrderByCompletedAtDesc(
                    user, d.atStartOfDay(), d.atTime(LocalTime.MAX));
            int sum = daySessions.stream().mapToInt(FocusSession::getDurationMinutes).sum();
            weeklyFocus.put(d.getDayOfWeek().name().substring(0, 3), sum);
        }

        // Composite Readiness Index (0 - 100)
        double habitScore = totalHabitsToday > 0 ? ((double) habitsCompletedToday / totalHabitsToday) * 40.0 : 20.0;
        double focusScore = focusGoal > 0 ? Math.min(40.0, ((double) focusMinutesToday / focusGoal) * 40.0) : 20.0;
        double taskScore = totalTasksToday > 0 ? Math.min(20.0, ((double) completedTasksToday / totalTasksToday) * 20.0) : 15.0;
        int readinessIndex = (int) Math.round(habitScore + focusScore + taskScore);

        // Activity timeline
        List<DashboardSummaryResponse.ActivityItemDto> activities = new ArrayList<>();

        // Add focus sessions
        List<FocusSession> recentSessions = focusSessionRepository.findByUserOrderByCompletedAtDesc(user).stream().limit(3).toList();
        for (FocusSession fs : recentSessions) {
            activities.add(new DashboardSummaryResponse.ActivityItemDto(
                    "focus-" + fs.getId(),
                    "FOCUS",
                    "Deep Work Completed",
                    fs.getDurationMinutes() + " mins focus block (" + fs.getTag() + ")",
                    fs.getCompletedAt().format(DateTimeFormatter.ofPattern("MMM dd, HH:mm"))
            ));
        }

        // Add completed tasks
        List<Task> recentCompletedTasks = allUserTasks.stream().filter(Task::isCompleted).limit(3).toList();
        for (Task t : recentCompletedTasks) {
            String timeStr = t.getCompletedAt() != null
                    ? t.getCompletedAt().format(DateTimeFormatter.ofPattern("MMM dd, HH:mm"))
                    : "Today";
            activities.add(new DashboardSummaryResponse.ActivityItemDto(
                    "task-" + t.getId(),
                    "TASK",
                    "Task Finished: " + t.getTitle(),
                    t.getCategory() + " priority " + t.getPriority(),
                    timeStr
            ));
        }

        // Add mock tests
        List<TestAttempt> recentTests = testAttemptRepository.findByUserOrderByCompletedAtDesc(user).stream().limit(2).toList();
        for (TestAttempt ta : recentTests) {
            activities.add(new DashboardSummaryResponse.ActivityItemDto(
                    "nqt-" + ta.getId(),
                    "NQT",
                    ta.getTestTitle(),
                    "Score: " + ta.getScore() + "/" + ta.getTotalMarks() + " (" + Math.round(ta.getPercentage()) + "%)",
                    ta.getCompletedAt().format(DateTimeFormatter.ofPattern("MMM dd, HH:mm"))
            ));
        }

        DashboardSummaryResponse res = new DashboardSummaryResponse();
        res.setWelcomeMessage("Welcome back, " + (profile != null && profile.getFullName() != null ? profile.getFullName() : user.getUsername()));
        res.setCurrentDate(today.format(DateTimeFormatter.ofPattern("EEEE, MMMM dd, yyyy")));
        res.setDailyQuote(dailyQuote);
        res.setCompletedTasksToday(completedTasksToday);
        res.setTotalTasksToday(totalTasksToday);
        res.setHabitsCompletedToday(habitsCompletedToday);
        res.setTotalHabitsToday(totalHabitsToday);
        res.setFocusMinutesToday(focusMinutesToday);
        res.setFocusGoalMinutes(focusGoal);
        res.setCurrentStreakDays(currentStreak);
        res.setBestStreakDays(bestStreak);
        res.setReadinessIndex(Math.min(100, Math.max(0, readinessIndex)));
        res.setUpcomingTasks(upcomingTasks);
        res.setRecentActivities(activities);
        res.setActiveHabits(activeHabits);
        res.setWeeklyFocusMinutes(weeklyFocus);

        return res;
    }
}
