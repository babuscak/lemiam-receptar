package com.lemiam.receptar.purchase;

import com.lemiam.receptar.common.exception.NotFoundException;
import com.lemiam.receptar.item.Item;
import com.lemiam.receptar.item.ItemRepository;
import com.lemiam.receptar.purchase.dto.AddPurchaseRequest;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class RawMaterialPurchaseService {

    private final RawMaterialPurchaseRepository purchaseRepository;
    private final ItemRepository itemRepository;
    private final ApplicationEventPublisher eventPublisher;

    public RawMaterialPurchaseService(RawMaterialPurchaseRepository purchaseRepository,
                                      ItemRepository itemRepository,
                                      ApplicationEventPublisher eventPublisher) {
        this.purchaseRepository = purchaseRepository;
        this.itemRepository = itemRepository;
        this.eventPublisher = eventPublisher;
    }

    public RawMaterialPurchase addPurchase(UUID itemId, AddPurchaseRequest request) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new NotFoundException("Item not found: " + itemId));

        BigDecimal oldPrice = getCurrentPricePerBaseUnit(itemId).orElse(null);

        BigDecimal quantityInRecipeUnit = UnitConversion.convert(
                request.purchaseQuantity(), request.purchaseUnit(), item.getRecipeUnit());
        BigDecimal pricePerBaseUnit = request.totalPriceEur()
                .divide(quantityInRecipeUnit, new MathContext(10, RoundingMode.HALF_UP));

        RawMaterialPurchase purchase = new RawMaterialPurchase();
        purchase.setItem(item);
        purchase.setSupplier(request.supplier());
        purchase.setPurchaseQuantity(request.purchaseQuantity());
        purchase.setPurchaseUnit(request.purchaseUnit());
        purchase.setTotalPriceEur(request.totalPriceEur());
        purchase.setPricePerBaseUnit(pricePerBaseUnit);
        purchase = purchaseRepository.save(purchase);

        if (oldPrice != null && oldPrice.compareTo(pricePerBaseUnit) != 0) {
            eventPublisher.publishEvent(new PriceChangedEvent(this, itemId, oldPrice, pricePerBaseUnit));
        }

        return purchase;
    }

    @Transactional(readOnly = true)
    public Optional<BigDecimal> getCurrentPricePerBaseUnit(UUID itemId) {
        return purchaseRepository.findFirstByItemIdOrderByPurchasedAtDesc(itemId)
                .map(RawMaterialPurchase::getPricePerBaseUnit);
    }

    @Transactional(readOnly = true)
    public List<RawMaterialPurchase> getPriceHistory(UUID itemId) {
        return purchaseRepository.findByItemIdOrderByPurchasedAtDesc(itemId);
    }
}
