
export const queryKeys = {

  categories: {
    all: ["categories"] as const,
    lists: () => [...queryKeys.categories.all, "list"] as const,
    list: (filters: Filters) =>
      [...queryKeys.categories.lists(), filters] as const,
    details: () => [...queryKeys.categories.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.categories.details(), id] as const,
  },
  videos: {
    all: ["videos"] as const,
    lists: () => [...queryKeys.videos.all, "list"] as const,
    list: (filters: Filters) =>
      [...queryKeys.videos.lists(), filters] as const,
    details: () => [...queryKeys.videos.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.videos.details(), id] as const,
  },
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (filters: Filters) =>
      [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },
};

export interface Filters {
  search?: string | null;
  page?: number;
  perPage?: number;
  status?: string | null;
}
