package com.orion.mdd.mapper;

import com.orion.mdd.dto.request.RegisterRequest;
import com.orion.mdd.dto.response.UserResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import com.orion.mdd.model.*;

@Mapper(componentModel = "spring", uses = {SubjectMapper.class})
public interface UserMapper {
    UserResponse toUserResponse(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "subscriptions", ignore = true)
    User toUser(RegisterRequest request);


}
