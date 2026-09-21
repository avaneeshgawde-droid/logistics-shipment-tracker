package com.logistics.service;

import com.logistics.dto.AuthResponse;
import com.logistics.dto.LoginRequest;
import com.logistics.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
