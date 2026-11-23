# Monthly Fee Management Frontend Report

## Overview

This report documents the current frontend implementation of the Monthly Fee Management feature only. It covers the student payment page, student dashboard fee summary, admin payment verification screens, admin fee-definition management, public fee display, API usage, UI flows, navigation, and the frontend data flow that connects them.

The implementation is built with local React state and `useEffect`-driven fetching. The shared request layer is `apiFetch` in `src/lib/utils.ts`, which wraps axios and returns a Response-like object so existing `response.ok`, `response.json()`, and `response.text()` patterns still work.

## Folder Structure

### Pages

- `src/pages/ClassFeePayment.tsx` - main student monthly fee payment page
- `src/pages/Dashboard.tsx` - student dashboard fee summary and payment return handling
- `src/pages/PaymentVerifications.tsx` - dedicated admin payment verification page
- `src/pages/AdminDashboard.tsx` - admin dashboard tab that also lists class fee payments
- `src/pages/AdminClassFeeManagement.tsx` - admin class fee CRUD page
- `src/pages/ClassMaterials.tsx` - payment return fallback path that can process class fee returns
- `src/pages/Portfolio.tsx` - public landing page that renders the fee marketing section
- `src/pages/Index.tsx` - login route wrapper that redirects already-authenticated students to the dashboard

### Components

- `src/components/DashboardHeader.tsx` - student header and profile access
- `src/components/DashboardNav.tsx` - student navigation with payment route entry
- `src/components/StudentPortalLayout.tsx` - shared student page shell and mobile bottom nav
- `src/components/StudentProfile.tsx` - profile modal, including monthly fee display
- `src/components/AdminNavbar.tsx` - admin navigation with payment and fee-management routes
- `src/components/portfolio/ClassFees.tsx` - static public fee cards
- `src/components/portfolio/ScheduleFees.tsx` - public timetable section, not fee logic itself but part of the public monthly-fee context on the landing page

### Shared Utilities

- `src/lib/utils.ts` - `apiFetch` request wrapper used by all fee-related network calls
- `src/components/SessionGuard.tsx` - route protection for student and admin monthly-fee screens

## Components

### Student Payment Page

`src/pages/ClassFeePayment.tsx` is the core monthly-fee screen for students.

Purpose:
- Load the current monthly fee for the logged-in student
- Load payment history for receipt trail viewing
- Initiate payment for an unpaid fee row
- Handle PayHere return redirects
- Toggle between current fee view and payment history view

Displayed information:
- Grade label
- Month and year for the current billing cycle
- One card per fee item with class type, class type ID, amount, fee status, and due/paid date
- Payment history list with transaction ID, amount, payment method, verification status, and verification date

Buttons and actions:
- Current Fee / History toggle button
- Pay Fee button on unpaid entries
- Try Again buttons when fee data or fee records are empty

Navigation:
- Redirects to `/` if the student session is missing
- Uses `navigate('/')` for expired or invalid sessions

### Student Dashboard Monthly Fee Section

`src/pages/Dashboard.tsx` shows the monthly fee summary on the student dashboard.

Purpose:
- Show the current fee status at a glance
- Provide a direct route into payment
- Refresh dashboard state after a successful payment return

Displayed information:
- Current month or billing cycle label
- Fee amount
- Fee status badge
- Due date when available

Buttons and actions:
- Pay now or View receipt button from the fee card
- Pay Fees quick action
- Mobile bottom bar Pay button via shared layout behavior

Navigation:
- Main entry from login
- Routes to `/payment`

### Admin Payment Verification Screen

`src/pages/PaymentVerifications.tsx` is the dedicated admin review screen.

Purpose:
- List fee payment records for manual review
- Filter payment records by status and student ID
- Verify or reject a payment
- Export the list to CSV

Displayed information:
- Transaction ID
- Student name and student ID
- Amount
- Payment method
- Created date and time
- Verification status

Buttons and actions:
- Export CSV
- Clear Filters
- Verify
- Reject
- Refresh
- View button placeholder in the current implementation

Navigation:
- Admin-only route under the admin path
- Redirects to the admin login route if the admin session is missing

### Admin Dashboard Payment Tab

`src/pages/AdminDashboard.tsx` contains a class fee payments tab that duplicates the admin list-view pattern inside the dashboard workspace.

