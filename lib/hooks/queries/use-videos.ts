"use client";

import { videosApi } from "@/lib/api/videos";
import { queryKeys } from "@/utils/query-keys";
import { useQuery } from "@tanstack/react-query";

export function useVideos() {
  return useQuery({
    queryKey: queryKeys.videos.all,
    queryFn: () => videosApi.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useVideoById(id: string) {
  return useQuery({
    queryKey: queryKeys.videos.detail(id),
    queryFn: () => videosApi.getById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
