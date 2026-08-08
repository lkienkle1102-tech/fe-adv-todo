import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "../globals.css";
import { QueryProvider } from "@/core/providers/query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { LanguageSwitcher } from "@/features/i18n/components/language-switcher";
import { LocaleSync } from "@/features/i18n/components/locale-sync";
import { locales, type Locale } from "@/i18n/locales";

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

export function generateStaticParams() {
  return Object.keys(locales).map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  modal,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  return (
    <html
      lang={locale}
      className={`${roboto.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LocaleSync locale={locale as Locale} />
        <QueryProvider>
          <TooltipProvider>
            <div className="fixed top-4 right-4 z-50">
              <LanguageSwitcher />
            </div>
            {children}
            {modal}
            <Toaster position="top-center" richColors closeButton />
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
