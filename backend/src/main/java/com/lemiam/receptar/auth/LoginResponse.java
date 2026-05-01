package com.lemiam.receptar.auth;

import java.util.UUID;

public record LoginResponse(
        String token,
        UUID userId,
        String email,
        String role
) {}
