"use client";

import { useMemo, useState } from "react";
import {
  useDeleteContactMessage,
  useListContactMessages,
  useUpdateContactMessage,
} from "@/lib/api/generated/contact/contact";
import type { ContactMessage } from "@/lib/api/generated/models";
import { useToast } from "@/components/toast/ToastProvider";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterChip } from "@/components/ui/FilterChip";
import { InlineStatus } from "@/components/ui/InlineStatus";
import { PageHeader } from "@/components/ui/PageHeader";

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("pl-PL", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function WiadomosciPage() {
  const toast = useToast();
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);

  const messagesQuery = useListContactMessages({
    query: { placeholderData: (prev) => prev },
  });
  const updateMutation = useUpdateContactMessage({
    mutation: {
      onSuccess: () => {
        void messagesQuery.refetch();
      },
    },
  });
  const deleteMutation = useDeleteContactMessage({
    mutation: {
      onSuccess: () => {
        void messagesQuery.refetch();
      },
    },
  });

  const messages = (messagesQuery.data?.data as ContactMessage[] | undefined) ?? [];
  const loading = messagesQuery.isLoading;
  const error =
    messagesQuery.error instanceof Error ? messagesQuery.error.message : null;

  const filtered = useMemo(() => {
    if (filter === "unread") return messages.filter((m) => !m.read);
    if (filter === "read") return messages.filter((m) => m.read);
    return messages;
  }, [messages, filter]);

  const selected =
    filtered.find((m) => m.id === selectedId) ??
    messages.find((m) => m.id === selectedId) ??
    null;

  const unreadCount = messages.filter((m) => !m.read).length;
  const busy = updateMutation.isPending || deleteMutation.isPending;

  async function markRead(message: ContactMessage, read: boolean) {
    setActionError(null);
    try {
      await updateMutation.mutateAsync({
        id: message.id,
        data: { read },
      });
      toast.success(read ? "Oznaczono jako przeczytane" : "Oznaczono jako nieprzeczytane");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Nie udało się zaktualizować.";
      setActionError(msg);
      toast.error("Skrzynka", msg);
    }
  }

  async function openMessage(message: ContactMessage) {
    setSelectedId(message.id);
    setActionError(null);
    if (!message.read) {
      await markRead(message, true);
    }
  }

  function removeMessage(message: ContactMessage) {
    setDeleteTarget(message);
  }

  async function confirmRemoveMessage() {
    if (!deleteTarget) return;
    setActionError(null);
    try {
      await deleteMutation.mutateAsync({ id: deleteTarget.id });
      toast.success("Usunięto wiadomość", deleteTarget.subject);
      setSelectedId((current) =>
        current === deleteTarget.id ? null : current,
      );
      setDeleteTarget(null);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Nie udało się usunąć wiadomości.";
      setActionError(msg);
      toast.error("Skrzynka", msg);
    }
  }

  return (
    <div className="animate-rise space-y-6">
      <PageHeader
        eyebrow="Ludzie"
        title="Skrzynka kontaktowa"
        description={`Wiadomości z formularza na stronie publicznej. Nieprzeczytane: ${unreadCount}.`}
      />

      <div className="flex flex-wrap gap-3">
        {(
          [
            ["all", "Wszystkie"],
            ["unread", "Nieprzeczytane"],
            ["read", "Przeczytane"],
          ] as const
        ).map(([value, label]) => (
          <FilterChip
            key={value}
            active={filter === value}
            onClick={() => setFilter(value)}
            label={label}
          />
        ))}
        <button
          type="button"
          onClick={() => void messagesQuery.refetch()}
          className="border border-paper/25 px-4 py-2 font-display text-[11px] tracking-[0.12em] uppercase"
        >
          Odśwież
        </button>
      </div>

      {error ? <InlineStatus kind="error">{error}</InlineStatus> : null}

      {actionError ? <InlineStatus kind="error">{actionError}</InlineStatus> : null}

      {loading ? (
        <InlineStatus kind="loading">Ładowanie wiadomości…</InlineStatus>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <ul className="divide-y divide-paper/10 border border-paper/10">
          {filtered.map((message) => {
            const active = selected?.id === message.id;
            return (
              <li key={message.id}>
                <button
                  type="button"
                  onClick={() => void openMessage(message)}
                  className={`w-full px-4 py-3 text-left transition-colors ${
                    active ? "bg-paper/10" : "hover:bg-paper/5"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-paper/45">
                    <span className="font-mono">{formatDate(message.created_at)}</span>
                    {!message.read ? (
                      <span className="text-brand uppercase">Nowa</span>
                    ) : null}
                  </div>
                  <p className="mt-1 font-display text-sm uppercase tracking-wide text-paper/90">
                    {message.subject}
                  </p>
                  <p className="mt-0.5 text-sm text-paper/60">{message.name}</p>
                </button>
              </li>
            );
          })}
          {!loading && filtered.length === 0 ? (
            <li>
              <EmptyState
                title="Brak wiadomości"
                description="W tym filtrze nie ma nic do odczytania."
              />
            </li>
          ) : null}
        </ul>

        <div className="border border-paper/10 bg-paper/[0.03] p-5 md:p-6">
          {selected ? (
            <div className="space-y-5">
              <div>
                <p className="font-display text-xs tracking-[0.16em] text-brand uppercase">
                  {selected.read ? "Przeczytana" : "Nieprzeczytana"}
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold uppercase">
                  {selected.subject}
                </h2>
                <p className="mt-1 text-xs text-paper/45">
                  {formatDate(selected.created_at)}
                </p>
              </div>

              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-xs tracking-wide text-paper/45 uppercase">
                    Nadawca
                  </dt>
                  <dd className="mt-1 text-paper/90">{selected.name}</dd>
                </div>
                <div>
                  <dt className="text-xs tracking-wide text-paper/45 uppercase">
                    E-mail
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={`mailto:${selected.email}`}
                      className="text-paper underline-offset-2 hover:underline"
                    >
                      {selected.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs tracking-wide text-paper/45 uppercase">
                    Telefon
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={`tel:${selected.phone.replace(/\s/g, "")}`}
                      className="text-paper underline-offset-2 hover:underline"
                    >
                      {selected.phone}
                    </a>
                  </dd>
                </div>
              </dl>

              <div>
                <p className="text-xs tracking-wide text-paper/45 uppercase">
                  Treść
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-paper/85">
                  {selected.body}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject}`)}`}
                  className="bg-brand px-4 py-2.5 font-display text-[11px] tracking-[0.12em] text-paper uppercase transition-colors hover:bg-brand-deep"
                >
                  Odpowiedz e-mailem
                </a>
                <a
                  href={`tel:${selected.phone.replace(/\s/g, "")}`}
                  className="border border-paper/25 px-4 py-2.5 font-display text-[11px] tracking-[0.12em] uppercase"
                >
                  Zadzwoń
                </a>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void markRead(selected, !selected.read)}
                  className="border border-paper/25 px-4 py-2.5 font-display text-[11px] tracking-[0.12em] uppercase disabled:opacity-60"
                >
                  {selected.read ? "Oznacz jako nieprzeczytaną" : "Oznacz jako przeczytaną"}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => removeMessage(selected)}
                  className="border border-brand/50 px-4 py-2.5 font-display text-[11px] tracking-[0.12em] text-brand uppercase transition-colors hover:border-brand hover:bg-brand/10 disabled:opacity-60"
                >
                  {deleteMutation.isPending ? "Usuwanie…" : "Usuń"}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-paper/50">
              Wybierz wiadomość z listy, żeby odczytać treść i skontaktować się z
              nadawcą.
            </p>
          )}
        </div>
      </div>

      <ConfirmModal
        open={deleteTarget !== null}
        title="Usuń wiadomość"
        message={
          deleteTarget
            ? `Na pewno usunąć wiadomość „${deleteTarget.subject}” od ${deleteTarget.name}?`
            : null
        }
        busy={deleteMutation.isPending}
        onConfirm={() => void confirmRemoveMessage()}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
