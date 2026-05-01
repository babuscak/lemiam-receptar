-- Re-seed admin user with BCrypt $2a$ hash for Spring Security compatibility
-- Password: admin
INSERT INTO lr_users (id, email, password_hash, role)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'admin@receptar.com',
    '$2a$10$Cd90F5dU91JL/NZnIlWAy.8HtaechXxLX.vD6X7Geb2GolkDjcE0.',
    'ADMIN'
)
ON CONFLICT (email) DO UPDATE SET
    password_hash = '$2a$10$Cd90F5dU91JL/NZnIlWAy.8HtaechXxLX.vD6X7Geb2GolkDjcE0.';
