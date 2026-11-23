# Admin Side — Processes & Code References

This document summarizes the admin-side processes implemented in this repository and points to the source files and endpoints involved.

**Overview**
- Purpose: document admin workflows (payment verification, tute approvals, student management, recording requests, class scheduling) and the frontend files that implement them.

**Common utilities used across admin pages**
- **API helper:** [src/lib/utils.ts](src/lib/utils.ts) — contains `apiFetch` used for all backend calls.
- **UI primitives:** shared components under `src/components/ui/*` (Card, Table, Dialog, Badge, Select, etc.).

**Payment Verifications**
- Flow: Admin loads transactions → filter/search → verify or reject a payment → server updates verification status.
- Frontend:
  - File: [src/pages/PaymentVerifications.tsx](src/pages/PaymentVerifications.tsx)
  - Key functions: `fetchPayments()` (calls `PaymentVerificationServlet`), `confirmVerify()` (POST action=verify), `confirmReject()` (POST action=reject), `exportToCSV()`.
- Related admin dashboard integration:
  - File: [src/pages/AdminDashboard.tsx](src/pages/AdminDashboard.tsx)
  - `fetchClassFeePayments()` calls same backend for dashboard summary and tab view.
- Backend endpoint: `PaymentVerificationServlet` (query and POST endpoints expected).

**Tute Approvals / Purchases**
- Flow: Students purchase tutes → admin reviews purchase/requests → admin approves/rejects requests.
- Frontend:
  - File: [src/pages/AdminDashboard.tsx](src/pages/AdminDashboard.tsx)
  - Functions: `fetchTuteApprovalRequests()`, `handleApproveTute()`, `handleRejectTute()` interacting with `TutesServlet?action=getTuteRequests` and `action=updateTuteRequestStatus`.
- Student purchase path (student-side): [src/pages/ClassMaterials.tsx](src/pages/ClassMaterials.tsx) uses `TutesPaymentServlet?action=initiatePayment` and `TutesRequestServlet?action=createRequest` to complete the flow.

**Student Management**
- Flow: List students, filter/search, activate/deactivate student accounts, view counts for recording requests, approve/reject recording requests.
- Frontend:
  - File: [src/pages/AdminStudentManagement.tsx](src/pages/AdminStudentManagement.tsx)
  - Key functions: `loadStudents()` (calls `StudentManagement?action=getAllStudents`), `loadRecordingRequests()`, `handleChangeStatus()` (POST to update student active flag), `handleUpdateRecordingStatus()` (POST to update recording request status).
- Backend endpoints referenced: `StudentManagement?action=getAllStudents`, `StudentManagement?action=getRecordingRequests`, `StudentManagement?action=updateStudentStatus`, `StudentManagement?action=updateRecordingRequestStatus`.

**Recording Requests & Recordings Management**
- Flow: Students request unlocking recordings; admin can approve requests which updates recording state and student counts.
- Frontend:
  - Student requests originate from [src/pages/ClassMaterials.tsx](src/pages/ClassMaterials.tsx) → `RecordingRequestServlet?action=createRequest`.
  - Admin management: [src/pages/AdminRecordingsManagement.tsx](src/pages/AdminRecordingsManagement.tsx) (see file for controls to approve/reject/manage recordings).

**Class Scheduling (Admin)**
- Flow: Admin creates/edits class schedule entries used by the timetable.
- Frontend: [src/pages/AdminDashboard.tsx](src/pages/AdminDashboard.tsx) (class scheduling tab)
- Backend endpoints: `ClassScheduling?action=getDays`, `ClassScheduling?action=getGrades`, `ClassScheduling?action=getAll`, `ClassScheduling?action=save`, `ClassScheduling?action=update`.

**Class Fee Payments (Tuition)**
- Flow: Students initiate tuition payments (student-side), admin verifies payments and unlocks content.
- Frontend (student): [src/pages/ClassFeePayment.tsx](src/pages/ClassFeePayment.tsx) — handles payment initiation and redirect to PayHere.
- Admin-side: [src/pages/AdminDashboard.tsx](src/pages/AdminDashboard.tsx) and [src/pages/PaymentVerifications.tsx](src/pages/PaymentVerifications.tsx) manage fee payment verification and show lists.
- Backend endpoints: `ClassFee?action=getFeeDetails`, `ClassFee?action=initiatePayment`, and `PaymentVerificationServlet` for verifying class fee payments.
- Notes: PayHere integration is used; required server-signed fields (e.g. `merchant_id`, `hash`) are expected from the backend.

**Exporting & Reports**
- Payment verifications support CSV export: implemented in `exportToCSV()` in [src/pages/PaymentVerifications.tsx](src/pages/PaymentVerifications.tsx).

**Admin Authentication / Access Control**
- Many admin pages check `localStorage.getItem('isAdminLoggedIn') === 'true'` and redirect to `/admin` if not logged in (see `useEffect()` checks in `PaymentVerifications.tsx`, `AdminDashboard.tsx`, `AdminStudentManagement.tsx`).
- Admin login page: [src/pages/AdminLogin.tsx](src/pages/AdminLogin.tsx)

**UI / UX details and patterns**
- Confirmation dialogs: implemented using `Dialog` component (verify/reject flows).
- Table usage: `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell` components across admin lists.
- Filtering and pagination: filters are implemented using `Select`, `Input` and date inputs; no server-side pagination in current front-end code (server endpoints should support it if needed).

**Where to look for server contract and payload examples**
- `PaymentVerificationServlet` responses: objects include `id`, `transactionId`, `studentId`, `studentName`, `amount`, `currency`, `paymentMethod`, `createdAt`, `verificationStatus`, `verificationDate`, `verifiedBy`, `verificationNotes`.
- `StudentProfileServlet` returns `student` object with flat fields such as `studentId`, `firstName`, `lastName`, `email`, `mobile`, `dateOfBirth`, `school`, `gradeName`, `monthlyFee`, `addressLine1`, `addressLine2`, `city`, `postalCode`, `province`.

**Next steps / recommendations**
- Add server-side API documentation (endpoints + expected request/response shapes) in the `docs/` folder next to this file.
- Consider centralizing admin auth checks into a wrapper/HOC so each page doesn't repeat the `localStorage` check.
- Add server pagination support for payments/students to avoid loading large lists into the client.

---
Generated from the codebase on 2026-05-23.
