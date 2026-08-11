"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useToast } from "@/components/toast/ToastProvider";
import { health } from "@/lib/api/generated/admin/admin";
import { destroySession, fetchMe, getStoredToken } from "@/lib/auth";
import { copyText } from "./debugCopy";

function ToolButton({
  label,
  onClick,
  disabled,
  danger,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={
        danger
          ? "border border-brand/50 bg-brand/15 px-3 py-1.5 font-display text-[10px] tracking-[0.12em] text-paper uppercase transition-colors hover:border-brand hover:bg-brand/25 disabled:opacity-50"
          : "border border-paper/20 px-3 py-1.5 font-display text-[10px] tracking-[0.12em] text-paper/70 uppercase transition-colors hover:border-paper/40 hover:text-paper disabled:opacity-50"
      }
    >
      {label}
    </button>
  );
}

type DebugActionsPanelProps = {
  sessionDump: Record<string, unknown>;
  onError: (msg: string | null) => void;
  onHealthPing: (payload: { latencyMs: number; body: string }) => void;
};

export function DebugActionsPanel({
  sessionDump,
  onError,
  onHealthPing,
}: DebugActionsPanelProps) {
  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState<string | null>(null);
  const [confirmLogout, setConfirmLogout] = useState(false);

  async function run(id: string, fn: () => Promise<void>) {
    onError(null);
    setBusy(id);
    try {
      await fn();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Operacja nieudana.";
      onError(msg);
      toast.error("Debug", msg);
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="border border-paper/10 bg-paper/[0.03] p-5">
      <h2 className="font-display text-xs tracking-[0.14em] text-paper/45 uppercase">
        Narzędzia
      </h2>
      <p className="mt-2 text-sm text-paper/55">
        Schowek, cache React Query, ping API, test toastów i twardy wylogowanie.
      </p>

      <div className="mt-4 space-y-4">
        <div>
          <p className="mb-2 font-display text-[10px] tracking-[0.14em] text-paper/40 uppercase">
            Schowek
          </p>
          <div className="flex flex-wrap gap-2">
            <ToolButton
              label="Kopiuj dump sesji"
              disabled={busy !== null}
              onClick={() =>
                void run("copy-dump", async () => {
                  await copyText(
                    "dump",
                    JSON.stringify(sessionDump, null, 2),
                  );
                  toast.success("Schowek", "Skopiowano dump sesji.");
                })
              }
            />
            <ToolButton
              label="Kopiuj token"
              disabled={busy !== null}
              onClick={() =>
                void run("copy-token", async () => {
                  await copyText("token", getStoredToken() ?? "");
                  toast.info("Schowek", "Token skopiowany — uważaj przy wklejaniu.");
                })
              }
            />
            <ToolButton
              label="Kopiuj user id"
              disabled={busy !== null}
              onClick={() =>
                void run("copy-uid", async () => {
                  const id = String(
                    (sessionDump.user as { id?: string } | null)?.id ?? "",
                  );
                  await copyText("user id", id);
                  toast.success("Schowek", "Skopiowano user id.");
                })
              }
            />
            <ToolButton
              label="Kopiuj API URL"
              disabled={busy !== null}
              onClick={() =>
                void run("copy-api", async () => {
                  await copyText("api", String(sessionDump.api ?? ""));
                  toast.success("Schowek", "Skopiowano API URL.");
                })
              }
            />
          </div>
        </div>

        <div>
          <p className="mb-2 font-display text-[10px] tracking-[0.14em] text-paper/40 uppercase">
            Dane / API
          </p>
          <div className="flex flex-wrap gap-2">
            <ToolButton
              label="Ping /api/health"
              disabled={busy !== null}
              onClick={() =>
                void run("health", async () => {
                  const t0 = performance.now();
                  const res = await health();
                  const latencyMs = Math.round(performance.now() - t0);
                  const body = JSON.stringify(res.data);
                  onHealthPing({ latencyMs, body });
                  toast.success("Health", `${body} · ${latencyMs} ms`);
                })
              }
            />
            <ToolButton
              label="Odśwież /me"
              disabled={busy !== null}
              onClick={() =>
                void run("me", async () => {
                  const me = await fetchMe(undefined, { viewAsUserId: null });
                  toast.success(
                    "/me",
                    `${me.email} · role: ${me.roles.join(", ")}`,
                  );
                })
              }
            />
            <ToolButton
              label="Invalidate queries"
              disabled={busy !== null}
              onClick={() =>
                void run("invalidate", async () => {
                  await queryClient.invalidateQueries();
                  toast.success("React Query", "Unieważniono wszystkie zapytania.");
                })
              }
            />
            <ToolButton
              label="Wyczyść cache RQ"
              disabled={busy !== null}
              onClick={() =>
                void run("clear-rq", async () => {
                  queryClient.clear();
                  toast.info("React Query", "Cache wyczyszczony.");
                })
              }
            />
          </div>
        </div>

        <div>
          <p className="mb-2 font-display text-[10px] tracking-[0.14em] text-paper/40 uppercase">
            Toasty
          </p>
          <div className="flex flex-wrap gap-2">
            <ToolButton
              label="Success"
              onClick={() => toast.success("Test", "Toast sukcesu z DevTools.")}
            />
            <ToolButton
              label="Info"
              onClick={() => toast.info("Test", "Toast informacyjny z DevTools.")}
            />
            <ToolButton
              label="Error"
              onClick={() => toast.error("Test", "Toast błędu z DevTools.")}
            />
          </div>
        </div>

        <div>
          <p className="mb-2 font-display text-[10px] tracking-[0.14em] text-paper/40 uppercase">
            Sesja
          </p>
          <div className="flex flex-wrap gap-2">
            <ToolButton
              label="Wyloguj (destroy)"
              danger
              disabled={busy !== null}
              onClick={() => setConfirmLogout(true)}
            />
          </div>
        </div>
      </div>

      <ConfirmModal
        open={confirmLogout}
        title="Twarde wylogowanie"
        message="Usunie localStorage sesji i cookie HttpOnly, potem przekieruje na logowanie."
        confirmLabel="Wyloguj"
        busyLabel="Wylogowywanie…"
        busy={busy === "logout"}
        onClose={() => setConfirmLogout(false)}
        onConfirm={() => {
          void run("logout", async () => {
            setConfirmLogout(false);
            await destroySession();
            queryClient.clear();
            toast.info("Sesja", "Wylogowano.");
            router.replace("/logowanie");
          });
        }}
      />
    </section>
  );
}
