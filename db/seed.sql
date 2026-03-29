INSERT INTO users (display_name, email, pass_hashed, role) VALUES 
('Admin User', 'admin@example.com', '$2b$10$hXVG6nNPjJKlKS.iOd9K.uXMPJKZXZQFhKGw9eJg5Mz3XhNDQ4MC2', 'admin');

INSERT INTO users (display_name, email, pass_hashed, role) VALUES 
('John Doe', 'john@example.com', '$2b$10$EXAMPLE_HASH_PLACEHOLDER', 'user');

INSERT INTO channels (name, description) VALUES 
('General Discussion', 'Talk about anything programming related.'),
('Help & Support', 'Ask your questions here.');