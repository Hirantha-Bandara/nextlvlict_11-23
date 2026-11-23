import { useQuery } from "@tanstack/react-query";
import { getFreeLessons } from "@/services/portfolioService";
import type { FreeLessonDTO } from "@/types/api";

export function useFreeLessons() {
  const query = useQuery({
    queryKey: ["freeLessons"],
    queryFn: getFreeLessons,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const freeLessons: FreeLessonDTO[] = query.data?.success
    ? [...query.data.lessons].sort((a, b) => a.displayOrder - b.displayOrder)
    : [];

  return { freeLessons, isLoading: query.isPending };
}
