-- Unit reference table: models unit families and derived-unit relationships
CREATE TABLE lr_units (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                VARCHAR(50)    NOT NULL UNIQUE,
    abbreviation        VARCHAR(10)    NOT NULL UNIQUE,
    unit_family         VARCHAR(20)    NOT NULL CHECK (unit_family IN ('MASS', 'VOLUME', 'PIECE')),
    base_unit_id        UUID           REFERENCES lr_units(id),
    conversion_to_base  NUMERIC(18, 8) NOT NULL DEFAULT 1 CHECK (conversion_to_base > 0),
    created_at          TIMESTAMPTZ    NOT NULL DEFAULT now()
);

CREATE INDEX idx_lr_units_base_unit_id ON lr_units (base_unit_id);

-- Seed base units (base_unit_id = NULL)
INSERT INTO lr_units (id, name, abbreviation, unit_family, base_unit_id, conversion_to_base)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Gram',       'g',   'MASS',   NULL, 1),
    ('a0000000-0000-0000-0000-000000000002', 'Milliliter', 'ml',  'VOLUME', NULL, 1),
    ('a0000000-0000-0000-0000-000000000003', 'Piece',      'pcs', 'PIECE',  NULL, 1);

-- Seed derived units
INSERT INTO lr_units (name, abbreviation, unit_family, base_unit_id, conversion_to_base)
VALUES
    ('Milligram', 'mg', 'MASS',   'a0000000-0000-0000-0000-000000000001', 0.001),
    ('Kilogram',  'kg', 'MASS',   'a0000000-0000-0000-0000-000000000001', 1000),
    ('Liter',     'l',  'VOLUME', 'a0000000-0000-0000-0000-000000000002', 1000);
