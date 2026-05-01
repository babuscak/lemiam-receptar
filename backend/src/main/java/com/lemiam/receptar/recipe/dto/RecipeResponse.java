package com.lemiam.receptar.recipe.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record RecipeResponse(
        UUID id,
        String name,
        String type,
        int portions,
        BigDecimal pricePerPortion,
        BigDecimal totalCost,
        String notes,
        List<RecipeLineResponse> lines,
        boolean active,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {}
