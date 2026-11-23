/**
 * API type definitions for PortfolioServlet responses.
 * Shapes match those documented in PORTFOLIO_SERVLET_API.md.
 */

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

export interface TestimonialDTO {
  id: number;
  name: string;
  role: string;
  /** URL to the person's photo */
  image: string;
  text: string;
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

export interface EventDTO {
  id: number;
  title: string;
  description: string;
  /** URL to the event thumbnail */
  image: string;
  /** Date string, e.g. "2024-01-15" */
  date: string;
  location: string;
  fullDescription?: string;
  fee?: string;
}

// ---------------------------------------------------------------------------
// O/L Timetable
// ---------------------------------------------------------------------------

export interface OLTimetableEntryDTO {
  location: string;
  /** e.g. "Grade 10" */
  grade: string;
  /** e.g. "Wednesday 3.30PM - 5.30PM" */
  time: string;
  group?: string;
}

export interface OLTimetableBranchDTO {
  branch: string;
  grade10: OLTimetableEntryDTO[];
  grade11: OLTimetableEntryDTO[];
  grade11RevisionPaper?: OLTimetableEntryDTO[];
}

// ---------------------------------------------------------------------------
// A/L Timetable
// ---------------------------------------------------------------------------

export interface ALTimetableDTO {
  id?: number;
  branch: string;
  /** e.g. "2026" or "2027" */
  year: string;
  /** e.g. "Theory" or "Revision + Paper" */
  type: string;
  /** e.g. "Saturday 1.00PM - 3.00PM" */
  time: string;
}

// ---------------------------------------------------------------------------
// Free lessons
// ---------------------------------------------------------------------------

export interface FreeLessonDTO {
  id: number;
  unitLabel: string;
  title: string;
  /** A YouTube watch, share, or embed URL. */
  youtubeUrl: string;
  /** 1-based display order assigned by the backend. */
  displayOrder: number;
}

export interface FreeLessonsResponse {
  success: boolean;
  lessons: FreeLessonDTO[];
  message?: string;
}

// ---------------------------------------------------------------------------
// getAllData combined response
// ---------------------------------------------------------------------------

export interface AllDataResponse {
  testimonials: TestimonialDTO[];
  events: EventDTO[];
  olTimetable: OLTimetableBranchDTO[];
  alTimetable: ALTimetableDTO[];
}

// ---------------------------------------------------------------------------
// Gallery — ImageUploadServlet
// ---------------------------------------------------------------------------

/** A single image entry returned by ImageUploadServlet?action=listGalleryImages */
export interface GalleryImageDTO {
  id: number;
  imageUrl: string;
  /** 1-based sort order assigned by the backend */
  displayOrder: number;
}

/** Full response envelope for listGalleryImages */
export interface ListGalleryImagesResponse {
  success: boolean;
  images: GalleryImageDTO[];
}

// ---------------------------------------------------------------------------
// Generic success / error envelopes
// ---------------------------------------------------------------------------

export interface ApiSuccessResponse {
  success: true;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  message?: string;
  error?: string;
  errorCode?: string;
}

export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;
