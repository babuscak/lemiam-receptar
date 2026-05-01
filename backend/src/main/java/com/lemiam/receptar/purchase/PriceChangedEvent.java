package com.lemiam.receptar.purchase;

import org.springframework.context.ApplicationEvent;

import java.math.BigDecimal;
import java.util.UUID;

public class PriceChangedEvent extends ApplicationEvent {

    private final UUID itemId;
    private final BigDecimal oldPrice;
    private final BigDecimal newPrice;

    public PriceChangedEvent(Object source, UUID itemId, BigDecimal oldPrice, BigDecimal newPrice) {
        super(source);
        this.itemId = itemId;
        this.oldPrice = oldPrice;
        this.newPrice = newPrice;
    }

    public UUID getItemId() { return itemId; }
    public BigDecimal getOldPrice() { return oldPrice; }
    public BigDecimal getNewPrice() { return newPrice; }
}