Purpose:
- Show class fee payment records in the admin workspace
- Provide quick access to the payment-verification area
- Export payment records to CSV

Displayed information:
- Payment table with transaction ID, student, amount, payment method, created date, and verification status
- Summary card showing pending payment count

Buttons and actions:
- Export CSV
- Refresh
- Tab switching

Navigation:
- Uses `useSearchParams` to support tab selection through the URL
- Navigation cards link to payment verification and other admin areas

### Admin Class Fee Management

`src/pages/AdminClassFeeManagement.tsx` manages the class fee definitions themselves.

Purpose:
- Create, update, delete, and activate/deactivate class fee records
- Load OL/AL type options for classification

Displayed information:
- Fee definition table
- Summary cards for total, active, inactive, and average fee
- Create/edit dialog
- Delete confirmation dialog

Buttons and actions:
- Add Class Fee
- Edit
- Delete
- Toggle active state
- Refresh

Navigation:
- Admin-only route
- Back button to the admin dashboard

### Public Fee Section

`src/components/portfolio/ClassFees.tsx` is the public marketing section for monthly fees.

Purpose:
- Display static fee examples for the landing page
- Inform visitors that fees are payable monthly in advance

Displayed information:
- Grade name
- Monthly fee amount
- Fee description
- Important information note

Buttons and actions:
- None; display only

### Shared Student Profile Modal

`src/components/StudentProfile.tsx` includes monthly fee in the grade information section.

Purpose:
- Show the student profile data loaded from the backend
- Surface the student’s monthly fee value when present

Displayed information:
- Grade name
- Monthly fee
- Personal information
- Address information

Buttons and actions:
- Edit profile controls
- Save
- Close

## API Calls

### LoginServlet

- Endpoint: `LoginServlet`
- Method: `POST`
- Request payload: JSON with `mobile` and `password`
- Response payload: student login response containing student identity fields
- Called from: `src/components/LoginForm.tsx`
- Used by: student login form

### StudentProfileServlet

- Endpoint: `StudentProfileServlet`
- Method: `POST`
- Request payload: JSON with `studentId`
- Response payload: `success` plus `student` object; student data may include `gradeName` and `monthlyFee`
- Called from: `src/components/SessionGuard.tsx`, `src/components/DashboardHeader.tsx`, `src/components/StudentProfile.tsx`, `src/pages/ClassMaterials.tsx`
- Used by: session guard, dashboard header, student profile modal, and payment-profile preparation for tute purchases

### DashboardServlet

- Endpoint: `DashboardServlet?studentId=...`
- Method: `GET`
- Request payload: query string only
- Response payload: `success`, `stats`, `upcomingClasses`, `paymentStatus`
- Called from: `src/pages/Dashboard.tsx`
- Used by: dashboard monthly fee summary

### ClassFee?action=getFeeDetails

- Endpoint: `ClassFee?action=getFeeDetails&studentId=...`
- Method: `GET`
- Request payload: query string only
- Response payload: `success` and `feeDetails` with `grade`, `currency`, `monthYear`, and `fees[]`
- Called from: `src/pages/ClassFeePayment.tsx`
- Used by: student monthly fee page

### PaymentHistoryServlet

- Endpoint: `PaymentHistoryServlet?studentId=...`
- Method: `GET`
- Request payload: query string only
- Response payload: `success`, `payments[]`, `totalPayments`
- Called from: `src/pages/ClassFeePayment.tsx`
- Used by: student payment history section

### ClassFee?action=initiatePayment

- Endpoint: `ClassFee?action=initiatePayment&studentId=...&feeId=...`
- Method: `GET`
- Request payload: query string only
- Response payload: `success` and `paymentData`
- Called from: `src/pages/ClassFeePayment.tsx`
- Used by: Pay button on the student payment page

### ClassFee?action=paymentReturn

- Endpoint: `ClassFee?action=paymentReturn&studentId=...&order_id=...`
- Method: `GET`
- Request payload: query string only
- Response payload: frontend checks `success` and `message`
- Called from: `src/pages/Dashboard.tsx`, `src/pages/ClassFeePayment.tsx`, `src/pages/ClassMaterials.tsx`
- Used by: payment return handling after PayHere redirect

