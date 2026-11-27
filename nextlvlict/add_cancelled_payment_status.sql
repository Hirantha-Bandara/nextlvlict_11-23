-- Migration: Add CANCELLED status to payment_status table
-- Purpose: Enable proper payment lifecycle management for cancelled/abandoned payments
-- Issue: Issue 4 - Cancelled payment prevents student from retrying payment
-- Date: 2026-10-13

-- Add CANCELLED status to payment_status table
INSERT INTO payment_status (id, value) VALUES (5, 'CANCELLED');

-- Verify the insertion
SELECT * FROM payment_status WHERE id = 5;

-- Expected result should show:
-- id | value
-- 5  | CANCELLED
