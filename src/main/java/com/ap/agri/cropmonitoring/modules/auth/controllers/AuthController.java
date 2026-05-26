package com.ap.agri.cropmonitoring.modules.auth.controllers;

import com.ap.agri.cropmonitoring.modules.auth.dtos.AuthRequest;
import com.ap.agri.cropmonitoring.modules.auth.dtos.AuthResponse;
import com.ap.agri.cropmonitoring.modules.auth.services.AuthService;
import com.ap.agri.cropmonitoring.shared.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication Service", description = "Endpoints for user login, credentials verification, and JWT generation.")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate User", description = "Verifies username and password and returns a stateless JWT token.")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Login successful"));
    }
}
