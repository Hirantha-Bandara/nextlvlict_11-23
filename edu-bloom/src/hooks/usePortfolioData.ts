/**
 * usePortfolioData
 *
 * Four independent TanStack Query hooks — one per data section — that call
 * the individual PortfolioServlet endpoints documented in PORTFOLIO_SERVLET_API.md:
 *   - getTestimonials  → /PortfolioServlet?action=getTestimonials
 *   - getEvents        → /PortfolioServlet?action=getEvents
 *   - getOLTimetable   → /PortfolioServlet?action=getOLTimetable
 *   - getALTimetable   → /PortfolioServlet?action=getALTimetable
 *
 * Using individual queries gives per-section error isolation: if the AL
 * timetable call fails, testimonials, events, and OL timetable are unaffected.
 *
 * Each query:
 * - staleTime: 5 minutes  (avoids hammering the servlet on every re-mount)
 * - retry: 2              (retries twice on network failure)
 * - Falls back to the static mockData values during the initial load or on
 *   error, so the site is never blank without a live backend.
 */

import { useQuery } from "@tanstack/react-query";
import {
  getTestimonials,
  getOLTimetable,
  getALTimetable,
  getEvents,
} from "@/services/portfolioService";
import {
  testimonials as mockTestimonials,
  olTimetable as mockOLTimetable,
  alTimetable as mockALTimetable,
  events as mockEvents,
} from "../../mockData";
import type { ALTimetableDTO, OLTimetableBranchDTO, TestimonialDTO, EventDTO } from "@/types/api";

const QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  retry: 2,
} as const;

export function usePortfolioData() {
  // ----- Testimonials -------------------------------------------------------
  const testimonialsQuery = useQuery({
    queryKey: ["testimonials"],
    queryFn: getTestimonials,
    ...QUERY_OPTIONS,
  });

  // ----- Events -------------------------------------------------------------
  const eventsQuery = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
    ...QUERY_OPTIONS,
  });

  // ----- O/L Timetable ------------------------------------------------------
  const olTimetableQuery = useQuery({
    queryKey: ["olTimetable"],
    queryFn: getOLTimetable,
    ...QUERY_OPTIONS,
  });

  // ----- A/L Timetable ------------------------------------------------------
  const alTimetableQuery = useQuery({
    queryKey: ["alTimetable"],
    queryFn: getALTimetable,
    ...QUERY_OPTIONS,
  });

  // Fall back to mock when a query is still loading or has errored
  const testimonials: TestimonialDTO[] =
    testimonialsQuery.data ?? mockTestimonials;

  const events: EventDTO[] =
    eventsQuery.data ?? (mockEvents as EventDTO[]);

  const olTimetable: OLTimetableBranchDTO[] =
    olTimetableQuery.data ?? (mockOLTimetable as OLTimetableBranchDTO[]);

  const alTimetable: ALTimetableDTO[] =
    alTimetableQuery.data ?? (mockALTimetable as ALTimetableDTO[]);

  return {
    testimonials,
    events,
    olTimetable,
    alTimetable,

    // Per-section loading flags (isPending = initial fetch only, not background refetch)
    testimonialsLoading: testimonialsQuery.isPending,
    eventsLoading: eventsQuery.isPending,
    scheduleLoading: olTimetableQuery.isPending || alTimetableQuery.isPending,

    // Convenience aggregate — true only while ANY section is on its first fetch
    isLoading:
      testimonialsQuery.isPending ||
      eventsQuery.isPending ||
      olTimetableQuery.isPending ||
      alTimetableQuery.isPending,
  };
}
