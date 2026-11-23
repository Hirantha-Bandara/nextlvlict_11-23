# Backend Request & Response Architecture 

A complete reference for how this project communicates with the Java/Tomcat backend, so you can replicate the same pattern in another project.

---

## Overview

```
React Component / Page
       │
       ▼
Service layer  (src/services/*.ts)
       │  calls
       ▼
apiFetch()  (src/lib/utils.ts)  ◄── injects auth headers from localStorage
       │
       ├── FormData body? ──► native fetch (multipart uploads)
       │
       └── everything else ──► axios.request (JSON / urlencoded)
               │
               ▼
       Vite dev proxy  (/nextlvlict_war → http://localhost:8080)
               │
               ▼
       Java Servlet (Tomcat)   e.g. PortfolioServlet, LoginServlet
```

---

## 1. Environment & Base URL

### Files
- `.env.development` / `.env.example`
- `src/lib/utils.ts`

### How it works

The backend base URL is read from a Vite environment variable:

```ts
// src/lib/utils.ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
// → "/nextlvlict_war/" in development
```

A helper always builds the full URL:

```ts
export const getApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
  return `${baseUrl}${cleanEndpoint}`;
};
// getApiUrl('PortfolioServlet?action=getEvents')
// → "/nextlvlict_war/PortfolioServlet?action=getEvents"
```

### `.env.development`

```env
VITE_API_BASE_URL=/nextlvlict_war/
VITE_BACKEND_PROXY_TARGET=http://localhost:8080
```

The browser hits `/nextlvlict_war/*` which Vite's dev server proxies to Tomcat on port 8080. In production the frontend is deployed on the same Tomcat, so no proxy is needed — the path resolves directly.

---

## 2. Vite Dev Proxy

### File: `vite.config.ts`

```ts
proxy: {
  '/nextlvlict_war': {
    target: env.VITE_BACKEND_PROXY_TARGET,   // http://localhost:8080
    changeOrigin: true,
    secure: false,
    cookieDomainRewrite: '',
    cookiePathRewrite: '/nextlvlict_war',
    configure: (proxy) => {
      proxy.on('proxyRes', (proxyRes) => {
        // Downgrade SameSite=None → Lax and strip Secure flag
        // so Tomcat's JSESSIONID cookie works on http://localhost
        const setCookie = proxyRes.headers['set-cookie'];
        if (setCookie) {
          proxyRes.headers['set-cookie'] = setCookie.map(cookie =>
            cookie.replace(/SameSite=None/gi, 'SameSite=Lax')
                  .replace(/;?\s*Secure/gi, '')
          );
        }
      });
    },
  },
},
```

**Why this matters:** Session cookies (`JSESSIONID`) set by Tomcat would be rejected by the browser if the scheme is `http` but the cookie says `Secure`. The proxy rewrites the cookie attributes so the browser accepts and forwards the session cookie on every subsequent request.

---

## 3. The `apiFetch` Wrapper

### File: [`src/lib/utils.ts`](file:///d:/Project/scholar-access-zone/src/lib/utils.ts)

This is the single entry point for all HTTP calls. It handles:

| Concern | How |
|---|---|
| Base URL | prepended via `getApiUrl()` |
| Session cookie | `credentials: 'include'` is always forced |
| Admin auth token | read from `localStorage('adminAuthToken')`, injected as `X-Auth-Token` header |
| Admin session ID | read from `localStorage('adminSessionId')`, injected as `X-Session-Id` header |
| **FormData** body | routed to native `fetch()` (so the browser sets the multipart boundary) |
| **All other** bodies | routed through `axios.request()` |
| Security events | HTTP 401 / 403 / 423 / 429 dispatch a `CustomEvent('api-security-status')` on `window` |
| Response shape | Axios response is adapted into a `fetch`-like `Response` object so callers always use `.json()` / `.text()` / `.ok` / `.status` |

