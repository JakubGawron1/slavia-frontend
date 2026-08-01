"use client";

import { FormEvent, useCallback, useEffect, useId, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";
import { klubFetch } from "@/lib/klub-api";

type AttendanceRecord = {
  id: string;
  checked_at: string;
  display_name: string;
};

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
  const scannerRegionId = useId().replace(/:/g, "");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mine, setMine] = useState<AttendanceRecord[]>([]);
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const load = useCallback(async () => {
    try {
      setMine(await klubFetch<AttendanceRecord[]>("/api/attendance"));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const fromUrl = search.get("code") || search.get("token");
    if (fromUrl) setToken(fromUrl);
    void load();
  }, [search, load]);

  useEffect(() => {
    return () => {
      void stopScan();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkIn(e?: FormEvent) {
    e?.preventDefault();
    setError(null);
    setMessage(null);
    try {
      await klubFetch("/api/attendance", {
        method: "POST",
        body: { token: token.trim() },
      });
      setMessage("Obecność zapisana.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Check-in nieudany");
    }
  }

  async function startScan() {
    setError(null);
    setMessage(null);
    setScanning(true);

    // Poczekaj na montaż kontenera DOM
    await new Promise((r) => requestAnimationFrame(() => r(null)));

    try {
      const scanner = new Html5Qrcode(scannerRegionId);
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        { fps: 8, qrbox: { width: 220, height: 220 } },
        (decoded) => {
          const extracted = extractToken(decoded);
          setToken(extracted);
          setMessage("Kod odczytany — potwierdź zapis.");
          void stopScan();
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

  return (
    <div className="animate-rise max-w-xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold uppercase">
          Obecność
        </h1>
        <p className="mt-2 text-sm text-paper/55">
          Zeskanuj kod QR u trenera albo wklej token sesji.
        </p>
      </div>

      {error ? (
        <p className="border-l-2 border-brand bg-brand/10 px-4 py-3 text-sm" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="border-l-2 border-paper/30 bg-paper/5 px-4 py-3 text-sm">
          {message}
        </p>
      ) : null}

      <form onSubmit={checkIn} className="space-y-3 border border-paper/10 p-4">
        <input
          className="w-full border border-paper/20 bg-ink/40 px-3 py-2 font-mono text-sm outline-none focus:border-brand"
          placeholder="Token z QR"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            className="bg-brand px-4 py-2 font-display text-xs tracking-[0.12em] uppercase"
          >
            Zapisz obecność
          </button>
          {!scanning ? (
            <button
              type="button"
              onClick={() => void startScan()}
              className="border border-paper/25 px-4 py-2 font-display text-xs tracking-[0.12em] uppercase"
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
      </form>

      <div>
        <h2 className="font-display text-xs tracking-[0.14em] text-paper/45 uppercase">
          Twoje obecności (okno roku)
        </h2>
        <ul className="mt-3 divide-y divide-paper/10 border border-paper/10">
          {mine.map((r) => (
            <li key={r.id} className="px-3 py-2 text-sm text-paper/70">
              {r.checked_at}
            </li>
          ))}
          {mine.length === 0 ? (
            <li className="px-3 py-4 text-paper/45">Brak zapisów.</li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
