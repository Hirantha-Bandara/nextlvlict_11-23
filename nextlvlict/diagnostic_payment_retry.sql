-- Diagnostic Query for Payment Retry Issue
-- This query identifies student_monthly_fees records that may be affected by the payment retry bug
-- Run this in READ-ONLY mode first to assess production data before any remediation

-- 1. Identify PENDING fees with transaction_id that may represent abandoned/cancelled payments
SELECT 
    id,
    student_id,
    grade_id,
    class_type_id,
    month_year,
    fee_amount,
    status_id,
    (SELECT value FROM payment_status WHERE id = status_id) as status_value,
    due_date,
    paid_date,
    transaction_id,
    created_at,
    updated_at,
    TIMESTAMPDIFF(MINUTE, updated_at, NOW()) as minutes_since_update
FROM student_monthly_fees
WHERE status_id = 1  -- PENDING
  AND transaction_id IS NOT NULL
  AND transaction_id != ''
ORDER BY updated_at DESC;

-- 2. Identify PENDING fees with old transaction_id (older than 30 minutes) that can be safely retried
SELECT 
    id,
    student_id,
    grade_id,
    class_type_id,
    month_year,
    fee_amount,
    status_id,
    (SELECT value FROM payment_status WHERE id = status_id) as status_value,
    due_date,
    paid_date,
    transaction_id,
    created_at,
    updated_at,
    TIMESTAMPDIFF(MINUTE, updated_at, NOW()) as minutes_since_update
FROM student_monthly_fees
WHERE status_id = 1  -- PENDING
  AND transaction_id IS NOT NULL
  AND transaction_id != ''
  AND TIMESTAMPDIFF(MINUTE, updated_at, NOW()) > 30
ORDER BY updated_at DESC;

-- 3. Check for any successful payments that might have been missed (payment_transactions but fee not PAID)
SELECT 
    pt.id as payment_id,
    pt.students_id,
    pt.transaction_id,
    pt.amount,
    pt.currency,
    pt.verification_status,
    pt.created_at as payment_created,
    smf.id as fee_id,
    smf.month_year,
    smf.fee_amount,
    smf.status_id,
    (SELECT value FROM payment_status WHERE id = smf.status_id) as fee_status,
    smf.transaction_id as fee_transaction_id
FROM payment_transactions pt
LEFT JOIN student_monthly_fees smf ON pt.transaction_id = smf.transaction_id
WHERE pt.verification_status = 'completed'
  AND (smf.status_id IS NULL OR smf.status_id != 2);  -- Fee not marked as PAID

-- 4. Count of fees by status
SELECT 
    ps.value as status,
    COUNT(*) as count
FROM student_monthly_fees smf
JOIN payment_status ps ON smf.status_id = ps.id
GROUP BY ps.value
ORDER BY count DESC;

-- 5. Students with multiple PENDING fees for the same month (potential data issues)
SELECT 
    student_id,
    month_year,
    COUNT(*) as pending_count,
    GROUP_CONCAT(id) as fee_ids,
    GROUP_CONCAT(transaction_id) as transaction_ids
FROM student_monthly_fees
WHERE status_id = 1
GROUP BY student_id, month_year
HAVING COUNT(*) > 1;

-- 6. Legacy remediation query (DO NOT RUN WITHOUT APPROVAL AND BACKUP)
-- This query would reset expired PENDING payments to allow retry
-- Uncomment and run only after review and approval
/*
UPDATE student_monthly_fees
SET transaction_id = NULL,
    updated_at = NOW()
WHERE status_id = 1  -- PENDING
  AND transaction_id IS NOT NULL
  AND transaction_id != ''
  AND TIMESTAMPDIFF(MINUTE, updated_at, NOW()) > 30;
*/
