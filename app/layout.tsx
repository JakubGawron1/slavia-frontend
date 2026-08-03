import type { Metadata } from "next";
import { Outfit, Public_Sans } from "next/font/google";
import { ConsentAwareAnalytics } from "@/components/analytics/ConsentAwareAnalytics";
import { AppQueryProvider } from "@/components/AppQueryProvider";
import { CookieConsentBanner } from "@/components/cookies/CookieConsentBanner";
import { SITE_THEME_BOOTSTRAP_SCRIPT, DEFAULT_SITE_THEME } from "@/lib/site-theme";
import "./globals.css";

const display = Outfit({
  variable: "--font-outfit",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700", "800"],
});

const body = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "CKS Slavia Ruda Śląska",
    template: "%s · CKS Slavia",
  },
  description:
    "Ciężarowy Klub Sportowy Slavia Ruda Śląska — dwubój olimpijski, treningi i zawody w Rudzie Śląskiej.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={`${display.variable} ${body.variable} h-full`}
      data-site-theme={DEFAULT_SITE_THEME}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: SITE_THEME_BOOTSTRAP_SCRIPT }}
        />
      </head>
      <body className="flex min-h-full flex-col antialiased">
        <AppQueryProvider>{children}</AppQueryProvider>
        <CookieConsentBanner />
        <ConsentAwareAnalytics />
      </body>
    </html>
  );
}
