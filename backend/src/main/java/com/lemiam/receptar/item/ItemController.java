package com.lemiam.receptar.item;

import com.lemiam.receptar.item.dto.CreateItemRequest;
import com.lemiam.receptar.item.dto.ItemResponse;
import com.lemiam.receptar.item.dto.UpdateItemRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemService itemService;
    private final ItemMapper itemMapper;

    public ItemController(ItemService itemService, ItemMapper itemMapper) {
        this.itemService = itemService;
        this.itemMapper = itemMapper;
    }

    @GetMapping
    public List<ItemResponse> list(@RequestParam(required = false) Boolean active,
                                   @RequestParam(required = false) String search) {
        return itemService.findAll(active, search).stream()
                .map(itemMapper::toResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public ItemResponse get(@PathVariable UUID id) {
        return itemMapper.toResponse(itemService.findById(id));
    }

    @PostMapping
    public ResponseEntity<ItemResponse> create(@Valid @RequestBody CreateItemRequest request) {
        Item item = itemService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(itemMapper.toResponse(item));
    }

    @PatchMapping("/{id}")
    public ItemResponse update(@PathVariable UUID id, @RequestBody UpdateItemRequest request) {
        return itemMapper.toResponse(itemService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        itemService.softDelete(id);
    }
}