### PaymentVerificationServlet

- Endpoint: `PaymentVerificationServlet`
- Method: `GET` and `POST`
- Request payload: GET filters through `URLSearchParams`; POST form-encoded bodies for verify and reject actions
- Response payload: `success` and `payments[]` for GET, action result for POST
- Called from: `src/pages/PaymentVerifications.tsx`, `src/pages/AdminDashboard.tsx`
- Used by: admin verification screens

### ClassFeeManagement

- Endpoint: `ClassFeeManagement?action=getAll`
- Method: `GET`
- Request payload: query string only
- Response payload: JSON array of fee definitions
- Called from: `src/pages/AdminClassFeeManagement.tsx`
- Used by: admin fee-definition table

- Endpoint: `ClassFeeManagement?action=getOlAlTypes`
- Method: `GET`
- Request payload: query string only
- Response payload: JSON array of OL/AL types
- Called from: `src/pages/AdminClassFeeManagement.tsx`
- Used by: fee type dropdowns

- Endpoint: `ClassFeeManagement`
- Method: `POST`
- Request payload: form-encoded `action=save` or `action=update` with fee fields
- Response payload: success text or `error`
- Called from: `src/pages/AdminClassFeeManagement.tsx`
- Used by: create/edit and active-state update flows

- Endpoint: `ClassFeeManagement`
- Method: `POST`
- Request payload: form-encoded `action=delete` and `id`
- Response payload: success text or `error`
- Called from: `src/pages/AdminClassFeeManagement.tsx`
- Used by: delete flow

### StudentManagement?action=getAllStudents and update actions

- Endpoint: `StudentManagement?action=getAllStudents&...`
- Method: `GET`
- Request payload: query string filters for search, grade, and status
- Response payload: student array including `paymentStatus`
- Called from: `src/pages/AdminStudentManagement.tsx`
- Used by: adjacent payment-status display in the student roster

## State Flow

The monthly-fee feature is driven by local component state.

- Login state begins in localStorage and is verified by `SessionGuard`
- The student dashboard stores `stats`, `upcomingClasses`, and `paymentStatus`
- The payment page stores `feeDetails`, `paymentHistory`, and UI flags such as `showHistory` and `processing`
- The admin verification screen stores the payment list, filters, selected payment, and dialog state
- The admin fee-management screen stores the fee list, OL/AL types, dialog state, and form state

Observed state transitions:

- Payment page mount -> fetch fee details -> fetch history
- Payment page payment return -> backend confirmation call -> toast success -> clear URL query string
- Dashboard payment return -> backend confirmation call -> dashboard refresh
- Admin verify/reject -> POST action -> refetch payment list
- Admin fee CRUD -> POST action -> refetch fee definitions

### React Hook Form usage

React Hook Form is not used in any monthly-fee screen. Forms in this feature are implemented with plain controlled inputs and local state.

### TanStack Query usage

TanStack Query is not used in the monthly-fee feature screens, even though the app root provides `QueryClientProvider`.

### Axios usage

All monthly-fee network requests use `apiFetch`, which internally uses axios and returns a Response-like object.

### URLSearchParams usage

`URLSearchParams` is used for three different tasks in the monthly-fee feature:

- Reading `action` and `order_id` from payment-return URLs
- Building query strings for admin verification filters
- Building form-encoded POST bodies for admin verify/reject and fee-management actions

## UI Flow

### Student Monthly Fee Page

1. The page loads with a session check from localStorage.
2. If authenticated, it fetches current fee details and payment history.
3. The current fee view shows the month, fee rows, amount, and due/paid status.
4. Unpaid rows display a pay button that starts the PayHere initiation flow.
5. The history toggle switches to the payment history list.
6. Empty or failed states show retry affordances.

### Student Dashboard Fee Summary

1. The dashboard loads a payment-status summary alongside class and recording stats.
2. The fee card shows the current amount and status.
3. The main fee CTA routes to the payment page.
4. When a payment return is detected, the dashboard confirms the return and refreshes the summary.

### Admin Payment Verification

1. The screen loads all payment records or a filtered subset.
2. The admin can filter by status and student ID.
3. Pending payments expose verify and reject actions.
4. Confirming either action updates the backend and refreshes the list.
5. The CSV export uses the currently loaded list.

