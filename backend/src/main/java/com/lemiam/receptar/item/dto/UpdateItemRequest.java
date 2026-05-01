package com.lemiam.receptar.item.dto;

import java.math.BigDecimal;
import java.util.List;

public record UpdateItemRequest(
        String name,
        String sku,
        String packageUnit,
        BigDecimal packageQuantity,
        BigDecimal packagePriceEur,
        String recipeUnit,
        List<String> allergens,
        Boolean active
) {}
