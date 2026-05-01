package com.lemiam.receptar.purchase.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record AddPurchaseRequest(
        String supplier,
        @NotNull @Positive BigDecimal purchaseQuantity,
        @NotBlank String purchaseUnit,
        @NotNull @Positive BigDecimal totalPriceEur
) {}
