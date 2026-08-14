import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";

export function SessionMissing({ message }: { message?: string }) {
  return (
    <div className="flex min-h-[100svh] items-center justify-center bg-chrome px-4 text-paper">
      <EmptyState
        title="Brak sesji"
        description={message ?? "Zaloguj się, aby otworzyć panel."}
        action={
          <Link
            href="/logowanie"
            className="inline-block border border-brand/50 bg-brand/15 px-4 py-2 font-display text-xs tracking-[0.12em] text-paper uppercase hover:border-brand hover:bg-brand/25"
          >
            Przejdź do logowania
          </Link>
        }
        className="max-w-md border border-paper/10 bg-paper/[0.03] px-6 py-8 text-sm text-paper/50"
      />
    </div>
  );
}
