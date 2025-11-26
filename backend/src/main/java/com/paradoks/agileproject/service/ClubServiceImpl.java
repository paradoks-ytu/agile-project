package com.paradoks.agileproject.service;

import com.paradoks.agileproject.dto.request.ClubUpdateRequest;
import com.paradoks.agileproject.dto.request.LoginRequest;
import com.paradoks.agileproject.dto.request.RegisterRequest;
import com.paradoks.agileproject.dto.response.ApiResponse;
import com.paradoks.agileproject.exception.BadRequestException;
import com.paradoks.agileproject.exception.NotFoundException;
import com.paradoks.agileproject.exception.UnauthorizedException;
import com.paradoks.agileproject.model.ClubModel;
import com.paradoks.agileproject.model.SessionModel;
import com.paradoks.agileproject.repository.ClubRepository;
import com.paradoks.agileproject.utils.PasswordUtils;
import org.springframework.stereotype.Service;
import com.paradoks.agileproject.dto.request.PageableRequestParams;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.Optional;

@Service
public class ClubServiceImpl implements ClubService {
    private final ClubRepository clubRepository;
    private final PasswordUtils passwordUtils;
    private final SessionService sessionService;

    public ClubServiceImpl(ClubRepository clubRepository, PasswordUtils passwordUtils, SessionService sessionService) {
        this.clubRepository = clubRepository;
        this.passwordUtils = passwordUtils;
        this.sessionService = sessionService;
    }

    @Override
    public ClubModel getClub(Long clubId) {
        return clubRepository.findById(clubId)
                .orElseThrow(() -> new NotFoundException("Club not found"));
    }

    @Override
    public ClubModel updateClub(Long clubId, ClubUpdateRequest request) {
        ClubModel club = getClub(clubId);
        if (request.getName() != null) {
            club.setName(request.getName());
        }
        if (request.getDescription() != null) {
            club.setDescription(request.getDescription());
        }
        if (request.getTags() != null) {
            club.setTags(request.getTags());
        }
        return clubRepository.save(club);
    }

    @Override
    public Page<ClubModel> listClubs(PageableRequestParams params) {
        Pageable pageable = PageRequest.of(params.getPage(), params.getSize(), Sort.by(params.getSortBy()));
        return clubRepository.findAll(pageable);
    }

    @Override
    public ApiResponse register(RegisterRequest request) {
        if (clubRepository.existsByName(request.getClubName())) {
            throw new BadRequestException("Club with this name already exists");
        }

        if (clubRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("Club with this email already exists");
        }

        ClubModel club = new ClubModel();
        club.setName(request.getClubName());
        club.setEmail(request.getEmail());
        club.setPassword(passwordUtils.hashPassword(request.getPassword()));
        clubRepository.save(club);

        return new ApiResponse(true, "Kayıt başarılı!");
    }

    @Override
    public String login(LoginRequest request) {
        Optional<ClubModel> clubOpt = clubRepository.findByEmail(request.getEmail());

        if (clubOpt.isEmpty()) {
            throw new NotFoundException("Club not found");
        }

        ClubModel club = clubOpt.get();

        if (!passwordUtils.checkPassword(request.getPassword(), club.getPassword())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        SessionModel session = sessionService.createSession(club, 24); // 24 saat geçerli

        return session.getToken();
    }

}
