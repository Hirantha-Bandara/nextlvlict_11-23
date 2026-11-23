/**
 * portfolioService
 *
 * Service layer for all PortfolioServlet interactions.
 * Every function wraps apiFetch and returns typed data.
 * Follows the servlet action pattern documented in PORTFOLIO_SERVLET_API.md.
 *
 * HTTP pattern summary:
 *   GET  ?action=<name>              → read operations
 *   POST application/x-www-form-urlencoded  → write operations
 */

import { apiFetch } from "@/lib/utils";
import type {
  AllDataResponse,
  ALTimetableDTO,
  ApiResponse,
  EventDTO,
  FreeLessonsResponse,
  OLTimetableBranchDTO,
  TestimonialDTO,
} from "@/types/api";

const SERVLET = "PortfolioServlet";

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

/**
 * Issue a GET request to PortfolioServlet with the given action.
 * Returns the parsed JSON body, or throws if the response is not ok.
 */
async function get<T>(action: string): Promise<T> {
  const response = await apiFetch(`${SERVLET}?action=${action}`);
  if (!response.ok) {
    throw new Error(`PortfolioServlet [${action}] failed — HTTP ${response.status}`);
  }
  return response.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Read operations
// ---------------------------------------------------------------------------

/** Fetch all portfolio data in a single request. */
export async function getAllData(): Promise<AllDataResponse> {
  return get<AllDataResponse>("getAllData");
}

/** Fetch testimonials only. */
export async function getTestimonials(): Promise<TestimonialDTO[]> {
  return get<TestimonialDTO[]>("getTestimonials");
}

/** Fetch events only. */
export async function getEvents(): Promise<EventDTO[]> {
  return get<EventDTO[]>("getEvents");
}

/** Fetch the free lessons shown on the public site. */
export async function getFreeLessons(): Promise<FreeLessonsResponse> {
  return get<FreeLessonsResponse>("getFreeLessons");
}

/** Fetch O/L timetable grouped by branch. */
export async function getOLTimetable(): Promise<OLTimetableBranchDTO[]> {
  return get<OLTimetableBranchDTO[]>("getOLTimetable");
}

/** Fetch A/L timetable. */
export async function getALTimetable(): Promise<ALTimetableDTO[]> {
  return get<ALTimetableDTO[]>("getALTimetable");
}

// ---------------------------------------------------------------------------
// Write operations
// ---------------------------------------------------------------------------

/** Replace all testimonials. */
export async function saveTestimonials(
  testimonials: Omit<TestimonialDTO, "id">[],
): Promise<ApiResponse> {
  const response = await apiFetch(SERVLET, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      action: "saveTestimonials",
      testimonials: JSON.stringify(testimonials),
    }),
  });
  return response.json() as Promise<ApiResponse>;
}

/** Replace all events. */
export async function saveEvents(
  events: Omit<EventDTO, "id">[],
): Promise<ApiResponse> {
  const response = await apiFetch(SERVLET, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      action: "saveEvents",
      events: JSON.stringify(events),
    }),
  });
  return response.json() as Promise<ApiResponse>;
}

/** Replace all O/L timetable entries. */
export async function saveOLTimetable(
  timetableData: OLTimetableBranchDTO[],
): Promise<ApiResponse> {
  const response = await apiFetch(SERVLET, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      action: "saveOLTimetable",
      timetableData: JSON.stringify(timetableData),
    }),
  });
  return response.json() as Promise<ApiResponse>;
}

/** Replace all A/L timetable entries. */
export async function saveALTimetable(
  timetableData: Omit<ALTimetableDTO, "id">[],
): Promise<ApiResponse> {
  const response = await apiFetch(SERVLET, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      action: "saveALTimetable",
      timetableData: JSON.stringify(timetableData),
    }),
  });
  return response.json() as Promise<ApiResponse>;
}

/**
 * Upload an image file via multipart/form-data.
 * Returns the uploaded image URL on success.
 */
export async function uploadImage(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append("action", "uploadImage");
  formData.append("file", file);

  // Do NOT set Content-Type — the browser must set it with the multipart boundary.
  const response = await apiFetch(SERVLET, {
    method: "POST",
    body: formData,
  });

  const result = await response.json().catch(() => ({ success: false }));
  return result.success && result.url ? (result.url as string) : null;
}
