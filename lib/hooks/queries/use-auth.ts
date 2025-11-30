import { useQuery } from "@tanstack/react-query";
import { User } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { onAuthStateChanged } from "firebase/auth";

// interface AuthUser {
//   uid: string;
//   email: string | null;
//   name: string | null;
//   photoURL: string | null;
// }

// Hook to get current user from Firebase Auth
export function useCurrentUser() {
  return useQuery({
    queryKey: ["auth", "user"],
    queryFn: () => {
      return new Promise<User | null>((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          unsubscribe();
          resolve(user);
        });
      });
    },
    staleTime: Infinity, // User data doesn't go stale
    gcTime: Infinity, // Keep in cache indefinitely
  });
}

// Hook to verify server session
export function useSession() {
  return useQuery({
    queryKey: ["auth", "session"],
    queryFn: async () => {
      const response = await fetch("/api/auth/session");

      if (!response.ok) {
        throw new Error("No valid session");
      }

      return response.json();
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Combined hook for convenience
export function useAuth() {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: session, isLoading: sessionLoading } = useSession();

  return {
    user,
    session: session?.user,
    isLoading: userLoading || sessionLoading,
    isAuthenticated: !!user && !!session?.success,
  };
}
