import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ---------------------------------------------------------------------------
// Backend API utilities
// ---------------------------------------------------------------------------

/** Base URL prefix for all PortfolioServlet calls, from Vite env. */
export const API_BASE_URL = (import.meta.env["VITE_API_BASE_URL"] as string) ?? "/nextlvlict_war/";

/**
 * Build a full API URL by joining the base URL with an endpoint path.
 * Handles trailing/leading slash mismatches gracefully.
 *
 * @example getApiUrl("PortfolioServlet?action=getAllData")
 *          → "/nextlvlict_war/PortfolioServlet?action=getAllData"
 */
export const getApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  const baseUrl = API_BASE_URL.endsWith("/") ? API_BASE_URL : `${API_BASE_URL}/`;
  return `${baseUrl}${cleanEndpoint}`;
};

/** Security-event statuses that trigger a global CustomEvent. */
const SECURITY_STATUSES = new Set([401, 403, 423, 429]);

/**
 * Dispatch a global `api-security-status` CustomEvent so any component
 * can react to auth / rate-limit errors without coupling to service calls.
 */
function dispatchSecurityEvent(status: number, retryAfter?: string | null): void {
  if (!SECURITY_STATUSES.has(status)) return;
  const messages: Record<number, string> = {
    401: "Session expired. Please log in again.",
    403: "You do not have permission to perform this action.",
    423: "Your account has been locked.",
    429: "Too many requests. Please wait before trying again.",
  };
  window.dispatchEvent(
    new CustomEvent("api-security-status", {
      detail: { status, message: messages[status] ?? "Access denied.", retryAfter },
    }),
  );
}

/**
 * Central HTTP wrapper for all backend calls.
 *
 * - Prepends `getApiUrl()` to every endpoint.
 * - Always sends `credentials: 'include'` so the Tomcat `JSESSIONID` cookie
 *   is forwarded automatically.
 * - Injects `X-Auth-Token` and `X-Session-Id` headers if admin tokens are
 *   present in `localStorage`.
 * - Fires a global `api-security-status` CustomEvent for 401/403/423/429.
 * - Never throws for HTTP error status codes — callers check `response.ok`.
 *   Only network-level failures (no response) propagate as exceptions.
 */
export async function apiFetch(
  endpoint: string,
  options?: RequestInit,
): Promise<Response> {
  const url = getApiUrl(endpoint);
  const headers = new Headers(options?.headers);

  // Inject admin auth tokens if present
  const adminAuthToken = localStorage.getItem("adminAuthToken");
  if (adminAuthToken) headers.set("X-Auth-Token", adminAuthToken);
  const adminSessionId = localStorage.getItem("adminSessionId");
  if (adminSessionId) headers.set("X-Session-Id", adminSessionId);

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  dispatchSecurityEvent(
    response.status,
    response.headers.get("Retry-After"),
  );

  return response;
}
