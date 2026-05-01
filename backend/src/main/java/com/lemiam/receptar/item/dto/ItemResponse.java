package com.lemiam.receptar.item.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record ItemResponse(
        UUID id,
        String name,
        String sku,
        String packageUnit,
        BigDecimal packageQuantity,
        BigDecimal packagePriceEur,
        String recipeUnit,
        BigDecimal pricePerRecipeUnit,
        List<String> allergens,
        boolean active,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {}
