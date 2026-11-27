# Test Plan for Issue 3: Fee Scheduling for New Class Types

## Test Scenarios

### Scenario 1: New Student Registering for Theory (Baseline)
**Purpose:** Verify existing functionality still works

**Steps:**
1. Register a new student via frontend registration form
2. Select Grade 11 Theory class type
3. Complete registration
4. Check database for:
   - `students` table: New student record
   - `student_class` table: StudentClass record for Theory
   - `student_monthly_fees` table: Monthly fee record for current month with correct amount from `grade_class_fee`

**Expected Result:**
- Student created successfully
- StudentClass record created with class_type_id = 1 (Theory)
- StudentMonthlyFees record created with:
  - Correct fee amount from grade_class_fee.monthly_fee
  - Status = PENDING
  - Due date = 10th of current month
  - month_year = current month (YYYY-MM)

---

### Scenario 2: Existing Grade 11 Theory Student Registering for Revision
**Purpose:** Verify the fix for the reported issue

**Steps:**
1. Identify an existing student registered for Grade 11 Theory (class_type_id = 1)
2. Via StudentProfile page, register for Grade 11 Revision (class_type_id = 2)
3. Call `StudentManagement?action=registerForClassType` with studentId and classTypeId
4. Check database for:
   - `student_class` table: New StudentClass record for Revision
   - `student_monthly_fees` table: New monthly fee record for Revision class type

**Expected Result:**
- StudentClass record created successfully for Revision
- StudentMonthlyFees record created with:
  - class_type_id = 2 (Revision)
  - Correct fee amount from grade_class_fee for grade_id + class_type_id combination
  - Status = PENDING
  - Due date = 10th of current month
  - month_year = current month (YYYY-MM)
- Original Theory fee record remains unchanged
- No duplicate fee records for Theory

**Database Verification Query:**
```sql
SELECT * FROM student_monthly_fees 
WHERE student_id = '<student_id>' 
AND month_year = DATE_FORMAT(CURDATE(), '%Y-%m')
ORDER BY class_type_id;
```
Should return 2 records (one for Theory, one for Revision).

---

### Scenario 3: Existing Student Registering for Another Supported Class Type
**Purpose:** Verify dynamic class type support

**Steps:**
1. Add a new class type to `class_type` table (e.g., id=3, name='Practical')
2. Configure fee in `grade_class_fee` for the student's grade and new class type
3. Register existing student for the new class type
4. Verify fee generation

**Expected Result:**
- StudentClass record created for new class type
- StudentMonthlyFees record created with correct fee from `grade_class_fee`
- No hardcoded class type assumptions in code

---

### Scenario 4: Repeated Submission of Same Registration
**Purpose:** Verify duplicate prevention

**Steps:**
1. Register a student for a class type
2. Immediately attempt to register for the same class type again
3. Check response and database

**Expected Result:**
- Second registration returns error: "Already registered for this class type"
- No duplicate StudentClass records
- No duplicate StudentMonthlyFees records

---

### Scenario 5: Registration with Missing Fee Configuration
**Purpose:** Verify error handling for invalid configuration

**Steps:**
1. Add a new class type without corresponding `grade_class_fee` entry
2. Attempt to register a student for this class type
3. Check response and database

**Expected Result:**
- StudentClass record created (registration succeeds)
- Fee generation fails gracefully with error logged
- No StudentMonthlyFees record created
- Student can still access the system
- Error message in logs: "No fee configuration found for grade: X and class type: Y"

---

### Scenario 6: Registration Database Failure
**Purpose:** Verify transaction rollback

**Steps:**
1. Simulate database failure during StudentClass insert (e.g., violate constraint)
2. Attempt registration
3. Check database state

**Expected Result:**
- Transaction rolled back
- No StudentClass record created
- No StudentMonthlyFees record created
- Error returned to frontend

---

### Scenario 7: Fee Scheduling Database Failure
**Purpose:** Verify registration succeeds even if fee generation fails

