package com.paradoks.agileproject.controller;

import com.paradoks.agileproject.dto.mapper.ClubMapper;
import com.paradoks.agileproject.dto.request.ClubUpdateRequest;
import com.paradoks.agileproject.dto.response.APPaged;
import com.paradoks.agileproject.dto.response.ClubResponse;
import com.paradoks.agileproject.exception.UnauthorizedException;
import com.paradoks.agileproject.model.ClubModel;
import com.paradoks.agileproject.model.SessionModel;
import com.paradoks.agileproject.service.ClubService;
import com.paradoks.agileproject.service.SessionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.paradoks.agileproject.dto.request.PageableRequestParams;

@Tag(name = "Clubs", description = "Kulüp işlemleri")
@RestController
@RequestMapping("/api/v1/clubs")
public class ClubController {

    private final ClubService clubService;
    private final SessionService sessionService;
    private final ClubMapper clubMapper;

    public ClubController(ClubService clubService, SessionService sessionService, ClubMapper clubMapper) {
        this.clubService = clubService;
        this.sessionService = sessionService;
        this.clubMapper = clubMapper;
    }

    @Operation(summary = "Kulüp bilgilerini günceller")
    @PutMapping()
    public ResponseEntity<ClubResponse> updateClub(
            @Valid @RequestBody ClubUpdateRequest request
    ) {
        SessionModel currentSession = sessionService.getCurrentSession().orElseThrow(() -> new UnauthorizedException("Not Authenticated"));
        Long clubId = currentSession.getClub().getId();
        return ResponseEntity.ok(clubMapper.clubToClubResponse(clubService.updateClub(clubId, request)));
    }

    @Operation(summary = "Kulüp profil resmini günceller")
    @PostMapping(value = "/profile-picture", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ClubResponse> updateProfilePicture(
            @RequestParam("profilePicture") MultipartFile profilePicture
    ) {
        SessionModel currentSession = sessionService.getCurrentSession().orElseThrow(() -> new UnauthorizedException("Not Authenticated"));
        Long clubId = currentSession.getClub().getId();
        return ResponseEntity.ok(clubMapper.clubToClubResponse(clubService.updateProfilePicture(clubId, profilePicture)));
    }

    @Operation(summary = "Kulüp banner'ını günceller")
    @PostMapping(value = "/banner", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ClubResponse> updateBanner(
            @RequestParam("banner") MultipartFile banner
    ) {
        SessionModel currentSession = sessionService.getCurrentSession().orElseThrow(() -> new UnauthorizedException("Not Authenticated"));
        Long clubId = currentSession.getClub().getId();
        return ResponseEntity.ok(clubMapper.clubToClubResponse(clubService.updateBanner(clubId, banner)));
    }


    @Operation(summary = "Kulüp açıklamasını günceller")
    @PutMapping("/description")
    public ResponseEntity<ClubResponse> updateClubDescription(
            @Valid @RequestBody com.paradoks.agileproject.dto.request.ClubDescriptionUpdateRequest request
    ) {
        SessionModel currentSession = sessionService.getCurrentSession().orElseThrow(() -> new UnauthorizedException("Not Authenticated"));
        Long clubId = currentSession.getClub().getId();
        return ResponseEntity.ok(clubMapper.clubToClubResponse(clubService.updateClubDescription(clubId, request)));
    }

    @Operation(summary = "Kulüpleri listeler")
    @GetMapping
    public ResponseEntity<APPaged<ClubResponse>> listClubs(@Valid PageableRequestParams params) {
        Page<ClubModel> clubs = clubService.listClubs(params);
        return ResponseEntity.ok(APPaged.from(clubs.map(clubMapper::clubToClubResponse)));
    }

    @Operation(summary = "Belirli id'ye sahip kulübü getirir")
    @GetMapping("/{id}")
    public ResponseEntity<ClubResponse> getClubWithId(@PathVariable Long id) {
        ClubResponse response = clubMapper.clubToClubResponse(clubService.getClub(id));
        return ResponseEntity.ok(response);
    }
}
