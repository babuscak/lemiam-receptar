package com.lemiam.receptar.qualification.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record CreateQualificationRequest(
        @NotBlank String name,
        @NotNull @Positive BigDecimal hourlyRateEur
) {}
