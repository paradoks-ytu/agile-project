package com.paradoks.agileproject.service;

import com.paradoks.agileproject.model.ClubModel;
import com.paradoks.agileproject.model.ClubSession;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public interface ClubSessionService {
    ClubSession createSession(ClubModel club, int hoursValid);
    boolean isSessionValid(String token);
    void invalidateSession(String token);
    Optional<ClubSession> getActiveSession(ClubModel club);

    Optional<ClubSession> getActiveSessionByEmail(String email);
    Optional<ClubSession> getCurrentSession();
}
