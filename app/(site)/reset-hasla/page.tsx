import type { Metadata } from "next";
import { Suspense } from "react";
import { ClubMark } from "@/components/ClubMark";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset hasła",
  description: "Ustaw nowe hasło do konta CKS Slavia.",
};

export default function ResetPasswordPage() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-chrome text-paper">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_20%,rgba(200,16,46,0.22)_0%,transparent_45%),linear-gradient(160deg,#0e1014_0%,#1a1f26_55%,#12151a_100%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto flex min-h-[100svh] max-w-lg flex-col justify-center px-5 py-16 md:px-8">
        <ClubMark className="h-10 w-10 text-brand" />
        <p className="mt-8 font-display text-sm tracking-[0.28em] text-brand uppercase">
          Strefa klubowa
        </p>
        <h1 className="mt-4 font-display text-3xl tracking-tight uppercase sm:text-4xl">
          Nowe hasło
        </h1>
        <p className="mt-3 text-sm text-paper/65">
          Ustaw hasło do konta klubowego.
        </p>
        <div className="mt-8">
          <Suspense fallback={<p className="text-sm text-paper/60">Ładowanie…</p>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
