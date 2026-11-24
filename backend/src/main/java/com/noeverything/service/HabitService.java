package com.noeverything.service;

import com.noeverything.dto.HabitRequest;
import com.noeverything.dto.HabitResponse;
import com.noeverything.entity.Habit;
import com.noeverything.entity.HabitLog;
import com.noeverything.entity.User;
import com.noeverything.exception.ResourceNotFoundException;
import com.noeverything.repository.HabitLogRepository;
import com.noeverything.repository.HabitRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class HabitService {

    private final HabitRepository habitRepository;
    private final HabitLogRepository habitLogRepository;
    private final AuthService authService;

    public HabitService(HabitRepository habitRepository,
                        HabitLogRepository habitLogRepository,
                        AuthService authService) {
        this.habitRepository = habitRepository;
        this.habitLogRepository = habitLogRepository;
        this.authService = authService;
    }

    public List<HabitResponse> getHabitsForCurrentUser() {
        User user = authService.getCurrentAuthenticatedUser();
        List<Habit> habits = habitRepository.findByUserAndActiveOrderByCreatedAtDesc(user, true);
        LocalDate today = LocalDate.now();
        LocalDate sevenDaysAgo = today.minusDays(6);

        return habits.stream().map(h -> mapToResponse(h, today, sevenDaysAgo)).collect(Collectors.toList());
    }

    @Transactional
    public HabitResponse createHabit(HabitRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        Habit habit = new Habit(
                user,
                request.getTitle().trim(),
                request.getDescription(),
                request.getCategory() != null ? request.getCategory() : "DISCIPLINE",
                request.getTargetDaysPerWeek() != null ? request.getTargetDaysPerWeek() : 7
        );
        Habit saved = habitRepository.save(habit);
        LocalDate today = LocalDate.now();
        return mapToResponse(saved, today, today.minusDays(6));
    }

    @Transactional
    public HabitResponse toggleHabit(Long habitId, LocalDate date) {
        User user = authService.getCurrentAuthenticatedUser();
        Habit habit = habitRepository.findByIdAndUser(habitId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Habit not found with id: " + habitId));

        LocalDate targetDate = date != null ? date : LocalDate.now();
        Optional<HabitLog> existing = habitLogRepository.findByHabitAndLogDate(habit, targetDate);

        if (existing.isPresent()) {
            HabitLog log = existing.get();
            log.setCompleted(!log.isCompleted());
            log.setCompletedAt(LocalDateTime.now());
            habitLogRepository.save(log);
        } else {
            HabitLog log = new HabitLog(habit, targetDate, true);
            habitLogRepository.save(log);
        }

        // Recalculate genuine streak based on completed logs
        calculateAndSaveStreak(habit);

        LocalDate today = LocalDate.now();
        return mapToResponse(habit, today, today.minusDays(6));
    }

    @Transactional
    public void deleteHabit(Long habitId) {
        User user = authService.getCurrentAuthenticatedUser();
        Habit habit = habitRepository.findByIdAndUser(habitId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Habit not found with id: " + habitId));
        habit.setActive(false);
        habitRepository.save(habit);
    }

    private void calculateAndSaveStreak(Habit habit) {
        List<HabitLog> allLogs = habitLogRepository.findByHabitOrderByLogDateDesc(habit);
        Set<LocalDate> completedDates = allLogs.stream()
                .filter(HabitLog::isCompleted)
                .map(HabitLog::getLogDate)
                .collect(Collectors.toSet());

        LocalDate checkDate = LocalDate.now();
        int currentStreak = 0;

        // If today is completed, start streak check from today; if not, check from yesterday
        if (completedDates.contains(checkDate)) {
            while (completedDates.contains(checkDate)) {
                currentStreak++;
                checkDate = checkDate.minusDays(1);
            }
        } else {
            LocalDate yesterday = checkDate.minusDays(1);
            while (completedDates.contains(yesterday)) {
                currentStreak++;
                yesterday = yesterday.minusDays(1);
            }
        }

        habit.setStreakCount(currentStreak);
        if (currentStreak > habit.getBestStreak()) {
            habit.setBestStreak(currentStreak);
        }
        habitRepository.save(habit);
    }

    private HabitResponse mapToResponse(Habit habit, LocalDate today, LocalDate startDate) {
        HabitResponse res = new HabitResponse();
        res.setId(habit.getId());
        res.setTitle(habit.getTitle());
        res.setDescription(habit.getDescription());
        res.setCategory(habit.getCategory());
        res.setTargetDaysPerWeek(habit.getTargetDaysPerWeek());
        res.setStreakCount(habit.getStreakCount());
        res.setBestStreak(habit.getBestStreak());
        res.setActive(habit.isActive());

        List<HabitLog> logs = habitLogRepository.findByHabitAndLogDateBetweenOrderByLogDateAsc(habit, startDate, today);
        Map<String, Boolean> recentLogs = new LinkedHashMap<>();
        LocalDate curr = startDate;
        while (!curr.isAfter(today)) {
            final LocalDate dateKey = curr;
            boolean completed = logs.stream()
                    .anyMatch(l -> l.getLogDate().equals(dateKey) && l.isCompleted());
            recentLogs.put(dateKey.toString(), completed);
            curr = curr.plusDays(1);
        }
        res.setRecentLogs(recentLogs);
        res.setCompletedToday(Boolean.TRUE.equals(recentLogs.get(today.toString())));

        return res;
    }
}
