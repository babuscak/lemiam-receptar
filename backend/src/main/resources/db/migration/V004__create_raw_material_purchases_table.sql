CREATE TABLE lr_raw_material_purchases (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id             UUID NOT NULL REFERENCES lr_items(id),
    supplier            VARCHAR(255),
    purchase_quantity   NUMERIC(12, 4) NOT NULL CHECK (purchase_quantity > 0),
    purchase_unit       VARCHAR(20)  NOT NULL,
    total_price_eur     NUMERIC(12, 4) NOT NULL CHECK (total_price_eur > 0),
    price_per_base_unit NUMERIC(12, 6) NOT NULL,
    purchased_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lr_raw_material_purchases_item_id ON lr_raw_material_purchases (item_id);
CREATE INDEX idx_lr_raw_material_purchases_purchased_at ON lr_raw_material_purchases (item_id, purchased_at DESC);
