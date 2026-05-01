package com.lemiam.receptar.item.dto;

import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;
import java.util.List;

public record CreateItemRequest(
        @NotBlank String name,
        String sku,
        @NotBlank String packageUnit,
        BigDecimal packageQuantity,
        BigDecimal packagePriceEur,
        @NotBlank String recipeUnit,
        List<String> allergens
) {}
