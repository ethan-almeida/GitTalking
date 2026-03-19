INSERT INTO users (id, display_name, email, password_hash, role) VALUES 
(uuid_generate_v4(), 'Admin User', 'admin@example.com', '$2b$10$EXAMPLE_HASH_PLACEHOLDER', 'admin');

INSERT INTO users (id, display_name, email, password_hash, role) VALUES 
(uuid_generate_v4(), 'John Doe', 'john@example.com', '$2b$10$EXAMPLE_HASH_PLACEHOLDER', 'user');

INSERT INTO channels (name, description) VALUES 
('General Discussion', 'Talk about anything programming related.'),
('Help & Support', 'Ask your questions here.');