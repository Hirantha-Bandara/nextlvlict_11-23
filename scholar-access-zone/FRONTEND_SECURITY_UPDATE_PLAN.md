# Frontend Security Compatibility Update Plan

## Scope and constraints

This plan aligns the React + TypeScript client with the completed backend security work described in `SECURITY_IMPLEMENTATION_SUMMARY.md`. It keeps the existing screens, routes, business actions, endpoint names, and request payload formats unchanged. Changes will be limited to authentication/session state, API plumbing, response DTO types, security-status handling, and environment configuration.

The backend remains session-cookie based. The client must therefore never try to read, persist, or construct `JSESSIONID`; the HttpOnly cookie is owned by the browser and is sent only by credentialed requests.

## Findings from the current frontend

1. `src/lib/utils.ts` wraps Axios in an object shaped like `Response`. It currently defaults to credentials, but also reads `adminSessionId` and `adminAuthToken` from `localStorage` and sends them as custom headers. Those token/session-header assumptions conflict with the new cookie-only session design.
2. `src/pages/AdminLogin.tsx` stores `sessionId` and `authToken` when returned by the login endpoint. The new secure admin DTO must not expose either value.
3. Student and administrator sign-in state is currently duplicated in mutable `localStorage` flags (`isLoggedIn` and `isAdminLoggedIn`). Those flags do not prove that the server session is live, and can remain after the 30-minute backend timeout.
4. API callers are centralized through `apiFetch`; some callers explicitly specify `credentials: 'include'`, while others depend on the wrapper default. There are 18 application callers/services to audit. No standalone browser `fetch` calls were found.
5. The API base URL has a hard-coded fallback in `src/lib/utils.ts`, and the Vite proxy target is hard-coded in `vite.config.ts`. There are no committed frontend environment files or an environment-variable template.
6. Existing DTOs are mostly declared locally at use sites, and login responses are treated as untyped `any`. The security summary confirms `StudentDTO` and `AdminDTO` but does not provide their exact JSON property names or the standard error envelope.

## Planned modifications

### 1. Central API client: `src/lib/utils.ts`

- Replace the current `Response` emulation with a typed API client result/error contract while retaining the `apiFetch` call shape where practical, to minimize component changes.
- Configure Axios centrally with `withCredentials: true`; do not allow individual requests to disable it. This guarantees cookies are attached to every API call.
- Remove reads of `adminSessionId` and `adminAuthToken`, and stop adding `X-Session-Id` and `X-Auth-Token` headers.
- Add a common API-error parser that safely handles JSON and non-JSON error bodies and retains the backend's status/message/errorCode where supplied.
- Centralize handling for the required status codes:
  - **401 Unauthorized:** clear local client authentication state and direct the user to the appropriate login route.
  - **403 Forbidden:** preserve session state; surface a permission/CSRF-origin message and do not redirect as if the user were logged out.
  - **423 Locked:** preserve entered credentials and display the server's account-lockout message, including any retry information if supplied.
  - **429 Too Many Requests:** preserve entered credentials and display a rate-limit message, using `Retry-After` when present.
- Provide an opt-out mechanism for public endpoints only if an endpoint demonstrably must not carry cookies; the default remains credentialed and all existing endpoints remain credentialed.

### 2. Authentication/session state

- Create a small session-state helper (for example `src/lib/auth.ts`) with separate student and admin helpers for setting display identity, clearing client state, and evaluating client navigation state.
- Treat `localStorage` identity fields as display/navigation hints only. Server responses (and 401 handling) are authoritative for authentication.
- Update `src/components/LoginForm.tsx` to parse a typed student login response, persist only non-sensitive `StudentDTO` display fields that are actually returned, and remove any response assumptions not guaranteed by the DTO.
- Update `src/pages/AdminLogin.tsx` to parse a typed admin login response and persist only safe administrator display identity. Remove `sessionId` and `authToken` storage completely.
- Update student and admin logout paths to use the common clearing helpers. If a backend logout endpoint exists in the supplied API contract, call it with credentials before clearing local state; otherwise preserve the current local sign-out behavior.
- Update existing route/page guards to avoid treating a stored boolean as proof of server authentication. They will still provide immediate navigation protection, while protected API responses enforce expiry/authorization.

