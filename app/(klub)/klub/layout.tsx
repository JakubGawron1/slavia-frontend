import type { Metadata } from "next";
import { KlubProvider } from "@/components/klub/KlubProvider";
import { KlubShell } from "@/components/klub/KlubShell";
import { KlubWhatsNewHost } from "@/components/changelog/KlubWhatsNewHost";

export const metadata: Metadata = {
  title: "Panel klubowy",
  description: "Panel zarządzania CKS Slavia — trener, admin, superadmin.",
};

export default function KlubLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <KlubProvider>
      <KlubShell>{children}</KlubShell>
      <KlubWhatsNewHost />
    </KlubProvider>
  );
}
