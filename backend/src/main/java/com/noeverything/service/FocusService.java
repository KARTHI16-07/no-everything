package com.noeverything.service;

import com.noeverything.dto.FocusSessionRequest;
import com.noeverything.dto.FocusSessionResponse;
import com.noeverything.dto.FocusStatsResponse;
import com.noeverything.entity.FocusSession;
import com.noeverything.entity.User;
import com.noeverything.entity.UserProfile;
import com.noeverything.repository.FocusSessionRepository;
import com.noeverything.repository.UserProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class FocusService {

    private final FocusSessionRepository focusSessionRepository;
    private final UserProfileRepository userProfileRepository;
    private final AuthService authService;

    public FocusService(FocusSessionRepository focusSessionRepository,
                        UserProfileRepository userProfileRepository,
                        AuthService authService) {
        this.focusSessionRepository = focusSessionRepository;
        this.userProfileRepository = userProfileRepository;
        this.authService = authService;
    }

    @Transactional
    public FocusSessionResponse recordSession(FocusSessionRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        FocusSession session = new FocusSession(
                user,
                request.getDurationMinutes(),
                request.getSessionType(),
                request.getTag(),
                request.getNotes()
        );
        FocusSession saved = focusSessionRepository.save(session);
        return mapToResponse(saved);
    }

    public FocusStatsResponse getFocusStats() {
        User user = authService.getCurrentAuthenticatedUser();
        UserProfile profile = userProfileRepository.findByUser(user).orElse(null);
        int dailyGoal = profile != null && profile.getFocusGoalDailyMinutes() != null
                ? profile.getFocusGoalDailyMinutes() : 100;

        LocalDate today = LocalDate.now();
        LocalDateTime startOfToday = today.atStartOfDay();
        LocalDateTime startOfWeek = today.minusDays(6).atStartOfDay();

        int todayMinutes = focusSessionRepository.sumDurationMinutesSince(user, startOfToday);
        int weekMinutes = focusSessionRepository.sumDurationMinutesSince(user, startOfWeek);
        int totalMinutes = focusSessionRepository.sumTotalDurationMinutes(user);
        long totalSessions = focusSessionRepository.countTotalSessions(user);

        double progress = dailyGoal > 0 ? Math.min(100.0, ((double) todayMinutes / dailyGoal) * 100.0) : 0.0;

        List<FocusSession> recent = focusSessionRepository.findByUserOrderByCompletedAtDesc(user).stream()
                .limit(10)
                .collect(Collectors.toList());

        List<FocusSessionResponse> recentResponses = recent.stream().map(this::mapToResponse).collect(Collectors.toList());

        // Weekly breakdown: last 7 days
        Map<String, Integer> weeklyBreakdown = new LinkedHashMap<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate d = today.minusDays(i);
            LocalDateTime dayStart = d.atStartOfDay();
            LocalDateTime dayEnd = d.atTime(LocalTime.MAX);
            List<FocusSession> daySessions = focusSessionRepository.findByUserAndCompletedAtBetweenOrderByCompletedAtDesc(user, dayStart, dayEnd);
            int sum = daySessions.stream().mapToInt(FocusSession::getDurationMinutes).sum();
            weeklyBreakdown.put(d.toString(), sum);
        }

        FocusStatsResponse res = new FocusStatsResponse();
        res.setTodayMinutes(todayMinutes);
        res.setWeekMinutes(weekMinutes);
        res.setTotalMinutes(totalMinutes);
        res.setTotalSessions(totalSessions);
        res.setDailyGoalMinutes(dailyGoal);
        res.setDailyGoalProgress(progress);
        res.setRecentSessions(recentResponses);
        res.setWeeklyBreakdown(weeklyBreakdown);

        return res;
    }

    public FocusSessionResponse mapToResponse(FocusSession s) {
        FocusSessionResponse res = new FocusSessionResponse();
        res.setId(s.getId());
        res.setDurationMinutes(s.getDurationMinutes());
        res.setSessionType(s.getSessionType());
        res.setTag(s.getTag());
        res.setNotes(s.getNotes());
        res.setCompletedAt(s.getCompletedAt());
        return res;
    }
}