**Steps:**
1. Simulate database failure during fee generation (e.g., lock table)
2. Attempt registration
3. Check database state

**Expected Result:**
- StudentClass record created successfully
- Fee generation fails with error logged
- Registration returns success to user
- Student can retry fee generation via scheduled job or manual trigger

---

### Scenario 8: Existing Paid Monthly Fees Remain Unchanged
**Purpose:** Verify existing payments are not affected

**Steps:**
1. Identify a student with paid monthly fees (status_id = 2)
2. Register for additional class type
3. Verify existing fee records

**Expected Result:**
- Existing paid fee records unchanged
- New fee record created for new class type only
- No modification to paid_date, transaction_id, or status of existing records

---

### Scenario 9: Student Registering for Multiple Classes with Different Fee Amounts
**Purpose:** Verify correct fee amounts per class type

**Steps:**
1. Register student for Theory (fee: 1000)
2. Register same student for Revision (fee: 1200)
3. Check fee amounts in database

**Expected Result:**
- Two StudentMonthlyFees records
- Theory record: fee_amount = 1000
- Revision record: fee_amount = 1200
- Both from `grade_class_fee` table, not hardcoded

---

### Scenario 10: Existing Fee Scheduling for Theory Continuing to Work
**Purpose:** Verify monthly scheduler still works

**Steps:**
1. Wait for monthly scheduler to run (1st of month)
2. Check that all active students receive fee records for all their registered class types
3. Verify fees include both Theory and Revision for students registered for both

**Expected Result:**
- Scheduler generates fees for all StudentClass records
- Each class type gets its own fee record
- Fee amounts from `grade_class_fee`
- No hardcoded Theory-only logic

---

## Manual Testing Commands

### Check Student Class Registrations
```sql
SELECT sc.id, sc.student_id, CONCAT(s.first_name, ' ', s.last_name) AS student_name,
       g.name AS grade, ct.name AS class_type, sc.created_at
FROM student_class sc
JOIN students s ON sc.student_id = s.id
JOIN grade g ON sc.grade_id = g.id
JOIN class_type ct ON sc.class_type_id = ct.id
WHERE sc.is_active = 1
ORDER BY sc.student_id, sc.class_type_id;
```

### Check Monthly Fees for a Student
```sql
SELECT smf.id, smf.student_id, g.name AS grade, ct.name AS class_type,
       smf.month_year, smf.fee_amount, ps.value AS status,
       smf.due_date, smf.paid_date
FROM student_monthly_fees smf
JOIN grade g ON smf.grade_id = g.id
JOIN class_type ct ON smf.class_type_id = ct.id
JOIN payment_status ps ON smf.status_id = ps.id
WHERE smf.student_id = '<student_id>'
ORDER BY smf.month_year, smf.class_type_id;
```

### Verify Fee Configuration
```sql
SELECT gcf.id, g.name AS grade, ct.name AS class_type,
       gcf.monthly_fee, gcf.registration_fee, gcf.is_active
FROM grade_class_fee gcf
JOIN grade g ON gcf.grade_id = g.id
JOIN class_type ct ON gcf.class_type_id = ct.id
WHERE gcf.is_active = 1
ORDER BY g.name, ct.name;
```

---

## Automated Test Recommendations

Create unit tests for `MonthlyFeeGenerationService`:

1. `testGenerateMonthlyFeesForNewClassTypeRegistration`
   - Mock session with StudentClass records
   - Verify fee records created for all class types
   - Verify correct fee amounts

2. `testFeeGenerationWithMissingConfiguration`
   - Mock session without grade_class_fee
   - Verify graceful error handling

3. `testDuplicateFeePrevention`
   - Attempt to generate fees twice for same student/month/class_type
   - Verify only one record created

4. `testTransactionRollbackOnFailure`
   - Simulate database error during fee generation
   - Verify no partial records created
