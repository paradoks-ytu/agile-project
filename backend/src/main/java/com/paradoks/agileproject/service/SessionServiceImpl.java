package com.paradoks.agileproject.service;

import com.paradoks.agileproject.model.ClubModel;
import com.paradoks.agileproject.model.SessionModel;
import com.paradoks.agileproject.repository.ClubRepository;
import com.paradoks.agileproject.repository.SessionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;

@Service
public class SessionServiceImpl implements SessionService {
    private final SessionRepository sessionRepository;
    private final ClubRepository clubRepository;

    public SessionServiceImpl(SessionRepository sessionRepository, ClubRepository clubRepository) {
        this.sessionRepository = sessionRepository;
        this.clubRepository = clubRepository;
    }

    @Override
    public Optional<SessionModel> getCurrentSession() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.empty();
        }
        String token = (String) authentication.getPrincipal();
        return sessionRepository.findByTokenAndActiveTrue(token);
    }

    @Override
    public SessionModel createSession(ClubModel club, int hoursValid) {
        SessionModel session = SessionModel.createSession(club, hoursValid);
        return sessionRepository.save(session);
    }

    @Override
    public boolean isSessionValid(String token) {
        Optional<SessionModel> sessionOpt = sessionRepository.findByTokenAndActiveTrue(token);
        if (sessionOpt.isEmpty()) return false;

        SessionModel session = sessionOpt.get();
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
    public Optional<SessionModel> getActiveSession(ClubModel club) {
        return sessionRepository.findAll().stream()
                .filter(s -> s.getClub().equals(club) && s.isActive())
                .findFirst();
    }

    @Override
    public Optional<SessionModel> getActiveSessionByEmail(String email) {
        Optional<ClubModel> clubOpt = clubRepository.findByEmail(email);
        if (clubOpt.isEmpty()) return Optional.empty();

        ClubModel club = clubOpt.get();
        return sessionRepository.findAll().stream()
                .filter(s -> s.getClub().equals(club) && s.isActive())
                .findFirst();
    }}
