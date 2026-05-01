CREATE TABLE lr_computed_cost_snapshots (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id             UUID NOT NULL REFERENCES lr_items(id),
    material_cost_eur   NUMERIC(12, 6) NOT NULL,
    labor_cost_eur      NUMERIC(12, 6) NOT NULL,
    total_cost_eur      NUMERIC(12, 6) NOT NULL,
    cost_per_unit_eur   NUMERIC(12, 6) NOT NULL,
    yield_quantity      NUMERIC(12, 4) NOT NULL,
    yield_unit          VARCHAR(20) NOT NULL,
    breakdown_json      JSONB NOT NULL DEFAULT '{}'::jsonb,
    computed_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lr_cost_snapshots_item_id ON lr_computed_cost_snapshots (item_id);
CREATE INDEX idx_lr_cost_snapshots_latest ON lr_computed_cost_snapshots (item_id, computed_at DESC);
