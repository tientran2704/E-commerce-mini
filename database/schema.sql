-- AI E-commerce Database Schema
-- Run this SQL to create the database and tables

-- Create database
CREATE DATABASE IF NOT EXISTS ai_ecommerce;
USE ai_ecommerce;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products Table (status: pending = chờ duyệt, approved = đã hiển thị)
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    image VARCHAR(500),
    category VARCHAR(100),
    stock INT DEFAULT 0,
    status ENUM('pending', 'approved') DEFAULT 'approved',
    created_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    shipping_address TEXT,
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Product Views Table (for AI recommendations)
CREATE TABLE IF NOT EXISTS product_views (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    product_id INT NOT NULL,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Insert sample products
INSERT INTO products (name, price, description, image, category, stock) VALUES
('MacBook Pro 14"', 1999.99, 'Apple MacBook Pro with M3 chip, 16GB RAM, 512GB SSD. Perfect for professionals and creators.', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', 'Laptops', 50),
('iPhone 15 Pro', 999.99, 'Apple iPhone 15 Pro with A17 Pro chip, titanium design, and advanced camera system.', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500', 'Phones', 100),
('Samsung Galaxy S24 Ultra', 1199.99, 'Samsung flagship with Snapdragon 8 Gen 3, 200MP camera, and S Pen.', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500', 'Phones', 80),
('Sony WH-1000XM5', 349.99, 'Premium noise-canceling headphones with exceptional sound quality and 30-hour battery.', 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500', 'Headphones', 150),
('iPad Pro 12.9"', 1099.99, 'Powerful tablet with M2 chip, Liquid Retina XDR display, and Apple Pencil support.', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500', 'Tablets', 60),
('Dell XPS 15', 1499.99, 'Premium Windows laptop with Intel Core i7, 32GB RAM, and OLED display.', 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500', 'Laptops', 40),
('Apple Watch Series 9', 399.99, 'Advanced smartwatch with health sensors, Always-On Retina display.', 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500', 'Smartwatches', 120),
('PlayStation 5', 499.99, 'Next-gen gaming console with 4K gaming, ray tracing, and DualSense controller.', 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500', 'Gaming', 30),
('Nintendo Switch OLED', 349.99, 'Handheld console with vibrant OLED screen and enhanced audio.', 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500', 'Gaming', 70),
('AirPods Pro 2', 249.99, 'Active noise cancellation, Adaptive Audio, and personalized spatial audio.', 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500', 'Headphones', 200),
('LG C3 OLED TV', 1796.99, '65-inch OLED evo TV with self-lit pixels and Dolby Vision.', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500', 'TVs', 25),
('Canon EOS R6 Mark II', 2499.99, 'Full-frame mirrorless camera with 24.2MP sensor and advanced autofocus.', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500', 'Cameras', 20),
('Razer Blade 15', 1799.99, 'Gaming laptop with RTX 4070, 144Hz display, and Chroma RGB keyboard.', 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500', 'Laptops', 35),
('Bose QuietComfort Ultra', 429.99, 'Premium headphones with spatial audio and world-class noise cancellation.', 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500', 'Headphones', 90),
('Google Pixel 8 Pro', 999.99, 'Google flagship with Tensor G3, AI features, and 7 years of updates.', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500', 'Phones', 65);

-- Insert sample admin user (password: admin123)
-- Password is hashed with bcrypt
INSERT INTO users (name, email, password, is_admin) VALUES
('Admin User', 'admin@example.com', '$2b$10$rKY5vZ5Qz7YNqZL1oGXDbOT1K9P.xJ8W5ZxZxZxZxZxZxZxZxZxZ', TRUE);

-- Note: The password hash above is a placeholder. 
-- To create a real admin user, register through the app and then run:
-- UPDATE users SET is_admin = TRUE WHERE email = 'your_email@example.com';

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
