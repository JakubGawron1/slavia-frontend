"use client";

import { FormEvent, useCallback, useEffect, useId, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";
import type { AttendanceRecord } from "@/lib/api/generated/models";
import {
  checkIn as checkInApi,
  listAttendance,
} from "@/lib/api/generated/default/default";
import {
  attendanceRecordStyle,
  formatAttendanceCheckedAt,
} from "@/lib/attendance-ui";
import { useToast } from "@/components/toast/ToastProvider";
import { usePanel } from "@/components/panel/PanelProvider";
import { EmptyState } from "@/components/ui/EmptyState";
import { InlineStatus } from "@/components/ui/InlineStatus";
import { PageHeader } from "@/components/ui/PageHeader";

/** Blokada tego samego tokenu między remountami (React Strict Mode). */
const checkInLocks = new Set<string>();

function extractToken(raw: string): string {
  try {
    const url = new URL(raw);
    return url.searchParams.get("code") || url.searchParams.get("token") || raw;
  } catch {
    const match = raw.match(/[0-9a-f-]{36}/i);
    return match?.[0] ?? raw.trim();
  }
}

export default function ObecnoscScanClient() {
  const search = useSearchParams();
  const toast = useToast();
  const { viewAs, user } = usePanel();
  const scopeKey = viewAs?.userId ?? user?.id ?? "self";
  const scannerRegionId = useId().replace(/:/g, "");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mine, setMine] = useState<AttendanceRecord[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [saving, setSaving] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const handledScanRef = useRef(false);
  const listRef = useRef<HTMLUListElement>(null);

  const load = useCallback(async () => {
    setListError(null);
    try {
      const res = await listAttendance();
      setMine((res.data as AttendanceRecord[]) ?? []);
    } catch (err) {
      setListError(
        err instanceof Error ? err.message : "Nie udało się wczytać obecności.",
      );
    } finally {
      setListLoading(false);
    }
  }, []);

  const submitCheckIn = useCallback(
    async (rawToken: string) => {
      const t = rawToken.trim();
      if (!t || checkInLocks.has(t)) return;
      checkInLocks.add(t);
      setToken(t);
      setError(null);
      setMessage(null);
      setSaving(true);
      try {
        await checkInApi({ token: t });
        setMessage("Obecność zapisana.");
        toast.success("Obecność zapisana");
        await load();
        requestAnimationFrame(() => {
          listRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        });
      } catch (err) {
        checkInLocks.delete(t);
        const msg = err instanceof Error ? err.message : "Check-in nieudany";
        if (msg.toLowerCase().includes("nie ma treningu")) {
          setMessage(msg);
          toast.info("Brak treningu", msg);
        } else {
          setError(msg);
          toast.error("Check-in nieudany", msg);
        }
      } finally {
        setSaving(false);
      }
    },
    [load, toast],
  );

  useEffect(() => {
    const fromUrl = search.get("code") || search.get("token");
    if (fromUrl) {
      void submitCheckIn(fromUrl);
    }
    void load();
  }, [search, load, scopeKey, submitCheckIn]);

  async function stopScan() {
    const scanner = scannerRef.current;
    scannerRef.current = null;
    setScanning(false);
    if (!scanner) return;
    try {
      if (scanner.isScanning) {
        await scanner.stop();
      }
      await scanner.clear();
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    return () => {
      void stopScan();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void submitCheckIn(token);
  }

  async function startScan() {
    setError(null);
    setMessage(null);
    setScanning(true);
    handledScanRef.current = false;

    await new Promise((r) => requestAnimationFrame(() => r(null)));

    try {
      const scanner = new Html5Qrcode(scannerRegionId);
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        { fps: 8, qrbox: { width: 220, height: 220 } },
        (decoded) => {
          if (handledScanRef.current) return;
          handledScanRef.current = true;
          const extracted = extractToken(decoded);
          void (async () => {
            await stopScan();
            await submitCheckIn(extracted);
          })();
        },
        () => {
          /* ignore frame errors */
        },
      );
    } catch {
      setScanning(false);
      scannerRef.current = null;
      setError("Brak dostępu do kamery lub skaner niedostępny — wklej kod ręcznie.");
    }
  }

  return (
    <div className="animate-rise max-w-xl space-y-6">
      <PageHeader
        eyebrow="Trening"
        title="Obecność"
        description="Zeskanuj stały kod QR u trenera — obecność zapisze się od razu. Gdy kamera nie działa, wklej token poniżej."
      />

      {error ? <InlineStatus kind="error">{error}</InlineStatus> : null}
      {message ? (
        <p className="border-l-2 border-paper/30 bg-paper/5 px-4 py-3 text-sm">
          {message}
        </p>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-3 border border-paper/10 p-4">
        <label className="flex flex-col gap-1.5">
          <span className="font-display text-[11px] tracking-[0.12em] text-paper/50 uppercase">
            Token z QR
          </span>
          <input
            className="w-full border border-paper/20 bg-chrome/40 px-3 py-2 font-mono text-sm outline-none focus:border-brand"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-brand px-4 py-2 font-display text-xs tracking-[0.12em] uppercase disabled:opacity-50"
          >
            {saving ? "Zapisuję…" : "Zapisz obecność"}
          </button>
          {!scanning ? (
            <button
              type="button"
              disabled={saving}
              onClick={() => void startScan()}
              className="border border-paper/25 px-4 py-2 font-display text-xs tracking-[0.12em] uppercase disabled:opacity-50"
            >
              Skanuj kamerą
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void stopScan()}
              className="border border-paper/25 px-4 py-2 font-display text-xs tracking-[0.12em] uppercase"
            >
              Stop
            </button>
          )}
        </div>
        <div
          id={scannerRegionId}
          className={
            scanning
              ? "mt-2 overflow-hidden border border-paper/15 [&_video]:max-h-72 [&_video]:w-full [&_video]:object-cover"
              : "hidden"
          }
        />
        {scanning ? (
          <p className="text-xs text-paper/45">
            Skieruj kamerę na kod QR. Po odczycie obecność zapisze się sama.
          </p>
        ) : (
          <p className="text-xs text-paper/45">
            Jeśli skaner nie wystartuje, wklej token z kodu i zapisz ręcznie.
          </p>
        )}
      </form>

      <div>
        <h2 className="font-display text-xs tracking-[0.14em] text-paper/45 uppercase">
          Twoje obecności (okno roku)
        </h2>
        {listError ? (
          <div className="mt-3">
            <InlineStatus kind="error">{listError}</InlineStatus>
          </div>
        ) : null}
        {listLoading ? (
          <InlineStatus kind="loading">Ładowanie obecności…</InlineStatus>
        ) : mine.length === 0 && !listError ? (
          <div className="mt-3">
            <EmptyState
              title="Brak zapisów"
              description="Zeskanuj kod QR na treningu, aby zapisać pierwszą obecność."
            />
          </div>
        ) : (
        <ul ref={listRef} className="mt-3 divide-y divide-paper/10 border border-paper/10">
          {mine.map((r) => {
            const style = attendanceRecordStyle(r.status);
            const { date, time } = formatAttendanceCheckedAt(r.checked_at);
            const showTime = r.status !== "absent" && Boolean(time);
            return (
              <li
                key={r.id}
                className="flex items-center justify-between gap-3 px-3 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm text-paper/85">{date}</p>
                  {showTime ? (
                    <p className="mt-0.5 text-xs text-paper/45">
                      Zapis o {time}
                    </p>
                  ) : null}
                </div>
                <span
                  className={`shrink-0 px-2 py-0.5 font-display text-[0.65rem] tracking-[0.12em] uppercase ${style.badge}`}
                >
                  {style.label}
                </span>
              </li>
            );
          })}
        </ul>
        )}
      </div>
    </div>
  );
}
