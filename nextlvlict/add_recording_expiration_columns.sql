-- Migration script to add recording expiration tracking columns
-- This script adds columns to track when a recording was unlocked, if payment was made, and when it expires

ALTER TABLE recording_request ADD COLUMN unlocked_at TIMESTAMP NULL COMMENT 'Timestamp when the recording was unlocked/approved';

ALTER TABLE recording_request ADD COLUMN is_paid TINYINT(1) DEFAULT 0 COMMENT 'Whether payment was made for this recording (1=paid, 0=not paid)';

ALTER TABLE recording_request ADD COLUMN expires_at TIMESTAMP NULL COMMENT 'Timestamp when the recording access expires (48 hours after unlock if not paid)';
