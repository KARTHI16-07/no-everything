package com.noeverything.service;

import com.noeverything.dto.ChangePasswordRequest;
import com.noeverything.dto.ProfileDto;
import com.noeverything.dto.ProfileUpdateRequest;
import com.noeverything.entity.User;
import com.noeverything.entity.UserProfile;
import com.noeverything.exception.BadRequestException;
import com.noeverything.repository.UserProfileRepository;
import com.noeverything.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthService authService;

    public UserService(UserRepository userRepository,
                       UserProfileRepository userProfileRepository,
                       PasswordEncoder passwordEncoder,
                       AuthService authService) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.authService = authService;
    }

    public ProfileDto getCurrentProfile() {
        User user = authService.getCurrentAuthenticatedUser();
        UserProfile profile = userProfileRepository.findByUser(user)
                .orElseGet(() -> {
                    UserProfile newProfile = new UserProfile(user);
                    return userProfileRepository.save(newProfile);
                });

        return mapToDto(user, profile);
    }

    @Transactional
    public ProfileDto updateProfile(ProfileUpdateRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        UserProfile profile = userProfileRepository.findByUser(user)
                .orElseGet(() -> new UserProfile(user));

        if (request.getFullName() != null) profile.setFullName(request.getFullName().trim());
        if (request.getBio() != null) profile.setBio(request.getBio());
        if (request.getAvatarUrl() != null) profile.setAvatarUrl(request.getAvatarUrl());
        if (request.getFocusGoalDailyMinutes() != null) profile.setFocusGoalDailyMinutes(request.getFocusGoalDailyMinutes());
        if (request.getHabitGoalDailyCount() != null) profile.setHabitGoalDailyCount(request.getHabitGoalDailyCount());
        if (request.getTaskGoalDailyCount() != null) profile.setTaskGoalDailyCount(request.getTaskGoalDailyCount());
        if (request.getThemePreference() != null) profile.setThemePreference(request.getThemePreference());
        if (request.getSoundEnabled() != null) profile.setSoundEnabled(request.getSoundEnabled());
        if (request.getNotificationsEnabled() != null) profile.setNotificationsEnabled(request.getNotificationsEnabled());

        UserProfile saved = userProfileRepository.save(profile);
        return mapToDto(user, saved);
    }

    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password does not match");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private ProfileDto mapToDto(User user, UserProfile profile) {
        ProfileDto dto = new ProfileDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFullName(profile.getFullName());
        dto.setBio(profile.getBio());
        dto.setAvatarUrl(profile.getAvatarUrl());
        dto.setFocusGoalDailyMinutes(profile.getFocusGoalDailyMinutes());
        dto.setHabitGoalDailyCount(profile.getHabitGoalDailyCount());
        dto.setTaskGoalDailyCount(profile.getTaskGoalDailyCount());
        dto.setThemePreference(profile.getThemePreference());
        dto.setSoundEnabled(profile.isSoundEnabled());
        dto.setNotificationsEnabled(profile.isNotificationsEnabled());
        return dto;
    }
}