### 3. DTO and API type definitions

- Add a shared API-types module (for example `src/types/api.ts`) defining generic success/error envelopes, `StudentDTO`, `AdminDTO`, login responses, pagination/list results, and the common security error payload.
- Replace `any` login payloads and response handling with these types.
- Update the payment-history, class-fee, payment-verification, profile, administration, timetable, recording/tute, portfolio, and registration response interfaces only where their current shape conflicts with documented backend DTO/envelope fields.
- Do not include password fields, session IDs, authentication tokens, or cookie values in any response type.
- **Required contract check before implementation:** obtain/inspect the actual serialized fields of `StudentDTO`, `AdminDTO`, and the error response envelope. The summary names the DTO classes but does not state their properties; implementation will not invent field names.

### 4. Page/service error handling

- Apply shared 401/403/423/429 behavior to all API-using modules:
  - `src/components/LoginForm.tsx`
  - `src/components/DashboardHeader.tsx`
  - `src/components/StudentProfile.tsx`
  - `src/pages/AdminLogin.tsx`
  - `src/pages/AdminDashboard.tsx`
  - `src/pages/AdminClassFeeManagement.tsx`
  - `src/pages/AdminRecordingsManagement.tsx`
  - `src/pages/AdminStudentManagement.tsx`
  - `src/pages/ClassFeePayment.tsx`
  - `src/pages/ClassMaterials.tsx`
  - `src/pages/Dashboard.tsx`
  - `src/pages/JoinClass.tsx`
  - `src/pages/PaymentVerifications.tsx`
  - `src/pages/PortfolioManagement.tsx`
  - `src/pages/StudentRegistration.tsx`
  - `src/pages/TimetableManager.tsx`
  - `src/services/portfolioService.ts`
- Preserve each page's existing success behavior and visual UI. Only replace generic or misleading authentication/network messages where the centralized security status requires a specific outcome.
- Keep `studentId` query/body parameters only for endpoints that already require them. Session cookies are not substituted with client-created headers or tokens.

### 5. Environment configuration and proxy: `vite.config.ts`, new env files

- Read backend target and client API base URL from Vite environment variables instead of source-code literals.
- Add `.env.example` documenting non-secret variables such as `VITE_API_BASE_URL` and `VITE_BACKEND_PROXY_TARGET`, with development-safe examples.
- Add/use `.env.development` only if the repository convention allows committed local development defaults; otherwise document local values in the example file and rely on developer-created `.env.local`.
- Update the Vite proxy to use the environment-configured backend target and maintain cookie forwarding/rewriting needed for local session testing.
- Document that production API and frontend origins must be HTTPS and must match the backend CORS/CSRF allow-list. No secret values will be added to frontend environment files.

### 6. Verification after implementation

- Run TypeScript/Vite production build and lint checks available in this repository.
- Manually validate successful student and admin login; confirm that no `sessionId`, auth token, or password appears in browser storage or console output.
- Inspect browser network requests to confirm credentials/cookies are used for every API call and no custom session/token headers are sent.
- Verify 401 redirects/clears stale state; 403 reports authorization/CSRF failure without sign-out; 423 reports account lockout; and 429 reports throttling/retry guidance.
- Verify a 30-minute-session-expiry scenario returns the user to the correct login flow.
- Recheck the payment-history request continues to include its existing required `studentId` parameter and that its UI remains unchanged.

## Clarification required before implementation

Please provide the JSON contracts (or the Java source) for `StudentDTO`, `AdminDTO`, and the standardized error response, particularly the fields used for successful login and 401/403/423/429 responses. The summary confirms their existence but not their serialized property names. This is necessary to update TypeScript interfaces accurately without guessing.

## Files expected to change after approval

- `src/lib/utils.ts`
- New shared authentication and API-type modules under `src/lib/` and/or `src/types/`
- The authentication, guard, and API-calling files listed above, only as needed to adopt the shared client/types
- `vite.config.ts`
- `.env.example` and optionally a documented development environment file

No React layout, styling, visual component, route, feature, or business-workflow changes are planned.
