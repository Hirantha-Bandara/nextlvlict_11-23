/**
 * imageUploadService
 *
 * Service layer for all ImageUploadServlet interactions.
 * Follows the same apiFetch pattern used by portfolioService.
 *
 * Servlet: /ImageUploadServlet
 * All reads use GET with an `action` query-string parameter.
 * All writes use POST with multipart/form-data or application/x-www-form-urlencoded.
 */

import { apiFetch } from "@/lib/utils";
import type { GalleryImageDTO, ListGalleryImagesResponse } from "@/types/api";

const SERVLET = "ImageUploadServlet";

// ---------------------------------------------------------------------------
// Helper — GET request to ImageUploadServlet
// ---------------------------------------------------------------------------

async function get<T>(action: string): Promise<T> {
  const response = await apiFetch(`${SERVLET}?action=${action}`);
  if (!response.ok) {
    throw new Error(`ImageUploadServlet [${action}] failed — HTTP ${response.status}`);
  }
  return response.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Read operations
// ---------------------------------------------------------------------------

/**
 * Fetch the ordered gallery image list.
 *
 * GET /ImageUploadServlet?action=listGalleryImages
 *
 * Response:
 * {
 *   "success": true,
 *   "images": [{ "id": 2, "imageUrl": "https://...", "displayOrder": 1 }]
 * }
 *
 * Images are pre-sorted by `displayOrder` ascending on the server, but we
 * sort client-side as well to guarantee order even if the server omits it.
 */
export async function listGalleryImages(): Promise<GalleryImageDTO[]> {
  const data = await get<ListGalleryImagesResponse>("listGalleryImages");

  if (!data.success || !Array.isArray(data.images)) {
    throw new Error("ImageUploadServlet [listGalleryImages] returned an unexpected payload");
  }

  // Sort by displayOrder ascending (server should already do this, but be safe)
  return [...data.images].sort((a, b) => a.displayOrder - b.displayOrder);
}
