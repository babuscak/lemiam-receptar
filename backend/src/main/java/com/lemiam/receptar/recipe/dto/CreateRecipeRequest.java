package com.lemiam.receptar.recipe.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CreateRecipeRequest(
        @NotBlank String name,
        @NotBlank String type,
        @Positive int portions,
        String notes,
        @Size(min = 1, message = "At least one recipe line is required") @Valid List<RecipeLineRequest> lines
) {}
