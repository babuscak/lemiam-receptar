package com.lemiam.receptar.recipe.dto;

import jakarta.validation.Valid;

import java.util.List;

public record UpdateRecipeRequest(
        String name,
        String type,
        Integer portions,
        String notes,
        @Valid List<RecipeLineRequest> lines,
        Boolean active
) {}
