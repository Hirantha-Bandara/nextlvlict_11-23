import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios"

type ApiErrorPayload = {
  message?: string;
};

// export const API_BASE_URL = "https://nextlvlict.com/nextlvlict/";
// export const API_BASE_URL = "http://localhost:8080/nextlvlict/";
// export const API_BASE_URL = "http://localhost:8080/nextlvlict_war_exploded/";
// In development, use Vite's proxy so the browser treats the backend session
// cookie as same-origin. Production deployments can still override this with
// VITE_API_BASE_URL.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const getApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
  return `${baseUrl}${cleanEndpoint}`;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * API fetch wrapper that automatically adds the base URL to all requests
 * @param endpoint - The endpoint URL (relative or full)
 * @param options - Standard fetch options
 * @returns Promise<Response>
 */

// export async function apiFetch(
//   endpoint: string,
//   options?: RequestInit
// ): Promise<Response> {
//   const url = getApiUrl(endpoint);
//   return fetch(url, options);
// }

export async function apiFetch(
  endpoint: string,
  options?: RequestInit
): Promise<Response> {
  const url = getApiUrl(endpoint);
  const normalizedEndpoint = endpoint.split('?')[0].replace(/^\/+/, '').toLowerCase();
  const isAuthEndpoint = normalizedEndpoint === 'loginservlet' || normalizedEndpoint === 'adminlogin';

  const method = options?.method || 'GET';
  // Every backend request uses the HttpOnly session cookie. Callers cannot
  // disable credentials because session validation is the source of truth.
  const withCredentials = true;
  const headers = new Headers(options?.headers);
  const adminAuthToken = localStorage.getItem('adminAuthToken');
  if (adminAuthToken && !headers.has('X-Auth-Token')) {
    headers.set('X-Auth-Token', adminAuthToken);
  }
  const adminSessionId = localStorage.getItem('adminSessionId');
  if (adminSessionId && !headers.has('X-Session-Id')) {
    headers.set('X-Session-Id', adminSessionId);
  }

  let data: unknown = undefined;
  if (options && 'body' in options && options.body !== undefined && options.body !== null) {
    data = options.body;
  }

  // Keep multipart uploads on the browser's native fetch path.  In particular,
  // this lets the browser generate the multipart boundary and attach the
  // existing JSESSIONID exactly as it does for the documented servlet call.
  // Axios is retained for the JSON and urlencoded requests used elsewhere.
  if (data instanceof FormData) {
    const response = await fetch(url, {
      method,
      headers,
      body: data,
      credentials: 'include',
    });

    if (!isAuthEndpoint && [401, 403, 423, 429].includes(response.status)) {
      window.dispatchEvent(new CustomEvent('api-security-status', {
        detail: { status: response.status },
      }));
    }

    return response;
  }

  try {
    const axiosResponse = await axios.request({
      url,
      method,
      headers: Object.fromEntries(headers.entries()),
      data,
      // Authentication is exclusively handled by the HttpOnly backend session
      // cookie. It cannot be read or recreated by client-side JavaScript.
      withCredentials,
      responseType: 'json',
    });

    // Create a Headers-like object with get() method
    const responseHeaders = new Map(
      Object.entries(axiosResponse.headers).map(([k, v]) => [
        k.toLowerCase(),
        String(v),
      ])
    );

    const resp: Partial<Response> = {
      ok: axiosResponse.status >= 200 && axiosResponse.status < 300,
      status: axiosResponse.status,
      statusText: axiosResponse.statusText,
      json: async () => axiosResponse.data,
      text: async () => (typeof axiosResponse.data === 'string' ? axiosResponse.data : JSON.stringify(axiosResponse.data)),
      headers: new Headers(Object.fromEntries(responseHeaders.entries())),
    };

    return resp as Response;
  } catch (err: unknown) {
    if (axios.isAxiosError<ApiErrorPayload>(err) && err.response) {
      const axiosResponse = err.response;
      if (!isAuthEndpoint && [401, 403, 423, 429].includes(axiosResponse.status)) {
        window.dispatchEvent(new CustomEvent('api-security-status', {
          detail: {
            status: axiosResponse.status,
            message: axiosResponse.data?.message,
            retryAfter: axiosResponse.headers?.['retry-after'],
          },
        }));
      }
      
      // Create a Headers-like object with get() method
      const responseHeaders = new Map(
        Object.entries(axiosResponse.headers || {}).map(([k, v]) => [
          k.toLowerCase(),
          String(v),
        ])
      );

      const resp: Partial<Response> = {
        ok: false,
        status: axiosResponse.status,
        statusText: axiosResponse.statusText,
        json: async () => axiosResponse.data,
        text: async () => (typeof axiosResponse.data === 'string' ? axiosResponse.data : JSON.stringify(axiosResponse.data)),
        headers: new Headers(Object.fromEntries(responseHeaders.entries())),
      };
      return resp as Response;
    }

    throw err;
  }
}
