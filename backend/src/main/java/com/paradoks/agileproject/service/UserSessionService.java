package com.paradoks.agileproject.service;

import com.paradoks.agileproject.model.User;
import com.paradoks.agileproject.model.UserSession;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public interface UserSessionService {
    UserSession createSession(User user, int hoursValid);
    boolean isSessionValid(String token);
    void invalidateSession(String token);
    Optional<UserSession> getActiveSession(User user);

    Optional<UserSession> getActiveSessionByEmail(String email);
    Optional<UserSession> getCurrentSession();
}
