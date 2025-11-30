"use client";
import { IconInnerShadowTop, type Icon } from "@tabler/icons-react";
import { NavUser } from "@/components/sidebars/nav-user";
import { NavMain } from "@/components/sidebars/nav-main";
import { GetSidebarData } from "@/components/sidebars/data";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export type SidebarItem = {
  title: string;
  url: string;
  icon: Icon;
  isActive?: boolean;
};

export function AppSidebar() {
  const data = GetSidebarData();

  return (
    <Sidebar
      side="left"
      className="w-64 h-screen my-auto bg-white dark:bg-white/5 dark:text-gray-200 border-e flex flex-col shadow-none p-px rounded-xl border border-transparent"
    >
      <SidebarHeader className="bg-white dark:bg-white/5 dark:text-gray-200">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">
                  Video Management
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="flex flex-col bg-white dark:bg-white/5 dark:text-gray-200">
        <NavMain items={data.main} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.profile} />
      </SidebarFooter>
    </Sidebar>
  );
}