```ts
export async function apiFetch(
  endpoint: string,
  options?: RequestInit
): Promise<Response> {
  const url = getApiUrl(endpoint);

  // 1. Auth headers
  const headers = new Headers(options?.headers);
  const adminAuthToken = localStorage.getItem('adminAuthToken');
  if (adminAuthToken) headers.set('X-Auth-Token', adminAuthToken);
  const adminSessionId = localStorage.getItem('adminSessionId');
  if (adminSessionId) headers.set('X-Session-Id', adminSessionId);

  const method = options?.method || 'GET';
  const data = options?.body;

  // 2. FormData → native fetch (preserves multipart boundary)
  if (data instanceof FormData) {
    const response = await fetch(url, { method, headers, body: data, credentials: 'include' });
    dispatchSecurityEvent(response.status, ...);
    return response;
  }

  // 3. Everything else → axios (returns a fetch-compatible Response)
  try {
    const axiosResponse = await axios.request({ url, method, headers, data, withCredentials: true });
    return adaptAxiosToResponse(axiosResponse);   // wraps .json() / .ok / .status
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      dispatchSecurityEvent(err.response.status, ...);
      return adaptAxiosToResponse(err.response);  // non-2xx still returns a Response, not a throw
    }
    throw err;  // network-level failure → propagate
  }
}
```

> **Key design decision:** `apiFetch` never throws for HTTP error status codes (4xx/5xx) — it always returns a `Response`-like object. Only network-level failures (no response at all) re-throw. Callers check `response.ok` themselves.

---

## 4. Authentication & Session Management

### File: [`src/lib/auth.ts`](file:///d:/Project/scholar-access-zone/src/lib/auth.ts)

Two independent auth contexts exist side by side:

#### Student (cookie-only)
- Login: POST to `LoginServlet`
- Tomcat sets `JSESSIONID` as an **HttpOnly** cookie
- The browser forwards it automatically on every subsequent request via `credentials: 'include'`
- On logout, student data is removed from `localStorage` (session is server-side)

```ts
const studentKeys = ['isLoggedIn', 'studentId', 'firstName', 'lastName', 'email', 'mobile', 'school', 'gradeId', 'gradeName'];
export const clearStudentSession = () => studentKeys.forEach(key => localStorage.removeItem(key));
export const storeStudentIdentity = (student: StudentDTO): boolean => { /* stores to localStorage */ };
```

#### Admin (cookie + token headers)
- Login: POST to `AdminLogin` servlet
- Backend returns `sessionId` and `authToken` in the JSON response body
- Both are stored in `localStorage` and injected as custom headers (`X-Session-Id`, `X-Auth-Token`) by `apiFetch` on every request

```ts
export const storeAdminIdentity = (admin, auth) => {
  localStorage.setItem('adminAuthToken', auth.authToken);
  localStorage.setItem('adminSessionId', auth.sessionId);
};
```

---

## 5. Request Patterns in Services

### File: [`src/services/portfolioService.ts`](file:///d:/Project/scholar-access-zone/src/services/portfolioService.ts)

#### Pattern A — GET with query-string action

```ts
// Calls: GET /nextlvlict_war/PortfolioServlet?action=getEvents
const response = await apiFetch('PortfolioServlet?action=getEvents');
if (!response.ok) throw new Error(`Failed: ${response.status}`);
const data: EventDTO[] = await response.json();
```

#### Pattern B — POST with `application/x-www-form-urlencoded`

Used when sending structured data (non-file), e.g. saving testimonials:

```ts
const response = await apiFetch('PortfolioServlet', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    action: 'saveTestimonials',
    testimonials: JSON.stringify(testimonials),
  }),
});
const result = await response.json();
return result.success === true;
```

#### Pattern C — POST with `multipart/form-data` (file upload)

```ts
const formData = new FormData();
formData.append('file', file);
formData.append('action', 'uploadImage');

const response = await apiFetch('PortfolioServlet', {
  method: 'POST',
  body: formData,
  // ⚠️ Do NOT set Content-Type — the browser must set it with the boundary
});
const result = await response.json();
return result.success ? result.url : null;
```

### File: [`src/services/imageUploadService.ts`](file:///d:/Project/scholar-access-zone/src/services/imageUploadService.ts)

This service uses two internal helpers that wrap `apiFetch`:

