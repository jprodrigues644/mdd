package com.orion.mdd.service;

import com.orion.mdd.dto.request.UpdateUserRequest;
import com.orion.mdd.dto.response.UserResponse;
import com.orion.mdd.model.User;

import java.util.List;

public interface UserService {
    UserResponse getUserById(Long userId);
    UserResponse updateUser(Long userId, UpdateUserRequest request);
    List<UserResponse> getAllUsers();
    User getUserEntityById(Long userId);

    //me
    UserResponse getMe(String username);
    UserResponse updateMe(String username, UpdateUserRequest request);
}