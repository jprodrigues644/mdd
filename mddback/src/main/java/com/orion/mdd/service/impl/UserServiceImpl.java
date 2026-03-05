package com.orion.mdd.service.impl;

import com.orion.mdd.dto.request.UpdateUserRequest;
import com.orion.mdd.dto.response.UserResponse;
import com.orion.mdd.mapper.UserMapper;
import com.orion.mdd.model.User;
import com.orion.mdd.repository.UserRepository;
import com.orion.mdd.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse getUserById(Long userId) {
        User user = getUserEntityById(userId);
        return userMapper.toUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateUser(Long userId, UpdateUserRequest request) {

        User user = getUserEntityById(userId);

        // Email
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            user.setEmail(request.getEmail());
        }

        // Username
        if (request.getUsername() != null && !request.getUsername().isBlank()) {
            user.setUsername(request.getUsername());
        }

        // Password
        if (request.getPassword() != null && !request.getPassword().isBlank()) {

            String encodedPassword = passwordEncoder.encode(request.getPassword());

            if (encodedPassword.equals(request.getPassword())) {
                throw new RuntimeException("Password encoding failed");
            }

            user.setPassword(encodedPassword);
        }

        User savedUser = userRepository.save(user);

        if (savedUser.getPassword() != null && !savedUser.getPassword().startsWith("$2")) {
            throw new RuntimeException("Password not encoded properly");
        }

        return userMapper.toUserResponse(savedUser);
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    public User getUserEntityById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }

    @Override
    public UserResponse getMe(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));

        return userMapper.toUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateMe(String username, UpdateUserRequest request) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));

        // Email
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            user.setEmail(request.getEmail());
        }

        // Username
        if (request.getUsername() != null && !request.getUsername().isBlank()) {
            user.setUsername(request.getUsername());
        }

        // Password
        if (request.getPassword() != null && !request.getPassword().isBlank()) {

            String encodedPassword = passwordEncoder.encode(request.getPassword());

            if (encodedPassword.equals(request.getPassword())) {
                throw new RuntimeException("Password encoding failed");
            }

            if (!encodedPassword.startsWith("$2")) {
                throw new RuntimeException("Password encoding produced invalid hash");
            }

            user.setPassword(encodedPassword);
        }

        User savedUser = userRepository.save(user);

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            if (!savedUser.getPassword().startsWith("$2")) {
                throw new RuntimeException("Password was saved in clear text - SECURITY ISSUE");
            }
        }

        return userMapper.toUserResponse(savedUser);
    }
}