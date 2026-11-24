package com.noeverything.service;

import com.noeverything.dto.AchievementDto;
import com.noeverything.entity.Achievement;
import com.noeverything.entity.User;
import com.noeverything.entity.UserAchievement;
import com.noeverything.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AchievementService {

    private final AchievementRepository achievementRepository;
    private final UserAchievementRepository userAchievementRepository;
    private final FocusSessionRepository focusSessionRepository;
    private final HabitRepository habitRepository;
    private final TaskRepository taskRepository;
    private final JournalEntryRepository journalRepository;
    private final TestAttemptRepository testAttemptRepository;
    private final AuthService authService;

    public AchievementService(AchievementRepository achievementRepository,
                              UserAchievementRepository userAchievementRepository,
                              FocusSessionRepository focusSessionRepository,
                              HabitRepository habitRepository,
                              TaskRepository taskRepository,
                              JournalEntryRepository journalRepository,
                              TestAttemptRepository testAttemptRepository,
                              AuthService authService) {
        this.achievementRepository = achievementRepository;
        this.userAchievementRepository = userAchievementRepository;
        this.focusSessionRepository = focusSessionRepository;
        this.habitRepository = habitRepository;
        this.taskRepository = taskRepository;
        this.journalRepository = journalRepository;
        this.testAttemptRepository = testAttemptRepository;
        this.authService = authService;
    }

    @Transactional
    public List<AchievementDto> getAchievementsForCurrentUser() {
        User user = authService.getCurrentAuthenticatedUser();
        // Evaluate condition checks before returning
        evaluateAndUnlockAll(user);

        List<Achievement> achievements = achievementRepository.findAll();
        return achievements.stream().map(a -> {
            Optional<UserAchievement> uaOpt = userAchievementRepository.findByUserAndAchievement(user, a);
            AchievementDto dto = new AchievementDto();
            dto.setId(a.getId());
            dto.setCode(a.getCode());
            dto.setTitle(a.getTitle());
            dto.setDescription(a.getDescription());
            dto.setCategory(a.getCategory());
            dto.setBadgeIcon(a.getBadgeIcon());
            dto.setConditionType(a.getConditionType());
            dto.setThresholdValue(a.getThresholdValue());
            dto.setRarity(a.getRarity());

            if (uaOpt.isPresent()) {
                dto.setUnlocked(true);
                dto.setUnlockedAt(uaOpt.get().getUnlockedAt());
            } else {
                dto.setUnlocked(false);
            }
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public void evaluateAndUnlockAll(User user) {
        int totalFocusMinutes = focusSessionRepository.sumTotalDurationMinutes(user);
        long completedTasks = taskRepository.countCompletedSince(user, user.getCreatedAt());
        long journalCount = journalRepository.countByUser(user);
        long nqtTests = testAttemptRepository.countByUser(user);

        int maxStreak = habitRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .mapToInt(h -> Math.max(h.getStreakCount(), h.getBestStreak()))
                .max().orElse(0);

        List<Achievement> allAchievements = achievementRepository.findAll();
        for (Achievement a : allAchievements) {
            if (userAchievementRepository.existsByUserAndAchievement(user, a)) {
                continue;
            }

            boolean eligible = false;
            switch (a.getConditionType()) {
                case "FOCUS_MINUTES":
                    eligible = totalFocusMinutes >= a.getThresholdValue();
                    break;
                case "HABIT_STREAK":
                    eligible = maxStreak >= a.getThresholdValue();
                    break;
                case "TASKS_COMPLETED":
                    eligible = completedTasks >= a.getThresholdValue();
                    break;
                case "JOURNAL_ENTRIES":
                    eligible = journalCount >= a.getThresholdValue();
                    break;
                case "NQT_TESTS":
                    eligible = nqtTests >= a.getThresholdValue();
                    break;
                default:
                    break;
            }

            if (eligible) {
                UserAchievement ua = new UserAchievement(user, a);
                userAchievementRepository.save(ua);
            }
        }
    }
}
