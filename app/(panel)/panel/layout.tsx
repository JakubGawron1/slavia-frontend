import type { Metadata } from "next";
import { PanelProvider } from "@/components/panel/PanelProvider";
import { PanelShell } from "@/components/panel/PanelShell";
import { PanelWhatsNewHost } from "@/components/changelog/PanelWhatsNewHost";

export const metadata: Metadata = {
  title: "Panel zawodnika",
  description: "Panel zawodnika CKS Slavia — wyniki, obecność i kalendarz.",
};

export default function AthletePanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PanelProvider>
      <PanelShell>{children}</PanelShell>
      <PanelWhatsNewHost />
    </PanelProvider>
  );
}
