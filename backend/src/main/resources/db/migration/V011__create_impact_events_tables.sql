CREATE TABLE lr_impact_events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trigger_item_id UUID NOT NULL REFERENCES lr_items(id),
    old_price_eur   NUMERIC(12, 6) NOT NULL,
    new_price_eur   NUMERIC(12, 6) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lr_impact_events_trigger_item_id ON lr_impact_events (trigger_item_id);
CREATE INDEX idx_lr_impact_events_created_at ON lr_impact_events (created_at DESC);

CREATE TABLE lr_impact_event_items (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    impact_event_id     UUID NOT NULL REFERENCES lr_impact_events(id) ON DELETE CASCADE,
    item_id             UUID NOT NULL REFERENCES lr_items(id),
    old_cost_eur        NUMERIC(12, 6) NOT NULL,
    new_cost_eur        NUMERIC(12, 6) NOT NULL,
    delta_eur           NUMERIC(12, 6) NOT NULL,
    delta_percent       NUMERIC(8, 4) NOT NULL,
    repricing_status    VARCHAR(20) NOT NULL CHECK (repricing_status IN ('COST_CHANGED', 'NEEDS_REPRICE', 'NO_CHANGE')),
    paths_json          JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE INDEX idx_lr_impact_event_items_event_id ON lr_impact_event_items (impact_event_id);
CREATE INDEX idx_lr_impact_event_items_item_id ON lr_impact_event_items (item_id);
