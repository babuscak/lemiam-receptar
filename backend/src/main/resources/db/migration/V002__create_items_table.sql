CREATE TABLE lr_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type            VARCHAR(10)  NOT NULL CHECK (type IN ('RAW', 'SEMI', 'FINAL')),
    name            VARCHAR(255) NOT NULL,
    sku             VARCHAR(100) UNIQUE,
    base_unit       VARCHAR(20)  NOT NULL,
    density_g_per_ml NUMERIC(10, 4),
    allergens       JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lr_items_type ON lr_items (type);
CREATE INDEX idx_lr_items_is_active ON lr_items (is_active);
CREATE INDEX idx_lr_items_allergens ON lr_items USING GIN (allergens);
