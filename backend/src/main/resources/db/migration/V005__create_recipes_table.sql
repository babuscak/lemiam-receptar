CREATE TABLE lr_recipes (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id           UUID NOT NULL UNIQUE REFERENCES lr_items(id),
    yield_quantity    NUMERIC(12, 4) NOT NULL CHECK (yield_quantity > 0),
    yield_unit        VARCHAR(20)  NOT NULL,
    piece_weight_grams NUMERIC(10, 2),
    notes             TEXT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lr_recipes_item_id ON lr_recipes (item_id);
