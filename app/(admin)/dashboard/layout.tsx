"use client";
import { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { cn } from "@/lib/utils";

function AdminLayoutContent({ children }: { children: ReactNode }) {
  const { state } = useSidebar();
  return (
    <>
      <AppSidebar />
      <main
        className={cn(
          "flex flex-col gap-y-2.5 w-full h-screen",
          state === "expanded"
            ? "max-w-full sm:max-w-[calc(100vw-300px)]"
            : "max-w-full",
        )}
      >
        <AppHeader />
        <div
          className={cn(
            "flex justify-start items-start w-full mx-4 rounded-xl bg-card dark:bg-white/5 text-card-foreground",
            "min-h-[calc(100vh-200px)] max-h-[calc(100vh-90px)] overflow-y-auto",
          )}
        >
          {children}
        </div>
      </main>
    </>
  );
}

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <SidebarProvider>
      <ProtectedRoute>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </ProtectedRoute>
    </SidebarProvider>
  );
}
