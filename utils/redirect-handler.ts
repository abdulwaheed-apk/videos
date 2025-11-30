/**
 * Utilities for handling redirects after login
 */

const INTENDED_PATH_KEY = "intendedPath";

/**
 * Save the intended path before redirecting to login
 * Call this in middleware or when user tries to access protected route
 */
export function saveIntendedPath(path: string) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(INTENDED_PATH_KEY, path);
  }
}

/**
 * Get the intended path and clear it from storage
 * Use this after successful login to redirect user
 */
export function getAndClearIntendedPath(): string | null {
  if (typeof window !== "undefined") {
    const path = sessionStorage.getItem(INTENDED_PATH_KEY);
    if (path) {
      sessionStorage.removeItem(INTENDED_PATH_KEY);
      return path;
    }
  }
  return null;
}

/**
 * Get redirect path from URL search params
 * Used when middleware adds ?redirect=/some-path to login URL
 */
export function getRedirectFromUrl(): string | null {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    return params.get("redirect");
  }
  return null;
}
