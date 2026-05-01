package com.lemiam.receptar.recipe.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record RecipeLineResponse(
        UUID id,
        UUID itemId,
        String itemName,
        UUID subRecipeId,
        String subRecipeName,
        String unit,
        BigDecimal quantity,
        BigDecimal pricePerUnit,
        BigDecimal lineCost,
        int sortOrder,
        OffsetDateTime createdAt
) {}
