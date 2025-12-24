package com.paradoks.agileproject.service;

import com.paradoks.agileproject.model.User;
import com.paradoks.agileproject.model.UserSession;
import com.paradoks.agileproject.repository.UserRepository;
import com.paradoks.agileproject.repository.UserSessionRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserSessionServiceImpl implements UserSessionService {

    private final UserSessionRepository userSessionRepository;
    private final UserRepository userRepository;

    public UserSessionServiceImpl(UserSessionRepository userSessionRepository, UserRepository userRepository) {
        this.userSessionRepository = userSessionRepository;
        this.userRepository = userRepository;
    }

    @Override
    public UserSession createSession(User user, int hoursValid) {
        UserSession session = UserSession.createSession(user, hoursValid);
        return userSessionRepository.save(session);
    }

    @Override
    public boolean isSessionValid(String token) {
        Optional<UserSession> sessionOpt = userSessionRepository.findByTokenAndActiveTrue(token);
        if (sessionOpt.isEmpty()) return false;

        UserSession session = sessionOpt.get();
        if (session.getExpiresAt().isBefore(LocalDateTime.now())) {
            session.setActive(false);
            userSessionRepository.save(session);
            return false;
        }
        return true;
    }

    @Override
    public void invalidateSession(String token) {
        userSessionRepository.findByTokenAndActiveTrue(token).ifPresent(session -> {
            session.setActive(false);
            userSessionRepository.save(session);
        });
    }

    @Override
    public Optional<UserSession> getActiveSession(User user) {
        return userSessionRepository.findAll().stream()
                .filter(s -> s.getUser().equals(user) && s.isActive())
                .findFirst();
    }

    @Override
    public Optional<UserSession> getActiveSessionByEmail(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return Optional.empty();

        User user = userOpt.get();
        return userSessionRepository.findAll().stream()
                .filter(s -> s.getUser().equals(user) && s.isActive())
                .findFirst();
    }

    @Override
    public Optional<UserSession> getCurrentSession() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.empty();
        }
        // Assuming the principal is the token string as handled in AuthMiddleware
        Object principal = authentication.getPrincipal();
        if (!(principal instanceof String token)) {
            return Optional.empty();
        }
        return userSessionRepository.findByTokenAndActiveTrue(token);
    }
}
