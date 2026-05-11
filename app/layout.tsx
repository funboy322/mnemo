import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { UserProvider } from "@/components/user-provider";
import { LocaleProvider } from "@/components/locale-provider";
import { Header } from "@/components/header";
import { getServerLocale, getDict } from "@/lib/i18n";
import { isClerkEnabled } from "@/lib/auth-config";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = getDict(locale);
  const TITLE = `Mnemo — ${t.heroLine1.replace(/\.$/, "").toLowerCase()}`;
  const DESCRIPTION = t.heroSub;
  return {
    title: { default: TITLE, template: "%s · Mnemo" },
    description: DESCRIPTION,
    applicationName: "Mnemo",
    authors: [{ name: "Mnemo" }],
    keywords: ["learning", "AI", "courses", "duolingo", "education", "обучение", "öğrenme"],
    openGraph: {
      type: "website",
      locale: locale === "ru" ? "ru_RU" : locale === "tr" ? "tr_TR" : "en_US",
      title: TITLE,
      description: DESCRIPTION,
      siteName: "Mnemo",
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
  const tree = (
    <html lang={locale} className="h-full antialiased">
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

  // Only mount ClerkProvider when configured. Without keys, Clerk hooks
  // gracefully return null/false and the app runs in guest-only mode.
  if (!isClerkEnabled()) return tree;

  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#12b76a",
          borderRadius: "0.75rem",
        },
      }}
    >
      {tree}
    </ClerkProvider>
  );
}
