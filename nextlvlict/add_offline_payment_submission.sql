-- Migration: Offline Payment Submission Feature
-- Description: Add support for bank transfer/ATM payment slip uploads with admin approval workflow
-- Date: 2026-10-13
-- Author: Cascade Implementation

-- Add PENDING_REVIEW status to payment_status table
-- This status is used for offline payment submissions awaiting admin review
INSERT INTO payment_status (id, value) VALUES (6, 'PENDING_REVIEW');

-- Create offline_payment_submissions table
-- This table stores student payment slip submissions for bank transfer/ATM payments
CREATE TABLE offline_payment_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(50) NOT NULL,
  monthly_fee_id INT NOT NULL,
  payment_method ENUM('BANK_TRANSFER', 'ATM_DEPOSIT', 'ATM_TRANSFER') NOT NULL,
  amount_paid DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL,
  transaction_reference VARCHAR(100),
  bank_name VARCHAR(100),
  r2_object_key VARCHAR(500) NOT NULL,
  r2_file_name VARCHAR(255),
  r2_file_size BIGINT,
  r2_content_type VARCHAR(100),
  submission_status ENUM('PENDING_REVIEW', 'APPROVED', 'REJECTED') DEFAULT 'PENDING_REVIEW',
  rejection_reason TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP NULL,
  reviewed_by INT NULL,
  payment_transaction_id INT NULL,
  
  -- Constraints and indexes
  UNIQUE KEY uk_fee_pending (monthly_fee_id, submission_status),
  INDEX idx_student (student_id),
  INDEX idx_status (submission_status),
  INDEX idx_reviewed_by (reviewed_by),
  INDEX idx_submitted_at (submitted_at),
  INDEX idx_monthly_fee (monthly_fee_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add foreign keys after table creation to avoid type incompatibility
ALTER TABLE offline_payment_submissions
  ADD CONSTRAINT fk_offline_payment_student
  FOREIGN KEY (student_id) REFERENCES students(id)
  ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE offline_payment_submissions
  ADD CONSTRAINT fk_offline_payment_monthly_fee
  FOREIGN KEY (monthly_fee_id) REFERENCES student_monthly_fees(id)
  ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE offline_payment_submissions
  ADD CONSTRAINT fk_offline_payment_reviewed_by
  FOREIGN KEY (reviewed_by) REFERENCES admin_users(id)
  ON DELETE SET NULL ON UPDATE RESTRICT;

ALTER TABLE offline_payment_submissions
  ADD CONSTRAINT fk_offline_payment_transaction
  FOREIGN KEY (payment_transaction_id) REFERENCES payment_transactions(id)
  ON DELETE SET NULL ON UPDATE RESTRICT;

-- Verification queries (run these after migration to verify)
-- SELECT * FROM payment_status WHERE id = 6;
-- SHOW CREATE TABLE offline_payment_submissions;
