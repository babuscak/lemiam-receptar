package com.lemiam.receptar.purchase;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RawMaterialPurchaseRepository extends JpaRepository<RawMaterialPurchase, UUID> {

    List<RawMaterialPurchase> findByItemIdOrderByPurchasedAtDesc(UUID itemId);

    Optional<RawMaterialPurchase> findFirstByItemIdOrderByPurchasedAtDesc(UUID itemId);
}
