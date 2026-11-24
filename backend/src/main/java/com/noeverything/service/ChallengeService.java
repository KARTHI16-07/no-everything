package com.noeverything.service;

import com.noeverything.dto.ChallengeDto;
import com.noeverything.entity.Challenge;
import com.noeverything.entity.User;
import com.noeverything.entity.UserChallenge;
import com.noeverything.exception.ResourceNotFoundException;
import com.noeverything.repository.ChallengeRepository;
import com.noeverything.repository.UserChallengeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ChallengeService {

    private final ChallengeRepository challengeRepository;
    private final UserChallengeRepository userChallengeRepository;
    private final AuthService authService;

    public ChallengeService(ChallengeRepository challengeRepository,
                            UserChallengeRepository userChallengeRepository,
                            AuthService authService) {
        this.challengeRepository = challengeRepository;
        this.userChallengeRepository = userChallengeRepository;
        this.authService = authService;
    }

    public List<ChallengeDto> getChallengesForCurrentUser(String type) {
        User user = authService.getCurrentAuthenticatedUser();
        List<Challenge> challenges = (type != null && !type.isBlank() && !"ALL".equalsIgnoreCase(type))
                ? challengeRepository.findByType(type.toUpperCase())
                : challengeRepository.findAll();

        return challenges.stream().map(c -> {
            Optional<UserChallenge> ucOpt = userChallengeRepository.findByUserAndChallenge(user, c);
            ChallengeDto dto = new ChallengeDto();
            dto.setId(c.getId());
            dto.setCode(c.getCode());
            dto.setTitle(c.getTitle());
            dto.setDescription(c.getDescription());
            dto.setCategory(c.getCategory());
            dto.setTargetValue(c.getTargetValue());
            dto.setUnitLabel(c.getUnitLabel());
            dto.setDurationDays(c.getDurationDays());
            dto.setType(c.getType());
            dto.setXpReward(c.getXpReward());
            dto.setIcon(c.getIcon());

            if (ucOpt.isPresent()) {
                UserChallenge uc = ucOpt.get();
                dto.setUserCurrentValue(uc.getCurrentValue());
                dto.setUserCompleted(uc.isCompleted());
                dto.setUserCompletedAt(uc.getCompletedAt());
                dto.setJoined(true);
            } else {
                dto.setUserCurrentValue(0);
                dto.setUserCompleted(false);
                dto.setJoined(false);
            }
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public ChallengeDto joinChallenge(Long challengeId) {
        User user = authService.getCurrentAuthenticatedUser();
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge not found with id: " + challengeId));

        UserChallenge uc = userChallengeRepository.findByUserAndChallenge(user, challenge)
                .orElseGet(() -> {
                    UserChallenge newUc = new UserChallenge(user, challenge);
                    return userChallengeRepository.save(newUc);
                });

        ChallengeDto dto = new ChallengeDto();
        dto.setId(challenge.getId());
        dto.setCode(challenge.getCode());
        dto.setTitle(challenge.getTitle());
        dto.setDescription(challenge.getDescription());
        dto.setCategory(challenge.getCategory());
        dto.setTargetValue(challenge.getTargetValue());
        dto.setUnitLabel(challenge.getUnitLabel());
        dto.setDurationDays(challenge.getDurationDays());
        dto.setType(challenge.getType());
        dto.setXpReward(challenge.getXpReward());
        dto.setIcon(challenge.getIcon());
        dto.setUserCurrentValue(uc.getCurrentValue());
        dto.setUserCompleted(uc.isCompleted());
        dto.setUserCompletedAt(uc.getCompletedAt());
        dto.setJoined(true);
        return dto;
    }

    @Transactional
    public void incrementProgress(User user, String challengeCode, int amount) {
        challengeRepository.findByCode(challengeCode).ifPresent(c -> {
            UserChallenge uc = userChallengeRepository.findByUserAndChallenge(user, c)
                    .orElseGet(() -> userChallengeRepository.save(new UserChallenge(user, c)));
            uc.incrementProgress(amount);
            userChallengeRepository.save(uc);
        });
    }
}
