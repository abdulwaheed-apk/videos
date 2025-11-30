"use client";
import { ModeToggle } from "./reuseable/mode-toggle";
import { SidebarTrigger } from "./ui/sidebar";

export function AppHeader() {
  return (
    <header
      className={
        "flex justify-between items-center gap-4 pb-4 pt-6 mx-4 sticky inset-x-0 top-0 z-50 shadow-none border-b backdrop-blur-md bg-card text-card-foreground dark:bg-white/5 w-full rounded-b-xl"
      }
    >
      <div className={"flex justify-start items-center gap-4 px-2"}>

        <SidebarTrigger />
      </div>
      <div className={"flex justify-end items-center p-4"}>
        <ModeToggle />
      </div>
    </header>
  );
}
