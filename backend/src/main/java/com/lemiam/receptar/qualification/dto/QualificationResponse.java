package com.lemiam.receptar.qualification.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record QualificationResponse(
        UUID id,
        String name,
        BigDecimal hourlyRateEur,
        boolean active,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {}
