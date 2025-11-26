package com.paradoks.agileproject.service;

import com.paradoks.agileproject.dto.request.LoginRequest;
import com.paradoks.agileproject.dto.request.RegisterRequest;
import com.paradoks.agileproject.dto.response.ApiResponse;
import org.springframework.stereotype.Service;

import com.paradoks.agileproject.dto.response.ClubResponse;
import com.paradoks.agileproject.model.ClubModel;

@Service
public interface ClubService {
    ApiResponse register(RegisterRequest registerRequest);
    String  login(LoginRequest loginRequest);

    ClubModel getClub(Long clubId);
}
