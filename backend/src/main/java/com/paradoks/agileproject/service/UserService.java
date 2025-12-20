package com.paradoks.agileproject.service;

import com.paradoks.agileproject.dto.request.UserLoginRequest;
import com.paradoks.agileproject.dto.request.UserRegisterRequest;
import com.paradoks.agileproject.dto.response.ApiResponse;
import com.paradoks.agileproject.model.User;
import org.springframework.stereotype.Service;

@Service
public interface UserService {
    ApiResponse register(UserRegisterRequest registerRequest);
    String login(UserLoginRequest loginRequest);
    User getUser(Long userId);
    ApiResponse deleteUser(Long userId);
    ApiResponse verifyUser(String email, String code);
}
