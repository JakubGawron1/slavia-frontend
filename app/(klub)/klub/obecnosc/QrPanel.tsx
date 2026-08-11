import { QrCodeImage } from "@/components/QrCodeImage";
import type { AttendanceSessionLocal } from "./useStaffObecnosc";

type QrPanelProps = {
  session: AttendanceSessionLocal | null;
  qrPayload: string;
  onRefresh: () => void;
};

export function QrPanel({ session, qrPayload, onRefresh }: QrPanelProps) {
  return (
    <div className="border border-paper/10 bg-paper/[0.03] p-4 print:border-0">
      <p className="font-display text-[11px] tracking-[0.14em] text-paper/45 uppercase">
        Kod klubowy · {session?.label ?? "—"}
      </p>
      {session && qrPayload ? (
        <QrCodeImage
          value={qrPayload}
          size={280}
          alt="Kod QR obecności"
          className="mx-auto mt-4 h-56 w-56 bg-surface p-2"
        />
      ) : (
        <p className="mt-4 text-sm text-paper/45">Ładowanie sesji QR…</p>
      )}
      <p className="mt-3 break-all font-mono text-[10px] text-paper/40">
        {session?.token}
      </p>
      {session?.refreshed_at ? (
        <p className="mt-1 text-[10px] text-paper/35">
          Odświeżono: {session.refreshed_at.slice(0, 19).replace("T", " ")}
        </p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2 print:hidden">
        <button
          type="button"
          onClick={onRefresh}
          className="bg-brand px-3 py-2 font-display text-[11px] tracking-[0.12em] uppercase"
        >
          Odśwież QR
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="border border-paper/25 px-3 py-2 font-display text-[11px] tracking-[0.12em] uppercase"
        >
          Drukuj
        </button>
      </div>
    </div>
  );
}
