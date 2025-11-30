"use client";
import React, { ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { FR, SA, US } from "country-flag-icons/react/3x2";
import { Globe } from "lucide-react";
import { toTitleCase } from "@/utils";

interface LanguageOption {
  code: string;
  label: string;
  flag: ReactNode;
}

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const locale = "en"; // Default to English since i18n is removed

  const handleLanguageChange = async (newLocale: string) => {
    // Language switching is disabled since i18n is removed
    console.log("Language switching disabled");
  };

  const currentLang = languageOptions.find((l) => l.code === locale);
  return (
    <div
      className={cn(
        "flex justify-start items-center px-2 gap-x-3 cursor-pointer",
        className,
      )}
    >
      <DropdownMenu dir="ltr">
        <DropdownMenuTrigger
          asChild
          className={
            cn("focus:border-transparent focus-visible:ring-transparent")
            // "py-1.5 px-3 border rounded-sm  focus:outline-none shadow-2xs"
            // className
            //   ? "border-0"
            //   : "border-gray-200 dark:border-gray-500 hover:border-gray-200 focus:border-gray-300"
          }
        >
          <div className="px-2 py-1 rounded-md">
            <span className="hidden sm:flex items-center justify-center gap-2 text-lg font-normal">
              <Globe className="size-5" />
              {currentLang?.label}
            </span>

            <span className="flex sm:hidden items-center justify-center gap-2 text-xs font-normal">
              <Globe className="size-4" />
              {toTitleCase(currentLang?.code)}
            </span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {languageOptions.map((lang) => (
            <DropdownMenuItem
              onSelect={() => handleLanguageChange(lang.code)}
              key={lang.code}
            >
              {lang.flag}
              {lang.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

const languageOptions: LanguageOption[] = [
  {
    code: "ar",
    label: "العربية",
    flag: <SA title="Saudi Arabia" className="size-6" />,
  },
  {
    code: "en",
    label: "English",
    flag: <US title="United States" className="size-6" />,
  },
  {
    code: "fr",
    label: "Français",
    flag: <FR title="France" className="size-6" />,
  },
];
