import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/core/providers/query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageSwitcher } from "@/features/i18n/components/language-switcher";

const roboto = Roboto({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "700", "900"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Advanced Todo",
  description: "Quản lý công việc thông minh",
};

export default function RootLayout({ children, modal }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <TooltipProvider>
            <div className="fixed top-4 right-4 z-50">
              <LanguageSwitcher />
            </div>
            {children}
            {modal}
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
