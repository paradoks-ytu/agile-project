package com.paradoks.agileproject.dto.mapper;

import com.paradoks.agileproject.dto.request.UserRegisterRequest;
import com.paradoks.agileproject.dto.response.UserResponse;
import com.paradoks.agileproject.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponse userToUserResponse(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dateCreated", ignore = true)
    User userRegisterRequestToUser(UserRegisterRequest userRegisterRequest);
}
