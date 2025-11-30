import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { SidebarItem } from "@/components/app-sidebar";

export function NavGeneral({ items }: { items: SidebarItem[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-50 px-3 pt-2 mb-1">
        General
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem
              className="rounded-lg transition-all duration-150"
              key={item.title}
            >
              <SidebarMenuButton asChild>
                <Link
                  href={item.url}
                  aria-current={item.isActive ? "page" : undefined}
                  className={`
                                    flex items-center gap-3 p-3 text-sm rounded-lg
                                    ${
                                      item.isActive
                                        ? "bg-blue-50 text-blue-600 font-semibold" // Active State
                                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 hover:text-blue-600" // Default & Hover
                                    }
                                `}
                >
                  <item.icon className="size-5 shrink-0" />
                  <span className="truncate">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
