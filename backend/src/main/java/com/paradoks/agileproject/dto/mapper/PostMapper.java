package com.paradoks.agileproject.dto.mapper;

import com.paradoks.agileproject.model.Post;
import com.paradoks.agileproject.dto.response.PostResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(uses = { ClubMapper.class })
public interface PostMapper {
    @Mapping(source = "club", target = "club")
    PostResponse postToPostResponse(Post post);
}
