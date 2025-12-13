package com.paradoks.agileproject.service;

import com.paradoks.agileproject.dto.request.UserLoginRequest;
import com.paradoks.agileproject.dto.request.UserRegisterRequest;
import com.paradoks.agileproject.dto.response.ApiResponse;
import com.paradoks.agileproject.model.User;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    @Override
    public ApiResponse register(UserRegisterRequest registerRequest) {
        return null;
    }

    @Override
    public String login(UserLoginRequest loginRequest) {
        return "";
    }

    @Override
    public User getUser(Long userId) {
        return null;
    }

    @Override
    public ApiResponse deleteUser(Long userId) {
        return null;
    }
}
