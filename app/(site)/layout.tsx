import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SiteThemeProvider } from "@/components/SiteThemeProvider";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SiteThemeProvider>
      <div className="flex min-h-full flex-1 flex-col">
        <Header />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
      </div>
    </SiteThemeProvider>
  );
}
