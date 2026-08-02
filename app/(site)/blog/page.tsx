import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { listPublicFlags } from "@/lib/api/generated/default/default";
import { isFlagEnabled } from "@/lib/public-flags";

export const metadata: Metadata = {
  title: "Aktualności",
  description: "Aktualności i relacje z życia CKS Slavia Ruda Śląska.",
};

export default async function BlogPage() {
  let flagEnabled = true;
  try {
    const result = await listPublicFlags();
    flagEnabled = isFlagEnabled(result.data, "public_blog");
  } catch {
    flagEnabled = true;
  }

  if (!flagEnabled) {
    notFound();
  }

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
          Blog klubowy
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
          Aktualności
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-steel-soft md:text-lg">
          Ta sekcja jest w przygotowaniu — wkrótce pojawią się tu relacje z
          zawodów i nowinki z życia klubu.
        </p>
      </div>
    </section>
  );
}
