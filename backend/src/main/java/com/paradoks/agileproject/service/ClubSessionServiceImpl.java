package com.paradoks.agileproject.service;

import com.paradoks.agileproject.model.ClubModel;
import com.paradoks.agileproject.model.ClubSession;
import com.paradoks.agileproject.repository.ClubRepository;
import com.paradoks.agileproject.repository.SessionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;

@Service
public class ClubSessionServiceImpl implements ClubSessionService {
    private final SessionRepository sessionRepository;
    private final ClubRepository clubRepository;

    public ClubSessionServiceImpl(SessionRepository sessionRepository, ClubRepository clubRepository) {
        this.sessionRepository = sessionRepository;
        this.clubRepository = clubRepository;
    }

    @Override
    public Optional<ClubSession> getCurrentSession() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.empty();
        }
        String token = (String) authentication.getPrincipal();
        return sessionRepository.findByTokenAndActiveTrue(token);
    }

    @Override
    public ClubSession createSession(ClubModel club, int hoursValid) {
        ClubSession session = ClubSession.createSession(club, hoursValid);
        return sessionRepository.save(session);
    }

    @Override
    public boolean isSessionValid(String token) {
        Optional<ClubSession> sessionOpt = sessionRepository.findByTokenAndActiveTrue(token);
        if (sessionOpt.isEmpty()) return false;

        ClubSession session = sessionOpt.get();
        if (session.getExpiresAt().isBefore(LocalDateTime.now())) {
            session.setActive(false);
            sessionRepository.save(session);
            return false;
        }
        return true;
    }

    @Override
    public void invalidateSession(String token) {
        sessionRepository.findByTokenAndActiveTrue(token).ifPresent(session -> {
            session.setActive(false);
            sessionRepository.save(session);
        });
    }

    @Override
    public Optional<ClubSession> getActiveSession(ClubModel club) {
        return sessionRepository.findAll().stream()
                .filter(s -> s.getClub().equals(club) && s.isActive())
                .findFirst();
    }

    @Override
    public Optional<ClubSession> getActiveSessionByEmail(String email) {
        Optional<ClubModel> clubOpt = clubRepository.findByEmail(email);
        if (clubOpt.isEmpty()) return Optional.empty();

        ClubModel club = clubOpt.get();
        return sessionRepository.findAll().stream()
                .filter(s -> s.getClub().equals(club) && s.isActive())
                .findFirst();
    }}
