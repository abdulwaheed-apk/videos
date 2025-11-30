import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import ReactQueryProvider from "./providers/react-query-provider";
import "./globals.css";

type Props = Readonly<{
  children: React.ReactNode;
}>;

const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Video and Categories App",
  description: "",
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${nunito.variable} font-sans antialiased bg-stone-100 dark:bg-[#171717] dark:backdrop-blur-2xl text-primary dark:text-gray-200`}
      >
        <ReactQueryProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
