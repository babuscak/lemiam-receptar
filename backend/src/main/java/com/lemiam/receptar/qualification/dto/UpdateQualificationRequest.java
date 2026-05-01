package com.lemiam.receptar.qualification.dto;

import java.math.BigDecimal;

public record UpdateQualificationRequest(
        String name,
        BigDecimal hourlyRateEur,
        Boolean active
) {}
