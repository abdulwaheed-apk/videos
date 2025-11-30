"use client";

import { usersApi } from "@/lib/api/users";
import { queryKeys } from "@/utils/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { UserDeleteResponse } from "@/types/user";

export function useDeleteUser(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => usersApi.destroy(id),
        onSuccess: () => {
            // Invalidate all user lists to refetch
            queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
            toast.success("User deleted successfully");
        },
        onError: (error: AxiosError<UserDeleteResponse>) => {
            toast.error(error.response?.data?.message || "Failed to delete user");
        },
    });
}