### Admin Class Fee Management

1. The page loads fee definitions and OL/AL types.
2. The table shows active/inactive fee definitions.
3. The admin can create or edit a fee through a dialog.
4. The admin can toggle status or delete a fee.
5. After each mutation, the table is refreshed.

### Public Landing Page Fee Section

1. The portfolio page renders a static class-fee section.
2. It displays a fixed set of sample monthly fees.
3. It informs visitors that fees are payable monthly in advance.
4. No interactive payment behavior is attached to this section.

## Navigation Flow

### Student Path

Login -> Dashboard -> Monthly Fee page -> Pay button -> PayHere -> return to app -> dashboard refresh or payment page confirmation.

### Admin Path

Admin login -> Admin dashboard -> Payment verifications or Class fee management -> verify/reject or CRUD fee definitions.

### Public Path

Portfolio page -> Class fees section.

## Payment Flow

### Complete Frontend Sequence

1. Student logs in from the login page.
2. Successful login stores the student identity and routes to the dashboard.
3. The dashboard loads the current fee summary.
4. The student opens the monthly fee page at `/payment`.
5. The page fetches the fee details and payment history.
6. The student clicks Pay on an unpaid fee row.
7. The frontend calls the initiation endpoint and receives `paymentData`.
8. The frontend validates the required PayHere fields.
9. The frontend creates a hidden form and posts it to PayHere.
10. The student completes payment on PayHere.
11. PayHere redirects back with `action=paymentReturn` and `order_id`.
12. The frontend confirms the return with the backend.
13. The UI shows success and the URL query string is cleared.
14. On the dashboard path, the payment summary refreshes.

### Payment Gateway Handling

The frontend does not implement the payment gateway itself. It only prepares the payload returned by the backend and submits it to PayHere through a dynamically created HTML form.

## Monthly Fee Flow

### Student View

- Dashboard shows a fee status card with amount and due date
- Payment page shows the current fee details and per-class-type rows
- Payment history shows previous payments and verification status

### Admin View

- Payment verifications page shows operational review data
- Admin dashboard tab shows the same payment records in the workspace layout
- Class fee management page controls the fee definitions that drive the student-side amount display

### Public View

- Landing page shows static monthly fee examples and a note that fees are monthly in advance

## Files Involved

### Core Monthly Fee Files

- `src/pages/ClassFeePayment.tsx`
- `src/pages/Dashboard.tsx`
- `src/pages/PaymentVerifications.tsx`
- `src/pages/AdminDashboard.tsx`
- `src/pages/AdminClassFeeManagement.tsx`
- `src/pages/ClassMaterials.tsx`
- `src/pages/Portfolio.tsx`
- `src/components/portfolio/ClassFees.tsx`

### Supporting Files

- `src/App.tsx`
- `src/lib/utils.ts`
- `src/components/DashboardHeader.tsx`
- `src/components/DashboardNav.tsx`
- `src/components/StudentPortalLayout.tsx`
- `src/components/StudentProfile.tsx`
- `src/components/AdminNavbar.tsx`
- `src/components/LoginForm.tsx`
- `src/components/SessionGuard.tsx`
- `src/pages/Index.tsx`
- `src/pages/AdminStudentManagement.tsx`

## Files That Would Need Modification If the Monthly Fee Architecture Changes

If the monthly-fee architecture changes, these files are the main coupling points:

- `src/pages/ClassFeePayment.tsx`
- `src/pages/Dashboard.tsx`
- `src/pages/PaymentVerifications.tsx`
- `src/pages/AdminDashboard.tsx`
- `src/pages/AdminClassFeeManagement.tsx`
- `src/pages/ClassMaterials.tsx`
- `src/components/StudentProfile.tsx`
- `src/components/DashboardHeader.tsx`
- `src/components/DashboardNav.tsx`
- `src/components/StudentPortalLayout.tsx`
- `src/components/AdminNavbar.tsx`
- `src/pages/Portfolio.tsx`
- `src/components/portfolio/ClassFees.tsx`
- `src/lib/utils.ts`
- `src/App.tsx`

These files define the current frontend contract for routes, data loading, payment initiation, payment return handling, admin verification, and fee-definition editing.