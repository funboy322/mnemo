import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/components/user-provider";
import { Header } from "@/components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const TITLE = "Curio — учись чему угодно";
const DESCRIPTION = "Превратит любую тему в персональный курс с упражнениями. Как Duolingo, только для всего.";

export const metadata: Metadata = {
  title: { default: TITLE, template: "%s · Curio" },
  description: DESCRIPTION,
  applicationName: "Curio",
  authors: [{ name: "Curio" }],
  keywords: ["обучение", "AI", "курсы", "duolingo", "education", "spaced repetition"],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Curio",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#12b76a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-display bg-zinc-50 text-zinc-900">
        <UserProvider>
          <Header />
          <main className="flex-1 flex flex-col">{children}</main>
        </UserProvider>
      </body>
    </html>
  );
}
