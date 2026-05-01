package com.lemiam.receptar.purchase;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;

public final class UnitConversion {

    private static final MathContext MC = new MathContext(10, RoundingMode.HALF_UP);

    private UnitConversion() {}

    public static BigDecimal convert(BigDecimal quantity, String fromUnit, String toUnit) {
        if (fromUnit.equalsIgnoreCase(toUnit)) {
            return quantity;
        }

        String from = fromUnit.toLowerCase();
        String to = toUnit.toLowerCase();

        BigDecimal base = toBase(quantity, from);
        return fromBase(base, to);
    }

    private static BigDecimal toBase(BigDecimal qty, String unit) {
        return switch (unit) {
            case "g" -> qty;
            case "kg" -> qty.multiply(new BigDecimal("1000"));
            case "ml" -> qty;
            case "l" -> qty.multiply(new BigDecimal("1000"));
            case "pcs", "pc", "piece", "pieces" -> qty;
            default -> throw new IllegalArgumentException("Unsupported unit: " + unit);
        };
    }

    private static BigDecimal fromBase(BigDecimal base, String unit) {
        return switch (unit) {
            case "g" -> base;
            case "kg" -> base.divide(new BigDecimal("1000"), MC);
            case "ml" -> base;
            case "l" -> base.divide(new BigDecimal("1000"), MC);
            case "pcs", "pc", "piece", "pieces" -> base;
            default -> throw new IllegalArgumentException("Unsupported unit: " + unit);
        };
    }
}
