package com.paradoks.agileproject.controller;

import com.paradoks.agileproject.dto.mapper.ClubMapper;
import com.paradoks.agileproject.dto.mapper.PostMapper;
import com.paradoks.agileproject.dto.mapper.UserMapper;
import com.paradoks.agileproject.dto.request.ClubUpdateRequest;
import com.paradoks.agileproject.dto.response.APPaged;
import com.paradoks.agileproject.dto.response.ApiResponse;
import com.paradoks.agileproject.dto.response.ClubResponse;
import com.paradoks.agileproject.dto.response.PostResponse;
import com.paradoks.agileproject.dto.response.UserResponse;
import com.paradoks.agileproject.exception.UnauthorizedException;
import com.paradoks.agileproject.model.ClubModel;
import com.paradoks.agileproject.model.Post;
import com.paradoks.agileproject.model.ClubSession;
import com.paradoks.agileproject.model.User;
import com.paradoks.agileproject.model.UserSession;
import com.paradoks.agileproject.service.ClubService;
import com.paradoks.agileproject.service.ClubSessionService;
import com.paradoks.agileproject.service.UserSessionService;
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
    private final ClubSessionService clubSessionService;
    private final ClubMapper clubMapper;
    private final PostMapper postMapper;
    private final UserSessionService userSessionService;
    private final UserMapper userMapper;

    public ClubController(ClubService clubService, ClubSessionService clubSessionService, ClubMapper clubMapper, PostMapper postMapper, UserSessionService userSessionService, UserMapper userMapper) {
        this.clubService = clubService;
        this.clubSessionService = clubSessionService;
        this.clubMapper = clubMapper;
        this.postMapper = postMapper;
        this.userSessionService = userSessionService;
        this.userMapper = userMapper;
    }

    @Operation(summary = "Kulüp bilgilerini günceller")
    @PutMapping()
    public ResponseEntity<ClubResponse> updateClub(
            @Valid @RequestBody ClubUpdateRequest request
    ) {
        ClubSession currentSession = clubSessionService.getCurrentSession().orElseThrow(() -> new UnauthorizedException("Not Authenticated"));
        Long clubId = currentSession.getClub().getId();
        return ResponseEntity.ok(clubMapper.clubToClubResponse(clubService.updateClub(clubId, request)));
    }

    @Operation(summary = "Kulüp profil resmini günceller")
    @PostMapping(value = "/profile-picture", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ClubResponse> updateProfilePicture(
            @RequestParam("profilePicture") MultipartFile profilePicture
    ) {
        ClubSession currentSession = clubSessionService.getCurrentSession().orElseThrow(() -> new UnauthorizedException("Not Authenticated"));
        Long clubId = currentSession.getClub().getId();
        return ResponseEntity.ok(clubMapper.clubToClubResponse(clubService.updateProfilePicture(clubId, profilePicture)));
    }

    @Operation(summary = "Kulüp banner'ını günceller")
    @PostMapping(value = "/banner", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ClubResponse> updateBanner(
            @RequestParam("banner") MultipartFile banner
    ) {
        ClubSession currentSession = clubSessionService.getCurrentSession().orElseThrow(() -> new UnauthorizedException("Not Authenticated"));
        Long clubId = currentSession.getClub().getId();
        return ResponseEntity.ok(clubMapper.clubToClubResponse(clubService.updateBanner(clubId, banner)));
    }


    @Operation(summary = "Kulüp açıklamasını günceller")
    @PutMapping("/description")
    public ResponseEntity<ClubResponse> updateClubDescription(
            @Valid @RequestBody com.paradoks.agileproject.dto.request.ClubDescriptionUpdateRequest request
    ) {
        ClubSession currentSession = clubSessionService.getCurrentSession().orElseThrow(() -> new UnauthorizedException("Not Authenticated"));
        Long clubId = currentSession.getClub().getId();
        return ResponseEntity.ok(clubMapper.clubToClubResponse(clubService.updateClubDescription(clubId, request)));
    }

    @Operation(summary = "Kulüpleri listeler")
    @GetMapping
    public ResponseEntity<APPaged<ClubResponse>> listClubs(@Valid PageableRequestParams params) {
        Page<ClubModel> clubs = clubService.listClubs(params);
        return ResponseEntity.ok(APPaged.from(clubs.map(clubMapper::clubToClubResponse)));
    }

    @Operation(summary = "Kulüplerin gönderilerini listeler")
    @GetMapping("/{id}/posts")
    public ResponseEntity<APPaged<PostResponse>> listClubPosts(@PathVariable Long id, @Valid PageableRequestParams params) {
        Page<Post> clubs = clubService.listClubPosts(clubService.getClub(id).getId(), params);
        return ResponseEntity.ok(APPaged.from(clubs.map(postMapper::postToPostResponse)));
    }

    @Operation(summary = "Belirli id'ye sahip kulübü getirir")
    @GetMapping("/{id}")
    public ResponseEntity<ClubResponse> getClubWithId(@PathVariable Long id) {
        ClubResponse response = clubMapper.clubToClubResponse(clubService.getClub(id));
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Kulübe üye ol veya üyelikten çık")
    @PostMapping("/{id}/membership")
    public ResponseEntity<ApiResponse> toggleMembership(@PathVariable Long id) {
        UserSession userSession = userSessionService.getCurrentSession()
                .orElseThrow(() -> new UnauthorizedException("Not Authenticated"));

        boolean joined = clubService.toggleMembership(id, userSession.getUser().getId());
        String message = joined ? "Successfully joined the club" : "Successfully left the club";
        return ResponseEntity.ok(new ApiResponse(true, message));
    }

    @Operation(summary = "Kulüp üyelerini listeler")
    @GetMapping("/{id}/members")
    public ResponseEntity<APPaged<UserResponse>> listClubMembers(@PathVariable Long id, @Valid PageableRequestParams params) {
        Page<User> members = clubService.getClubMembers(id, params);
        return ResponseEntity.ok(APPaged.from(members.map(userMapper::userToUserResponse)));
    }

}
