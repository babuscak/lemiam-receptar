package com.lemiam.receptar.purchase;

import com.lemiam.receptar.purchase.dto.AddPurchaseRequest;
import com.lemiam.receptar.purchase.dto.PurchaseResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/raw-materials")
public class RawMaterialPurchaseController {

    private final RawMaterialPurchaseService service;

    public RawMaterialPurchaseController(RawMaterialPurchaseService service) {
        this.service = service;
    }

    @PostMapping("/{itemId}/price")
    public ResponseEntity<PurchaseResponse> addPurchase(@PathVariable UUID itemId,
                                                         @Valid @RequestBody AddPurchaseRequest request) {
        RawMaterialPurchase p = service.addPurchase(itemId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(p));
    }

    @GetMapping("/{itemId}/price-history")
    public List<PurchaseResponse> getPriceHistory(@PathVariable UUID itemId) {
        return service.getPriceHistory(itemId).stream()
                .map(this::toResponse)
                .toList();
    }

    private PurchaseResponse toResponse(RawMaterialPurchase p) {
        return new PurchaseResponse(p.getId(), p.getItem().getId(), p.getSupplier(),
                p.getPurchaseQuantity(), p.getPurchaseUnit(), p.getTotalPriceEur(),
                p.getPricePerBaseUnit(), p.getPurchasedAt());
    }
}
