"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { saveIntendedPath } from "@/utils/redirect-handler";
import { IconLoader3 } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, initialized } = useAuthStore();

  useEffect(() => {
    if (initialized && !loading && !user) {
      // Save current path for redirect after login
      saveIntendedPath(pathname);
      router.push("/auth/sign-in");
    }
  }, [user, loading, initialized, router]);

  // Show loading state while checking auth
  if (!initialized || loading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen max-w-80 mx-auto">
          <IconLoader3 className="h-8 w-8 animate-spin text-zinc-500" />
        </div>
      )
    );
  }

  // Show nothing while redirecting
  if (!user) {
    return null;
  }

  // User is authenticated, render children
  return <>{children}</>;
}
