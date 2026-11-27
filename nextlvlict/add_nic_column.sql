-- Migration script to add NIC column to students table
-- This script adds a nullable NIC column to capture NIC numbers for A/L students

ALTER TABLE students ADD COLUMN nic VARCHAR(20) NULL;

-- Add comment to document the purpose of this column
ALTER TABLE students MODIFY COLUMN nic VARCHAR(20) NULL COMMENT 'NIC number for A/L students (optional)';
