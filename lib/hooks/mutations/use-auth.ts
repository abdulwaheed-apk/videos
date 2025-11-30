import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  getRedirectFromUrl,
  getAndClearIntendedPath,
} from "@/utils/redirect-handler";

interface LoginCredentials {
  email: string;
  password: string;
}

// Helper function to create session cookie
async function createSession(idToken: string) {
  const response = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    throw new Error("Failed to create session");
  }

  return response.json();
}

// Helper function to clear session cookie
async function clearSession() {
  const response = await fetch("/api/auth/session", {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to clear session");
  }

  return response.json();
}

// Helper to determine redirect path after login
function getRedirectPath(): string {
  // Priority 1: URL parameter (from middleware)
  const urlRedirect = getRedirectFromUrl();
  if (urlRedirect) return urlRedirect;

  // Priority 2: Saved intended path
  const intendedPath = getAndClearIntendedPath();
  if (intendedPath) return intendedPath;

  // Priority 3: Default dashboard
  return "/dashboard";
}

// Email/Password Login
export function useLoginWithEmail() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password }: LoginCredentials) => {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const idToken = await userCredential.user.getIdToken();
      await createSession(idToken);
      return userCredential.user;
    },
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
      toast.success(`Welcome back, ${user.displayName || user.email}!`);

      const redirectPath = getRedirectPath();
      router.push(redirectPath);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error("Login error:", error);

      // Handle specific Firebase errors
      const errorCode = error.code;
      let errorMessage = "Failed to sign in. Please try again.";

      switch (errorCode) {
        case "auth/invalid-credential":
        case "auth/user-not-found":
        case "auth/wrong-password":
          errorMessage = "Invalid email or password.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later.";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled.";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your connection.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email format.";
          break;
      }

      toast.error(errorMessage);
    },
  });
}

// Logout
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await firebaseSignOut(auth);
      await clearSession();
    },
    onSuccess: () => {
      queryClient.clear(); // Clear all queries
      // Don't show toast here, let the loading state handle UI feedback
      router.push("/auth/sign-in");
    },
    onError: (error) => {
      console.error("Logout error:", error);
      toast.error("Failed to sign out. Please try again.");
    },
  });
}
