import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AxiosError } from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function getPageNumbers({
  totalPages,
  currentPage,
}: {
  totalPages: number;
  currentPage: number;
}) {
  const delta = 2;
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      pages.push(i);
    }
  }

  const withEllipsis = [];
  let prev = 0;

  for (const page of pages) {
    if (prev && page - prev > 1) {
      withEllipsis.push("...");
    }
    withEllipsis.push(page);
    prev = page;
  }

  return withEllipsis;
}

export const formatTimeFromSeconds = (
  durationInSeconds: number | null | undefined,
) => {
  if (durationInSeconds) {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.floor(durationInSeconds % 60);
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

    return formattedTime;
  }
};

export function formatDate(timestamp: number, locale?: string): string {
  // Create a Date object from the timestamp
  const date = new Date(timestamp);

  // Default to the user's current locale if none is provided
  const localeToUse = locale || navigator.language;

  // Use Intl.DateTimeFormat for locale-sensitive formatting
  return new Intl.DateTimeFormat(localeToUse, {
    year: "numeric",
    month: "long",
    day: "numeric",
    // hour: "2-digit",
    // minute: "2-digit",
    // second: "2-digit",
  }).format(date);
}

export const getInitials = (name: string) => {
  name
    ?.split(" ")
    .map((word) => word[0]?.toUpperCase())
    .join("");
};

export const createRetryFn = (maxRetries: number) => {
  return (failureCount: number, error: unknown): boolean => {
    if (
      error instanceof AxiosError &&
      (error.response?.status === 401 || error.response?.status === 404)
    ) {
      return false;
    }
    return failureCount < maxRetries;
  };
};

export function firestoreTimestampToDate(seconds: number, nanoseconds: number) {
  const res = new Date(seconds * 1000 + nanoseconds / 1e6);
  return res;
}
