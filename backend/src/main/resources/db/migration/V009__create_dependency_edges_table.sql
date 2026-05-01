CREATE TABLE lr_dependency_edges (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id   UUID NOT NULL REFERENCES lr_items(id),
    child_id    UUID NOT NULL REFERENCES lr_items(id),
    UNIQUE (parent_id, child_id)
);

CREATE INDEX idx_lr_dependency_edges_parent_id ON lr_dependency_edges (parent_id);
CREATE INDEX idx_lr_dependency_edges_child_id ON lr_dependency_edges (child_id);
