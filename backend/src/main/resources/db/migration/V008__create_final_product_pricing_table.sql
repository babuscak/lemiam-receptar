CREATE TABLE lr_final_product_pricing (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id         UUID NOT NULL REFERENCES lr_items(id),
    strategy        VARCHAR(30) NOT NULL CHECK (strategy IN ('MARGIN_PERCENT', 'MARKUP_MULTIPLIER', 'TARGET_FOOD_COST_PERCENT', 'FIXED_PRICE')),
    value           NUMERIC(12, 4) NOT NULL,
    computed_price_eur NUMERIC(12, 4),
    is_current      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lr_final_product_pricing_item_id ON lr_final_product_pricing (item_id);
CREATE INDEX idx_lr_final_product_pricing_current ON lr_final_product_pricing (item_id, is_current) WHERE is_current = TRUE;
