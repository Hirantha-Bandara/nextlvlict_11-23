/**
 * useGalleryImages
 *
 * TanStack Query hook that fetches the gallery image list from:
 *   GET /ImageUploadServlet?action=listGalleryImages
 *
 * - staleTime: 5 minutes — gallery images don't change often.
 * - retry: 2 — retry twice on network failure.
 * - Falls back to the static hardcoded image list when the backend is
 *   unavailable, so the gallery is never blank during development.
 */

import { useQuery } from "@tanstack/react-query";
import { listGalleryImages } from "@/services/imageUploadService";
import board from "@/assets/teacher-board.asset.json";

/** Fallback images used when the backend is unreachable. */
const FALLBACK_IMAGES = [
  { id: -1, imageUrl: board.url, displayOrder: 1 },
  { id: -2, imageUrl: "https://i.postimg.cc/XvM9d9J3/Untitled-1.jpg", displayOrder: 2 },
  { id: -3, imageUrl: "https://i.postimg.cc/TYgtS2WZ/Untitled-4.jpg", displayOrder: 3 },
  { id: -4, imageUrl: "https://i.postimg.cc/3r0ttMVP/488649541-955854176714179-2622661861794059200-n.jpg", displayOrder: 4 },
  { id: -5, imageUrl: "https://i.postimg.cc/6pbRsqvw/488064566-955857376713859-2037561799818529390-n.jpg", displayOrder: 5 },
  { id: -6, imageUrl: "https://i.postimg.cc/xCn9ty19/487532672-955856803380583-3867803886711536079-n.jpg", displayOrder: 6 },
  { id: -7, imageUrl: "https://i.postimg.cc/DzFVTfkS/488257886-955845133381750-8007387066401113016-n.jpg", displayOrder: 7 },
];

export function useGalleryImages() {
  const query = useQuery({
    queryKey: ["galleryImages"],
    queryFn: listGalleryImages,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  return {
    images: query.data ?? FALLBACK_IMAGES,
    isLoading: query.isPending,
    isError: query.isError,
  };
}
