"use client";

import { SigninForm } from "@/components/auth/signin-form";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Loader } from "@/components/reuseable/loader";

export default function SignInPage() {
  const { loading, initialized } = useAuthStore();

  // Show loading while auth is initializing
  if (!initialized || loading) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SigninForm />
      </div>
    </div>
  );
}
