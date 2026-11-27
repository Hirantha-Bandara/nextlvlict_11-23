-- Migration script to add recording bundles feature
-- This script creates tables for bundling class recordings together

-- Create recording_bundles table
CREATE TABLE IF NOT EXISTS recording_bundles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DOUBLE DEFAULT 0.00,
    access_type VARCHAR(20) DEFAULT 'PAID',
    is_active INT DEFAULT 1,
    thumbnail_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    grade_id INT,
    FOREIGN KEY (grade_id) REFERENCES grade(id) ON DELETE SET NULL
);

-- Create bundle_recordings junction table
CREATE TABLE IF NOT EXISTS bundle_recordings (
    bundle_id INT NOT NULL,
    recording_id INT NOT NULL,
    PRIMARY KEY (bundle_id, recording_id),
    FOREIGN KEY (bundle_id) REFERENCES recording_bundles(id) ON DELETE CASCADE,
    FOREIGN KEY (recording_id) REFERENCES recordings(id) ON DELETE CASCADE
);

-- Create bundle_purchases table
CREATE TABLE IF NOT EXISTS bundle_purchases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bundle_id INT NOT NULL,
    students_id VARCHAR(50) NOT NULL,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_status VARCHAR(50) DEFAULT 'COMPLETED',
    order_id VARCHAR(100),
    amount_paid DOUBLE,
    FOREIGN KEY (bundle_id) REFERENCES recording_bundles(id) ON DELETE CASCADE,
    FOREIGN KEY (students_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Add indexes for better performance
CREATE INDEX idx_bundle_purchases_student ON bundle_purchases(students_id);
CREATE INDEX idx_bundle_purchases_bundle ON bundle_purchases(bundle_id);
