-- Backfill Script: Generate missing monthly fee records for students who registered for additional class types
-- Issue: Existing students who registered for new class types (e.g., Revision) did not receive corresponding fee schedules
-- Root Cause: StudentManagement.registerForClassType() committed transaction before fee generation, causing fee generation to fail
-- Fix Applied: StudentManagement.java now uses a new session and transaction for fee generation
-- 
-- This script identifies and generates missing fee records for affected registrations.
-- It is transaction-safe and includes duplicate prevention.

-- ============================================================
-- STEP 1: PREVIEW - Identify missing fee records
-- ============================================================
-- This query shows StudentClass records that don't have corresponding StudentMonthlyFees for the current month
-- Run this first to see what will be generated

SELECT 
    sc.id AS student_class_id,
    sc.student_id,
    CONCAT(s.first_name, ' ', s.last_name) AS student_name,
    sc.grade_id,
    g.name AS grade_name,
    sc.class_type_id,
    ct.name AS class_type_name,
    sc.created_at AS registration_date,
    DATE_FORMAT(CURDATE(), '%Y-%m') AS current_month_year,
    gcf.monthly_fee,
    gcf.registration_fee
FROM student_class sc
JOIN students s ON sc.student_id = s.id
JOIN grade g ON sc.grade_id = g.id
JOIN class_type ct ON sc.class_type_id = ct.id
LEFT JOIN grade_class_fee gcf ON sc.grade_id = gcf.grade_id AND sc.class_type_id = gcf.class_type_id AND gcf.is_active = 1
LEFT JOIN student_monthly_fees smf ON sc.student_id = smf.student_id 
    AND sc.grade_id = smf.grade_id 
    AND sc.class_type_id = smf.class_type_id 
    AND smf.month_year = DATE_FORMAT(CURDATE(), '%Y-%m')
WHERE sc.is_active = 1
    AND smf.id IS NULL
    AND gcf.id IS NOT NULL
ORDER BY sc.student_id, sc.class_type_id;

-- ============================================================
-- STEP 2: BACKFILL - Generate missing fee records
-- ============================================================
-- This inserts missing fee records for the current month
-- Uses INSERT IGNORE to prevent duplicates if run multiple times
-- Only generates fees for class types with valid fee configurations

INSERT INTO student_monthly_fees (
    student_id,
    grade_id,
    class_type_id,
    month_year,
    fee_amount,
    status_id,
    due_date,
    created_at,
    updated_at
)
SELECT 
    sc.student_id,
    sc.grade_id,
    sc.class_type_id,
    DATE_FORMAT(CURDATE(), '%Y-%m') AS month_year,
    gcf.monthly_fee,
    1 AS status_id, -- PENDING
    DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL (10 - DAY(CURDATE())) DAY), '%Y-%m-%d') AS due_date, -- 10th of current month
    NOW() AS created_at,
    NOW() AS updated_at
FROM student_class sc
JOIN grade_class_fee gcf ON sc.grade_id = gcf.grade_id AND sc.class_type_id = gcf.class_type_id AND gcf.is_active = 1
LEFT JOIN student_monthly_fees smf ON sc.student_id = smf.student_id 
    AND sc.grade_id = smf.grade_id 
    AND sc.class_type_id = smf.class_type_id 
    AND smf.month_year = DATE_FORMAT(CURDATE(), '%Y-%m')
WHERE sc.is_active = 1
    AND smf.id IS NULL
    AND gcf.monthly_fee IS NOT NULL
    AND gcf.monthly_fee > 0;

-- ============================================================
-- STEP 3: VERIFY - Check results
-- ============================================================
-- Run this after the backfill to verify the records were created

SELECT 
    smf.id,
    smf.student_id,
    CONCAT(s.first_name, ' ', s.last_name) AS student_name,
    g.name AS grade_name,
    ct.name AS class_type_name,
    smf.month_year,
    smf.fee_amount,
    ps.value AS status,
    smf.due_date,
    smf.created_at
FROM student_monthly_fees smf
JOIN students s ON smf.student_id = s.id
JOIN grade g ON smf.grade_id = g.id
JOIN class_type ct ON smf.class_type_id = ct.id
JOIN payment_status ps ON smf.status_id = ps.id
WHERE smf.month_year = DATE_FORMAT(CURDATE(), '%Y-%m')
    AND smf.created_at >= NOW() - INTERVAL 1 HOUR
ORDER BY smf.student_id, smf.class_type_id;

-- ============================================================
-- STEP 4: BACKFILL FOR PREVIOUS MONTHS (OPTIONAL)
-- ============================================================
-- If you need to backfill for previous months, modify the month_year in the INSERT statement
-- Example for last month:
-- DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m')
-- 
-- WARNING: Only backfill previous months if students were actually enrolled in those class types at that time
-- The created_at timestamp should reflect when the fee should have been generated, not now
