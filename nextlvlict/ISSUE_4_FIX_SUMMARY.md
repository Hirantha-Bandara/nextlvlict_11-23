# Issue 4 Fix Summary - Payment Retry Implementation

## Problem Statement
A cancelled payment prevents the student from retrying payment. When a student cancels or abandons a payment at the PayHere gateway, the fee record retains the transaction_id in PENDING state, blocking subsequent payment attempts.

## Root Cause
**Location:** `ClassFee.java` lines 276-284 (original code)

The payment initiation logic checked if `transaction_id` was set and status was PENDING, then blocked retry without considering:
- Whether the payment was cancelled by the user
- Whether the payment attempt had expired
- Whether the payment failed at the gateway

The `paymentCancel` handler only returned a generic message without updating the database state.

## Solution Implemented

### 1. Database Schema Changes
**File:** `nextlvlict_sp.sql` (line 396)
- Added CANCELLED status (ID=5) to payment_status table
**Migration file:** `add_cancelled_payment_status.sql`

### 2. Backend Changes

#### PaymentStatus.java
- Added CANCELLED constant (ID=5)

#### ClassFee.java
**Changes:**
1. **Enhanced retry logic (lines 274-297):**
   - Allow retry if status is CANCELLED or FAILED
   - Allow retry if PENDING with expired transaction_id (>30 minutes old)
   - Block retry if already PAID
   - Block retry if PENDING and not expired

2. **Status reset on retry (lines 308-327):**
   - Reset status to PENDING when retrying after CANCELLED or FAILED
   - Generate new transaction_id for each retry

3. **PayHere callback handling (lines 504-533):**
   - Handle failed/cancelled payments from PayHere (status codes 0, -1, -2, -3)
   - Update fee status to CANCELLED on gateway cancellation
   - Log failed/cancelled payments in payment_transactions table

4. **Payment cancel handler (lines 538-589):**
   - New `handlePaymentCancel` method to handle browser redirect cancellation
   - Update fee status to CANCELLED when user cancels at gateway
   - Verify student ownership before updating

5. **Cancel URL enhancement (line 363):**
   - Include order_id in cancel_url parameter for proper identification

6. **Helper methods (lines 731-767):**
   - Enhanced `logFailedPayment` to include student reference
   - New `isPaymentExpired` method to check payment age

### 3. Frontend Changes

#### ClassFeePayment.tsx
**Changes:**
1. **New handlePaymentCancel function (lines 159-183):**
   - Calls backend paymentCancel endpoint
   - Shows informative toast message
   - Refreshes fee data after cancellation

2. **Enhanced useEffect (lines 88-92):**
   - Added paymentCancel action handler
   - Processes cancellation from browser redirect

## Exact Files Changed

1. **nextlvlict_sp.sql** - Added CANCELLED status to payment_status table
2. **nextlvlict/src/main/java/com/nextlvlict/nextlvlict/hibernate/PaymentStatus.java** - Added CANCELLED constant
3. **nextlvlict/src/main/java/com/nextlvlict/nextlvlict/controller/ClassFee.java** - Core payment retry logic
4. **scholar-access-zone/src/pages/ClassFeePayment.tsx** - Frontend cancellation handling

## Schema Migration

**Required migration:** `add_cancelled_payment_status.sql`

**Why required:** The CANCELLED status is essential for proper payment lifecycle management. Without it, cancelled payments cannot be distinguished from pending payments, preventing safe retry logic.

**Migration steps:**
1. Backup production database
2. Run `add_cancelled_payment_status.sql` in production
3. Verify: `SELECT * FROM payment_status WHERE id = 5;` should return CANCELLED

## Duplicate Payment Protection

### Existing Protections (Preserved)
1. **Pessimistic locking** on fee record during payment initiation (line 258)
2. **MD5 signature verification** in PayHere callback (lines 407-418)
3. **Idempotent callback processing** - checks for existing payment_transactions (lines 425-436)
4. **Student ownership verification** before payment initiation (line 271)
5. **Amount validation** against stored fee amount (line 300)

### New Protections Added
1. **Payment expiry check** - PENDING payments older than 30 minutes can be retried
2. **Status-based retry control** - Only CANCELLED, FAILED, or expired PENDING can be retried
3. **PAID status lock** - Already paid fees cannot be charged again
4. **Failed payment logging** - All failed/cancelled attempts are logged in payment_transactions

### Race Condition Handling
- Pessimistic locking prevents simultaneous payment initiations
- Callback is idempotent - duplicate notifications are ignored
- If gateway notifies success after retry begins, the idempotent check prevents double payment

## Diagnostic Query for Legacy Records

**File:** `diagnostic_payment_retry.sql`

**Queries provided:**
1. Identify all PENDING fees with transaction_id
2. Identify expired PENDING fees (>30 min old) eligible for retry
3. Check for successful payments not marked as PAID (data reconciliation)
4. Count of fees by status
5. Students with multiple PENDING fees for same month

**Safe remediation (requires approval):**
- The commented UPDATE query in the diagnostic file can reset expired PENDING transaction_ids
- **DO NOT RUN** without:
  - Full database backup
  - Review of diagnostic results
  - Management approval
  - Testing in staging environment

