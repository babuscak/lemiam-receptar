-- Password: admin (bcrypt encoded)
INSERT INTO lr_users (id, email, password_hash, role)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'admin@receptar.com',
    '$2b$10$dlfMlsTXlrZUVCzjjCs4Fe501y7/WaJglJfeZrgfbB51zTijohig.',
    'ADMIN'
);
