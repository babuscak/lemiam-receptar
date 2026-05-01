package com.lemiam.receptar.recipe.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.UUID;

public record RecipeLineRequest(
        UUID itemId,
        UUID subRecipeId,
        @NotNull @Positive BigDecimal quantity,
        Integer sortOrder
) {}
