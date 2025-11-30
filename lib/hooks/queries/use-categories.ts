"use client";

import { categoriesApi } from "@/lib/api/categories";
import { queryKeys } from "@/utils/query-keys";
import { useQuery } from "@tanstack/react-query";

export function useCategories() {
    return useQuery({
        queryKey: queryKeys.categories.all,
        queryFn: () => categoriesApi.getAll(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export function useCategoryById(id: string) {
    return useQuery({
        queryKey: queryKeys.categories.detail(id),
        queryFn: () => categoriesApi.getById(id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

