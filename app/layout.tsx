import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/components/user-provider";
import { LocaleProvider } from "@/components/locale-provider";
import { Header } from "@/components/header";
import { getServerLocale, getDict } from "@/lib/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = getDict(locale);
  const TITLE = `Curio — ${t.heroLine1.replace(/\.$/, "").toLowerCase()}`;
  const DESCRIPTION = t.heroSub;
  return {
    title: { default: TITLE, template: "%s · Curio" },
    description: DESCRIPTION,
    applicationName: "Curio",
    authors: [{ name: "Curio" }],
    keywords: ["learning", "AI", "courses", "duolingo", "education", "обучение", "öğrenme"],
    openGraph: {
      type: "website",
      locale: locale === "ru" ? "ru_RU" : locale === "tr" ? "tr_TR" : "en_US",
      title: TITLE,
      description: DESCRIPTION,
      siteName: "Curio",
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESCRIPTION,
    },
    formatDetection: { email: false, address: false, telephone: false },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#12b76a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getServerLocale();
  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-display bg-zinc-50 text-zinc-900">
        <LocaleProvider initialLocale={locale}>
          <UserProvider>
            <Header />
            <main className="flex-1 flex flex-col">{children}</main>
          </UserProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
