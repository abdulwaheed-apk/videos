import { IconCategory, IconDashboard, IconVideo, IconUsers } from "@tabler/icons-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { usePathname } from "next/navigation";

export function GetSidebarData() {
  const { user } = useAuthStore();
  const pathname = usePathname();

  const isActive = (url: string, exact: boolean = false): boolean => {
    if (exact) {
      return pathname === url;
    }
    if (pathname === url) {
      return true;
    }
    // If the URL ends with a slash and the pathname starts with it (e.g., /access-control/ matches /access-control/roles)
    // Or if the URL does not end with a slash, check if the pathname starts with the URL followed by a slash (e.g., /access-control/foo matches /access-control)
    if (url.endsWith("/")) {
      return pathname.startsWith(url);
    } else {
      return pathname.startsWith(`${url}/`);
    }
  };

  return {
    profile: {
      name: user?.displayName || "",
      email: user?.email || "",
      avatar: user?.photoURL || "",
    },
    main: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: IconDashboard,
        isActive: isActive("/dashboard", true),
      },
      {
        title: "Categories",
        url: "/dashboard/categories",
        icon: IconCategory,
        isActive: isActive("/dashboard/categories"),
      },
      {
        title: "Videos",
        url: "/dashboard/videos",
        icon: IconVideo,
        isActive: isActive("/dashboard/videos"),
      },
      {
        title: "Users",
        url: "/dashboard/users",
        icon: IconUsers,
        isActive: isActive("/dashboard/users"),
      },
    ],
  };
}