## Deployment Steps

### Pre-Deployment
1. **Backup production database**
2. **Run diagnostic query** on production to assess affected records
3. **Review diagnostic results** with stakeholders
4. **Test in staging environment** with PayHere sandbox

### Deployment
1. **Deploy database migration:**
   ```bash
   mysql -u username -p nextlvlict_sp < add_cancelled_payment_status.sql
   ```

2. **Deploy backend changes:**
   - Build WAR file
   - Stop Tomcat
   - Deploy new WAR
   - Start Tomcat

3. **Deploy frontend changes:**
   - Build React application
   - Deploy to CDN/web server

4. **Verify deployment:**
   - Check Tomcat logs for startup errors
   - Verify payment_status table has CANCELLED entry
   - Test payment flow in sandbox

### Post-Deployment
1. **Monitor logs** for payment-related errors
2. **Test payment scenarios** (see Testing section below)
3. **Run diagnostic query** after 24 hours to verify no data issues

## Rollback Plan

### If Backend Issues Detected
1. **Stop Tomcat**
2. **Restore previous WAR file**
3. **Start Tomcat**
4. **Verify system functionality**

### If Database Issues Detected
1. **Restore database from backup**
2. **Re-deploy previous backend version**

### If Frontend Issues Detected
1. **Revert to previous React build**
2. **Clear CDN cache**

### Rollback Verification
- Test payment initiation
- Verify existing paid fees remain paid
- Check that no data corruption occurred

## Testing Scenarios

### Required Testing (PayHere Sandbox)

1. **Initial successful monthly fee payment**
   - Initiate payment
   - Complete at PayHere
   - Verify fee marked PAID
   - Verify payment_transactions entry created

2. **Student cancels payment and retries**
   - Initiate payment
   - Cancel at PayHere
   - Verify fee status CANCELLED
   - Retry payment
   - Complete at PayHere
   - Verify fee marked PAID

3. **Student receives failed payment and retries**
   - Initiate payment
   - Simulate failure (use test card that fails)
   - Verify fee status CANCELLED
   - Retry payment
   - Complete at PayHere
   - Verify fee marked PAID

4. **Student closes browser while payment pending**
   - Initiate payment
   - Close browser during payment
   - Wait 31 minutes
   - Retry payment
   - Complete at PayHere
   - Verify fee marked PAID

5. **Gateway success notification arrives after browser return fails**
   - Initiate payment
   - Block notify_url temporarily
   - Complete payment at PayHere
   - Browser return fails
   - Unblock notify_url
   - Verify callback processes payment
   - Verify fee marked PAID

6. **Duplicate gateway notification**
   - Initiate payment
   - Complete at PayHere
   - Replay notification manually
   - Verify idempotency (no duplicate payment)

7. **Previous attempt succeeds just before retry**
   - Initiate payment
   - Complete at PayHere
   - Immediately retry before callback processes
   - Verify retry blocked (fee already paid)

8. **Two simultaneous payment initiation requests**
   - Send two initiatePayment requests simultaneously
   - Verify one succeeds, one fails with "already in progress"

9. **Incorrect signature/hash**
   - Simulate invalid MD5 signature in callback
   - Verify payment rejected

10. **Already-paid monthly fee cannot be charged again**
    - Pay a fee
    - Attempt to pay again
    - Verify blocked with "already paid" message

11. **Legacy fee row has stale transaction_id**
    - Manually set a PENDING fee with old transaction_id
    - Wait 31 minutes
    - Retry payment
    - Verify new transaction_id generated and payment succeeds

12. **Regression checks**
    - Test individual recording payment
    - Test recording bundle purchase
    - Verify no impact on existing flows

### Test Results Template
- [ ] Scenario 1: Initial successful payment - PASS/FAIL
- [ ] Scenario 2: Cancel and retry - PASS/FAIL
- [ ] Scenario 3: Failed payment and retry - PASS/FAIL
- [ ] Scenario 4: Browser close and retry - PASS/FAIL
- [ ] Scenario 5: Delayed callback - PASS/FAIL
- [ ] Scenario 6: Duplicate notification - PASS/FAIL
- [ ] Scenario 7: Race condition - PASS/FAIL
- [ ] Scenario 8: Simultaneous initiation - PASS/FAIL
- [ ] Scenario 9: Invalid signature - PASS/FAIL
- [ ] Scenario 10: Already paid retry - PASS/FAIL
- [ ] Scenario 11: Legacy stale transaction_id - PASS/FAIL
- [ ] Scenario 12: Recording payment regression - PASS/FAIL
- [ ] Scenario 13: Bundle payment regression - PASS/FAIL

## Important Notes

1. **Do not perform real production payments during testing** - Use PayHere sandbox only
2. **Preserve audit trail** - All payment attempts are logged in payment_transactions
3. **No data deletion** - The fix does not delete any historical data
4. **Backward compatible** - Existing PENDING records will work with expiry logic
5. **Minimal changes** - Only modified payment retry logic, no changes to class registration or fee calculation

## Status
- ✅ Root cause identified
- ✅ Solution designed
- ✅ Implementation complete
- ⏳ Testing required (PayHere sandbox)
- ⏳ Production deployment pending
