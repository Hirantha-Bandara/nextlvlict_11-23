-- Fix password column size to accommodate BCrypt hashes (60 characters)
ALTER TABLE admin_users MODIFY COLUMN password VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL;