```ts
// Generic POST helper — checks response.ok and data.success
async function request(action: string, body: BodyInit): Promise<any> {
  const response = await apiFetch('ImageUploadServlet', { method: 'POST', body, credentials: 'include' });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.success === false) throw new Error(data.message || 'Image request failed');
  return data;
}

// Builds a FormData with non-file fields + an image File
async function upload(action: string, fields: Record<string, string>, image: File): Promise<UploadResult> {
  const form = new FormData();
  form.append('action', action);
  Object.entries(fields).forEach(([key, value]) => form.append(key, value));
  form.append('image', image);
  return request(action, form);
}

// Builds a FormData with only string fields (no file)
function actionForm(action: string, fields: Record<string, string> = {}) {
  const form = new FormData();
  form.append('action', action);
  Object.entries(fields).forEach(([key, value]) => form.append(key, value));
  return form;
}
```

Usage examples:

```ts
imageUploadService.uploadGalleryImage(file);                         // file upload
imageUploadService.deleteGalleryImage(imageId);                      // action-only POST
imageUploadService.reorderGalleryImages(orderData);                  // POST with JSON field
```

---

## 6. Response Shape

All backend servlets return JSON. The expected response shapes are typed in [`src/types/api.ts`](file:///d:/Project/scholar-access-zone/src/types/api.ts).

### Success / failure envelope

```ts
interface ApiErrorResponse {
  success?: false;
  message?: string;
  errorCode?: string;
}
```

Most write operations return:
```json
{ "success": true }
```
or on failure:
```json
{ "success": false, "message": "Something went wrong" }
```

### Security events (global error handling)

When `apiFetch` receives HTTP **401**, **403**, **423**, or **429**, it fires a global `CustomEvent` that any component can listen to:

```ts
window.addEventListener('api-security-status', (e: CustomEvent) => {
  const { status, message, retryAfter } = e.detail;
  // 401 → redirect to login
  // 403 → show "forbidden" message
  // 423 → account locked
  // 429 → rate limited (check retryAfter)
});
```

---

## 7. Replication Checklist for Another Project

To apply this exact pattern, you need these pieces:

| # | What | File(s) to copy/adapt |
|---|---|---|
| 1 | **Env vars** | `.env.development`, `.env.example` |
| 2 | **Vite proxy** (dev only) | `vite.config.ts` → `server.proxy` block |
| 3 | **`getApiUrl`** helper | `src/lib/utils.ts` |
| 4 | **`apiFetch`** wrapper | `src/lib/utils.ts` |
| 5 | **Auth storage helpers** | `src/lib/auth.ts` |
| 6 | **API types** | `src/types/api.ts` (adapt to your DTOs) |
| 7 | **Service layer** | `src/services/*.ts` (adapt endpoints/DTOs) |

### Minimal `apiFetch` (stripped down, no axios)

If you don't want axios as a dependency, here is a simpler version using only native `fetch`:

```ts
export async function apiFetch(endpoint: string, options?: RequestInit): Promise<Response> {
  const url = getApiUrl(endpoint);
  const headers = new Headers(options?.headers);

  // Inject admin tokens if present
  const token = localStorage.getItem('adminAuthToken');
  const sessionId = localStorage.getItem('adminSessionId');
  if (token) headers.set('X-Auth-Token', token);
  if (sessionId) headers.set('X-Session-Id', sessionId);

  return fetch(url, { ...options, headers, credentials: 'include' });
}
```

> The full version uses axios only to get better error handling on non-2xx responses (axios rejects on non-2xx, then the catch block normalises it back into a `Response`-shaped object).

---

## 8. Quick Reference — Servlet Action Pattern

All servlet interactions follow the same convention: an `action` parameter tells the servlet which operation to perform.

| HTTP method | Content-Type | Where `action` goes |
|---|---|---|
| GET | — | Query string: `?action=getEvents` |
| POST (data) | `application/x-www-form-urlencoded` | `URLSearchParams` body field |
| POST (file) | `multipart/form-data` | `FormData` field named `action` |

The Java servlet then reads `request.getParameter("action")` and dispatches accordingly.
