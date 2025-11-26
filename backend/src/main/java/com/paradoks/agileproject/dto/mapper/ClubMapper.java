package com.paradoks.agileproject.dto.mapper;

import com.paradoks.agileproject.dto.response.ClubResponse;
import com.paradoks.agileproject.model.ClubModel;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ClubMapper {
    ClubResponse clubToClubResponse(ClubModel club);
}
