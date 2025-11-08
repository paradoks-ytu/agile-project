package com.paradoks.agileproject.service;

import com.paradoks.agileproject.model.ClubModel;
import com.paradoks.agileproject.model.SessionModel;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public interface SessionService {
    SessionModel createSession(ClubModel club, int hoursValid);
    boolean isSessionValid(String token);
    void invalidateSession(String token);
    Optional<SessionModel> getActiveSession(ClubModel club);

    Optional<SessionModel> getActiveSessionByEmail(String email);
}
