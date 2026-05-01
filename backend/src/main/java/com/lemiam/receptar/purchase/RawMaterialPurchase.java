package com.lemiam.receptar.purchase;

import com.lemiam.receptar.item.Item;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "lr_raw_material_purchases")
public class RawMaterialPurchase {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    private String supplier;

    @Column(name = "purchase_quantity", nullable = false)
    private BigDecimal purchaseQuantity;

    @Column(name = "purchase_unit", nullable = false)
    private String purchaseUnit;

    @Column(name = "total_price_eur", nullable = false)
    private BigDecimal totalPriceEur;

    @Column(name = "price_per_base_unit", nullable = false)
    private BigDecimal pricePerBaseUnit;

    @Column(name = "purchased_at", nullable = false)
    private OffsetDateTime purchasedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    void prePersist() {
        createdAt = OffsetDateTime.now();
        if (purchasedAt == null) purchasedAt = OffsetDateTime.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Item getItem() { return item; }
    public void setItem(Item item) { this.item = item; }
    public String getSupplier() { return supplier; }
    public void setSupplier(String supplier) { this.supplier = supplier; }
    public BigDecimal getPurchaseQuantity() { return purchaseQuantity; }
    public void setPurchaseQuantity(BigDecimal purchaseQuantity) { this.purchaseQuantity = purchaseQuantity; }
    public String getPurchaseUnit() { return purchaseUnit; }
    public void setPurchaseUnit(String purchaseUnit) { this.purchaseUnit = purchaseUnit; }
    public BigDecimal getTotalPriceEur() { return totalPriceEur; }
    public void setTotalPriceEur(BigDecimal totalPriceEur) { this.totalPriceEur = totalPriceEur; }
    public BigDecimal getPricePerBaseUnit() { return pricePerBaseUnit; }
    public void setPricePerBaseUnit(BigDecimal pricePerBaseUnit) { this.pricePerBaseUnit = pricePerBaseUnit; }
    public OffsetDateTime getPurchasedAt() { return purchasedAt; }
    public void setPurchasedAt(OffsetDateTime purchasedAt) { this.purchasedAt = purchasedAt; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
}
