package com.lemiam.receptar.purchase.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record PurchaseResponse(
        UUID id,
        UUID itemId,
        String supplier,
        BigDecimal purchaseQuantity,
        String purchaseUnit,
        BigDecimal totalPriceEur,
        BigDecimal pricePerBaseUnit,
        OffsetDateTime purchasedAt
) {}
