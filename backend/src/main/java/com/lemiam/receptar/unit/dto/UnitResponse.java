package com.lemiam.receptar.unit.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record UnitResponse(
        UUID id,
        String name,
        String abbreviation,
        String unitFamily,
        UUID baseUnitId,
        BigDecimal conversionToBase
) {}
