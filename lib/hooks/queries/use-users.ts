"use client";

import { usersApi } from "@/lib/api/users";
import { queryKeys } from "@/utils/query-keys";
import { useQuery } from "@tanstack/react-query";

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users.all,
    queryFn: () => usersApi.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

