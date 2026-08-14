"use client";

type PanelErrorViewProps = {
  title?: string;
  message?: string;
  onRetry: () => void;
};

export function PanelErrorView({
  title = "Coś poszło nie tak",
  message = "Nie udało się wczytać tego widoku. Spróbuj ponownie.",
  onRetry,
}: PanelErrorViewProps) {
  return (
    <div className="animate-rise mx-auto max-w-lg space-y-4 py-10">
      <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
        Błąd
      </p>
      <h1 className="font-display text-3xl font-semibold uppercase">{title}</h1>
      <p className="border-l-2 border-brand bg-brand/10 px-4 py-3 text-sm" role="alert">
        {message}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="bg-brand px-4 py-2 font-display text-xs tracking-[0.12em] text-paper uppercase"
      >
        Spróbuj ponownie
      </button>
    </div>
  );
}
