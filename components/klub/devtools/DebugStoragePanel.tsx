"use client";

import { useCallback, useState } from "react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useToast } from "@/components/toast/ToastProvider";
import { COOKIE_CONSENT_KEY } from "@/lib/cookie-consent";
import { USER_CHANGELOG_SEEN_KEY } from "@/lib/user-changelog";

const AUTH_KEYS = new Set(["slavia_auth_token", "slavia_auth_user"]);

function listSlaviaKeys(): { key: string; bytes: number }[] {
  if (typeof window === "undefined") return [];
  const out: { key: string; bytes: number }[] = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key?.startsWith("slavia_")) continue;
    const value = localStorage.getItem(key) ?? "";
    out.push({ key, bytes: value.length });
  }
  return out.sort((a, b) => a.key.localeCompare(b.key, "pl"));
}

export function DebugStoragePanel({
  onError,
}: {
  onError: (msg: string | null) => void;
}) {
  const toast = useToast();
  const [keys, setKeys] = useState(listSlaviaKeys);
  const [confirmClear, setConfirmClear] = useState(false);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(() => {
    setKeys(listSlaviaKeys());
  }, []);

  function removeKey(key: string) {
    onError(null);
    try {
      localStorage.removeItem(key);
      refresh();
      toast.success("Storage", `Usunięto ${key}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Nie udało się usunąć.";
      onError(msg);
      toast.error("Storage", msg);
    }
  }

  function clearNonAuth() {
    onError(null);
    setBusy(true);
    try {
      let removed = 0;
      for (const { key } of listSlaviaKeys()) {
        if (AUTH_KEYS.has(key)) continue;
        localStorage.removeItem(key);
        removed += 1;
      }
      refresh();
      setConfirmClear(false);
      toast.success("Storage", `Usunięto ${removed} kluczy (bez sesji).`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Nie udało się wyczyścić.";
      onError(msg);
      toast.error("Storage", msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="border border-paper/10 bg-paper/[0.03] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xs tracking-[0.14em] text-paper/45 uppercase">
            localStorage
          </h2>
          <p className="mt-2 text-sm text-paper/55">
            Klucze <span className="font-mono text-paper/70">slavia_*</span> w
            tej przeglądarce.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={refresh}
            className="border border-paper/20 px-3 py-1.5 font-display text-[10px] tracking-[0.12em] text-paper/70 uppercase hover:border-paper/40 hover:text-paper"
          >
            Odśwież
          </button>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem(USER_CHANGELOG_SEEN_KEY);
              refresh();
              toast.info("Storage", "Zresetowano seen changelog.");
            }}
            className="border border-paper/20 px-3 py-1.5 font-display text-[10px] tracking-[0.12em] text-paper/70 uppercase hover:border-paper/40 hover:text-paper"
          >
            Reset „Co nowego”
          </button>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem(COOKIE_CONSENT_KEY);
              refresh();
              toast.info("Storage", "Zresetowano zgodę cookies.");
            }}
            className="border border-paper/20 px-3 py-1.5 font-display text-[10px] tracking-[0.12em] text-paper/70 uppercase hover:border-paper/40 hover:text-paper"
          >
            Reset cookies consent
          </button>
          <button
            type="button"
            onClick={() => setConfirmClear(true)}
            className="border border-brand/50 bg-brand/15 px-3 py-1.5 font-display text-[10px] tracking-[0.12em] text-paper uppercase hover:border-brand hover:bg-brand/25"
          >
            Wyczyść poza sesją
          </button>
        </div>
      </div>

      {keys.length === 0 ? (
        <p className="mt-4 text-sm text-paper/45">Brak kluczy slavia_*.</p>
      ) : (
        <ul className="mt-4 divide-y divide-paper/10 border border-paper/10">
          {keys.map(({ key, bytes }) => (
            <li
              key={key}
              className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm"
            >
              <span className="font-mono text-xs text-paper/80">
                {key}
                <span className="ml-2 text-paper/40">{bytes} B</span>
                {AUTH_KEYS.has(key) ? (
                  <span className="ml-2 font-display text-[9px] tracking-[0.12em] text-brand/80 uppercase">
                    sesja
                  </span>
                ) : null}
              </span>
              {!AUTH_KEYS.has(key) ? (
                <button
                  type="button"
                  onClick={() => removeKey(key)}
                  className="border border-paper/15 px-2 py-1 font-display text-[9px] tracking-[0.12em] text-paper/55 uppercase hover:border-paper/35 hover:text-paper"
                >
                  Usuń
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      <ConfirmModal
        open={confirmClear}
        title="Wyczyścić localStorage?"
        message="Usunie wszystkie klucze slavia_* poza tokenem i userem sesji (view-as, motyw, consent, changelog…)."
        confirmLabel="Wyczyść"
        busy={busy}
        busyLabel="Czyszczenie…"
        onClose={() => setConfirmClear(false)}
        onConfirm={clearNonAuth}
      />
    </section>
  );
}
