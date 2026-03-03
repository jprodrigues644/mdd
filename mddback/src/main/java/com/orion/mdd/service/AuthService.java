package com.orion.mdd.service;

import com.orion.mdd.dto.request.LoginRequest;
import com.orion.mdd.dto.request.RegisterRequest;
import com.orion.mdd.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
