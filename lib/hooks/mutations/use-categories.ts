"use client";

import { categoriesApi } from "@/lib/api/categories";
import { queryKeys } from "@/utils/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { CategoryDeleteResponse, UpdateCategoryPayload } from "@/types/category";

// Create Category
export function useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: categoriesApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
            toast.success("Category created successfully");
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message || "Failed to create category");
        },
    });
}

export function useDeleteCategory(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => categoriesApi.destroy(id),
        onSuccess: () => {
            // Invalidate all category lists to refetch
            queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
            toast.success("Category deleted successfully");
        },
        onError: (error: AxiosError<CategoryDeleteResponse>) => {
            toast.error(error.response?.data?.message || "Failed to delete category");
        },
    });
}

export function useUpdateCategory(id: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: UpdateCategoryPayload) =>
            categoriesApi.update(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.categories.detail(id) });
            toast.success("Category updated successfully");
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message || "Failed to update category");
        },
    });
}

