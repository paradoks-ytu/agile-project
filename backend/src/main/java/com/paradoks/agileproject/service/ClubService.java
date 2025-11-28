package com.paradoks.agileproject.service;

import com.paradoks.agileproject.dto.request.LoginRequest;
import com.paradoks.agileproject.dto.request.RegisterRequest;
import com.paradoks.agileproject.dto.response.ApiResponse;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.paradoks.agileproject.dto.request.ClubUpdateRequest;
import com.paradoks.agileproject.model.ClubModel;
import com.paradoks.agileproject.dto.request.PageableRequestParams;

@Service
public interface ClubService {
    ApiResponse register(RegisterRequest registerRequest);
    String  login(LoginRequest loginRequest);
    ClubModel getClub(Long clubId);
    ClubModel updateClub(Long clubId, ClubUpdateRequest request);
    Page<ClubModel> listClubs(PageableRequestParams params);
    ClubModel updateProfilePicture(Long clubId, MultipartFile profilePicture);
    ClubModel updateBanner(Long clubId, MultipartFile banner);
}
