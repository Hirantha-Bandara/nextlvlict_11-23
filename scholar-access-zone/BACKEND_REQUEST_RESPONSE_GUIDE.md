# Backend request and response pattern

This project is a Vite + React + TypeScript frontend. Almost every backend call goes through one shared function: `apiFetch` in `src/lib/utils.ts`.

Use that same shape in another project when you need:

- One configurable API base URL.
- Cookie/session authentication on every request.
- Optional admin-token headers.
- A familiar `fetch`-style response API (`response.ok`, `response.status`, `response.json()`, and `response.text()`).
- The browser's native multipart implementation for file uploads.

## Request flow

```text
Component/service
  -> apiFetch('ServletOrEndpoint?...', options)
  -> getApiUrl() combines VITE_API_BASE_URL + endpoint
  -> adds session credentials and stored admin headers
  -> FormData: browser fetch
     JSON / URL-encoded data: Axios
  -> Response-like object returned to caller
  -> caller checks HTTP status, then body.success/message/data
```

## Base URL and local development proxy

`src/lib/utils.ts` gets the base URL from Vite:

```ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const getApiUrl = (endpoint: string) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
  return `${baseUrl}${cleanEndpoint}`;
};
```

For this project, a development value should point at the Vite proxy path, for example:

```env
VITE_API_BASE_URL=/nextlvlict_war
VITE_BACKEND_PROXY_TARGET=http://localhost:8080
```

The proxy in `vite.config.ts` forwards `/nextlvlict_war` to Tomcat and rewrites cookie properties so `JSESSIONID` remains usable by the Vite app. In production, set `VITE_API_BASE_URL` to the deployed backend context path or API URL.

Important: this implementation assumes `VITE_API_BASE_URL` is set. Add a startup check or a safe default if you reuse it:

```ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
if (!API_BASE_URL) throw new Error('VITE_API_BASE_URL is required');
```

## Shared API client

This is the reusable behavior from `src/lib/utils.ts`, expressed more compactly. It deliberately returns a `Response`-shaped object even for Axios requests so calling code can use one convention.

```ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function getApiUrl(endpoint: string) {
  const base = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
  return `${base}${endpoint.replace(/^\/+/, '')}`;
}

export async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const url = getApiUrl(endpoint);
  const cleanEndpoint = endpoint.split('?')[0].replace(/^\/+/, '').toLowerCase();
  const isLogin = cleanEndpoint === 'loginservlet' || cleanEndpoint === 'adminlogin';
  const headers = new Headers(options.headers);

  // Optional: used by this app for admin endpoints in addition to the cookie.
  const token = localStorage.getItem('adminAuthToken');
  const sessionId = localStorage.getItem('adminSessionId');
  if (token && !headers.has('X-Auth-Token')) headers.set('X-Auth-Token', token);
  if (sessionId && !headers.has('X-Session-Id')) headers.set('X-Session-Id', sessionId);

  const body = options.body;
  const signalSecurityStatus = (response: { status: number; headers?: Headers; data?: { message?: string } }) => {
    if (!isLogin && [401, 403, 423, 429].includes(response.status)) {
      window.dispatchEvent(new CustomEvent('api-security-status', {
        detail: {
          status: response.status,
          message: response.data?.message,
          retryAfter: response.headers?.get('retry-after'),
        },
      }));
    }
  };

  // Let the browser create the multipart boundary; never set Content-Type here.
  if (body instanceof FormData) {
    const response = await fetch(url, {
      method: options.method ?? 'GET', headers, body, credentials: 'include',
    });
    signalSecurityStatus(response);
    return response;
  }

  try {
    const result = await axios.request({
      url,
      method: options.method ?? 'GET',
      headers: Object.fromEntries(headers.entries()),
      data: body,
      withCredentials: true,
      responseType: 'json',
    });
    return {
      ok: result.status >= 200 && result.status < 300,
      status: result.status,
      statusText: result.statusText,
      headers: new Headers(result.headers as Record<string, string>),
      json: async () => result.data,
      text: async () => typeof result.data === 'string' ? result.data : JSON.stringify(result.data),
    } as Response;
  } catch (error) {
    if (!axios.isAxiosError(error) || !error.response) throw error; // network/unknown error
    const result = error.response;
    const response = {
      ok: false,
      status: result.status,
      statusText: result.statusText,
      headers: new Headers(result.headers as Record<string, string>),
      data: result.data,
    };
    signalSecurityStatus(response);
    return {
      ...response,
      json: async () => result.data,
      text: async () => typeof result.data === 'string' ? result.data : JSON.stringify(result.data),
    } as Response;
  }
}
```

The repository version is the source of truth: `src/lib/utils.ts`. Keep its more complete header conversion if you copy it exactly.

## Authentication model

