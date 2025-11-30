"use client";

import { videosApi } from "@/lib/api/videos";
import { queryKeys } from "@/utils/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { VideoDeleteResponse, UpdateVideoPayload } from "@/types/video";

// Create Video
export function useCreateVideo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: videosApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.videos.all });
            toast.success("Video created successfully");
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message || "Failed to create video");
        },
    });
}

export function useDeleteVideo(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => videosApi.destroy(id),
        onSuccess: () => {
            // Invalidate all video lists to refetch
            queryClient.invalidateQueries({ queryKey: queryKeys.videos.all });
            toast.success("Video deleted successfully");
        },
        onError: (error: AxiosError<VideoDeleteResponse>) => {
            toast.error(error.response?.data?.message || "Failed to delete video");
        },
    });
}

export function useUpdateVideo(id: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: UpdateVideoPayload) =>
            videosApi.update(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.videos.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.videos.detail(id) });
            toast.success("Video updated successfully");
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message || "Failed to update video");
        },
    });
}

