-- Migration script to add free_card column to students table
-- This script adds a free_card column to track students with free card status
-- When free_card is 1, monthly fees should not be displayed to the student

ALTER TABLE students ADD COLUMN free_card TINYINT(1) DEFAULT 0;

-- Add comment to document the purpose of this column
ALTER TABLE students MODIFY COLUMN free_card TINYINT(1) DEFAULT 0 COMMENT 'Free card status: 1 = has free card (no monthly fees displayed), 0 = normal student';
