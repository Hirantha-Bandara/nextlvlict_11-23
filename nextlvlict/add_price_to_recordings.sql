-- Migration script to add price column to recordings table
-- This script adds a price column to enable payment for class recordings

ALTER TABLE recordings ADD COLUMN price DOUBLE DEFAULT 0.00;

-- Add comment to document the purpose of this column
ALTER TABLE recordings MODIFY COLUMN price DOUBLE DEFAULT 0.00 COMMENT 'Price for paid class recordings (0.00 for free recordings)';