The backend owns authentication through an HttpOnly session cookie (typically Tomcat's `JSESSIONID`). The frontend cannot read it; it only sends it by passing `withCredentials: true` in Axios or `credentials: 'include'` in fetch.

1. Student login sends JSON to `LoginServlet`.
2. Admin login sends URL-encoded data to `AdminLogin`.
3. The backend sets the session cookie.
4. Later `apiFetch` calls automatically include that cookie.
5. `SessionGuard` confirms the cookie with a protected endpoint rather than trusting localStorage alone.

Local storage is used only for UI identity and routing convenience:

- Student: `isLoggedIn`, `studentId`, name, email, grade details.
- Admin: `isAdminLoggedIn`, username, `adminSessionId`, and `adminAuthToken`.

The admin token/session ID are automatically sent as `X-Auth-Token` and `X-Session-Id` if they exist. Do not treat `isLoggedIn` or `isAdminLoggedIn` as real authorization; the backend's session validation is the authority.

## Request body formats used in this project

### JSON request

Used for the student login and some profile/session endpoints.

```ts
const response = await apiFetch('LoginServlet', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ mobile, password }),
});

const raw = await response.text();
const data = raw ? JSON.parse(raw) : null;
if (!response.ok || data?.success !== true) {
  throw new Error(data?.message || `Login failed (${response.status})`);
}
```

### URL-encoded request

This is the dominant write pattern for servlet endpoints. The payload may contain JSON strings as individual fields.

```ts
const fields = new URLSearchParams({
  action: 'saveTestimonials',
  testimonials: JSON.stringify(testimonials),
});

const response = await apiFetch('PortfolioServlet', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: fields.toString(),
});
const data = await response.json();
if (!response.ok || data.success === false) {
  throw new Error(data.message || 'Save failed');
}
```

### GET request with query parameters

```ts
const query = new URLSearchParams({ page: '1', pageSize: '20' });
const response = await apiFetch(`StudentManagement?action=getAllStudents&${query}`);
if (!response.ok) throw new Error(`Request failed: ${response.status}`);
const data = await response.json();
```

Use `URLSearchParams` instead of manually concatenating user-supplied values so names and special characters are encoded correctly.

### Multipart/form-data upload

`apiFetch` detects `FormData` and switches to native `fetch`. Do not set `Content-Type`; the browser supplies the multipart boundary.

```ts
const form = new FormData();
form.append('action', 'uploadGalleryImage');
form.append('image', selectedFile);

const response = await apiFetch('ImageUploadServlet', {
  method: 'POST',
  body: form,
});
const data = await response.json();
if (!response.ok || data.success === false) {
  throw new Error(data.message || 'Upload failed');
}
```

## Response handling convention

The backend commonly returns JSON with fields such as:

```ts
type ApiResult<T> = {
  success?: boolean | 'true';
  status?: 'success' | 'error';
  message?: string;
  error?: string;
  errorCode?: string;
  data?: T;
};
```

Always evaluate both layers:

1. **HTTP outcome**: `response.ok` and `response.status`.
2. **Business outcome**: payload flags such as `success`, `status`, `error`, and `message`.

This matters because a backend can return `200 OK` while reporting a domain failure in JSON. A robust reusable helper is:

```ts
export async function readApiResult<T>(response: Response): Promise<T> {
  const data = await response.json() as {
    success?: boolean | 'true'; message?: string; error?: string;
  } & T;

  if (!response.ok || data.success === false || data.error) {
    throw new Error(data.error || data.message || `Request failed (${response.status})`);
  }
  return data;
}
```

For login, this project accepts both `success: true` and `success: 'true'`, since the existing backend may serialize either. For normal endpoints prefer a consistent boolean response contract in your new project.

## Security-status notifications

For non-login calls, `apiFetch` dispatches a browser `api-security-status` custom event for HTTP 401, 403, 423, and 429. `SessionBootstrap` in `src/components/SessionGuard.tsx` listens to it and displays a user-facing toast:

- 401: unauthorized
- 403: forbidden
- 423: temporarily locked
- 429: rate limited, optionally using `Retry-After`

If you copy this pattern, mount the listener once near your app root. Let individual screens still handle their own request errors; the event is a cross-cutting notification, not a replacement for error handling.

## Suggested file layout for another React project

```text
src/
  lib/api.ts              # getApiUrl + apiFetch
  lib/auth.ts             # store/clear display identity only
  types/api.ts            # response and DTO interfaces
  services/student.ts     # endpoint-specific functions
  components/SessionGuard.tsx
```

Keep components focused on UI, and put repeated endpoint operations in services. `src/services/portfolioService.ts` and `src/services/imageUploadService.ts` are the examples in this repository.

## CORS and cookie requirements

When frontend and backend have different origins in production, session cookies require backend configuration as well as `withCredentials`/`credentials: 'include'` on the frontend:

- Return a specific allowed origin; do not use `Access-Control-Allow-Origin: *` with credentials.
- Return `Access-Control-Allow-Credentials: true`.
- Allow `Content-Type`, `X-Auth-Token`, and `X-Session-Id` request headers.
- Configure cookie `SameSite` and `Secure` attributes appropriately for your deployment.

The development proxy in this project avoids most cross-origin cookie issues locally. Its `vite.config.ts` cookie rewrites are development-specific; do not copy the removal of `Secure` into production.

## Practical adoption checklist

- [ ] Install Axios: `npm install axios`.
- [ ] Add `VITE_API_BASE_URL` to the new project's environment.
- [ ] Copy/adapt `apiFetch` and have all API calls use it.
- [ ] Decide which endpoints use JSON, URL-encoded fields, or multipart data.
- [ ] Make the backend set and validate an HttpOnly session cookie.
- [ ] If using cross-origin cookies, configure CORS and cookie attributes on the backend.
- [ ] Check both `response.ok` and `data.success`/`data.error` after every call.
- [ ] Verify sessions with a protected backend endpoint on app startup; do not authorize users from localStorage alone.
