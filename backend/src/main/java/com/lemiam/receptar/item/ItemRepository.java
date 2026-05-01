package com.lemiam.receptar.item;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ItemRepository extends JpaRepository<Item, UUID> {

    List<Item> findByActiveTrue();

    @Query(value = "SELECT * FROM lr_items i WHERE " +
           "(:active IS NULL OR i.is_active = :active) " +
           "AND (:search IS NULL OR LOWER(i.name) LIKE LOWER('%' || CAST(:search AS TEXT) || '%'))",
           nativeQuery = true)
    List<Item> findFiltered(@Param("active") Boolean active,
                            @Param("search") String search);
}
