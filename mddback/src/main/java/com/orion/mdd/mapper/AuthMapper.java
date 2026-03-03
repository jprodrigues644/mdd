package com.orion.mdd.mapper;

import com.orion.mdd.dto.response.AuthResponse;
import com.orion.mdd.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AuthMapper {

    @Mapping(target = "token", ignore = true)

    AuthResponse toAuthResponse(User user);
}