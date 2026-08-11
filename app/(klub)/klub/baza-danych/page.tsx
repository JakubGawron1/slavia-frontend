"use client";

import { useCallback, useEffect, useState } from "react";
import {
  dbDeleteRow,
  dbListRows,
  dbListTables,
  dbUpsertRow,
} from "@/lib/api/generated/default/default";
import type { UpsertRowBodyRow } from "@/lib/api/generated/models";
import { useToast } from "@/components/toast/ToastProvider";
import { Modal } from "@/components/ui/Modal";

export default function BazaDanychPage() {
  const toast = useToast();
  const [tables, setTables] = useState<string[]>([]);
  const [table, setTable] = useState<string>("");
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [editJson, setEditJson] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadTables = useCallback(async () => {
    const data = (await dbListTables()).data as string[];
    setTables(data);
    if (!table && data[0]) setTable(data[0]);
  }, [table]);

  const loadRows = useCallback(async (name: string) => {
    if (!name) return;
    const data = (await dbListRows(name)).data as Record<string, unknown>[];
    setRows(data);
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        setError(null);
        await loadTables();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Błąd tabel");
      }
    })();
  }, [loadTables]);

  useEffect(() => {
    if (!table) return;
    void (async () => {
      try {
        setError(null);
        await loadRows(table);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Błąd wierszy");
      }
    })();
  }, [table, loadRows]);

  async function saveRow() {
    try {
      setMessage(null);
      const row = JSON.parse(editJson) as UpsertRowBodyRow;
      await dbUpsertRow(table, { row });
      setMessage("Zapisano wiersz.");
      toast.success("Zapisano wiersz", table);
      setEditJson("");
      await loadRows(table);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Zapis nieudany";
      setError(msg);
      toast.error("Baza danych", msg);
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await dbDeleteRow(table, deleteId);
      toast.success("Usunięto rekord", deleteId);
      setDeleteId(null);
      await loadRows(table);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Usuwanie nieudane";
      setError(msg);
      toast.error("Baza danych", msg);
    } finally {
      setDeleting(false);
    }
  }

  function rowId(row: Record<string, unknown>): string {
    if (typeof row.id === "string") return row.id;
    if (typeof row.key === "string") return row.key;
    return "";
  }

  return (
    <div className="animate-rise max-w-6xl space-y-6">
      <div>
        <p className="font-display text-sm tracking-[0.22em] text-brand uppercase">
          Narzędzia
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold uppercase">
          Baza danych
        </h1>
        <p className="mt-2 text-sm text-paper/55">
          Podgląd i edycja tabel managed (redb). Edycja users/logów — przez
          dedykowane API.
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

      <div className="flex flex-wrap gap-2">
        {tables.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTable(t)}
            className={
              table === t
                ? "border border-brand bg-brand/20 px-3 py-1.5 font-mono text-xs"
                : "border border-paper/20 px-3 py-1.5 font-mono text-xs text-paper/60"
            }
          >
            {t}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto border border-paper/10">
        <table className="w-full min-w-[40rem] text-left text-xs">
          <thead className="bg-paper/5 font-display tracking-[0.1em] text-paper/45 uppercase">
            <tr>
              <th className="px-3 py-2">Dane</th>
              <th className="px-3 py-2">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const id = rowId(row);
              return (
                <tr key={id || idx} className="border-t border-paper/10 align-top">
                  <td className="px-3 py-2">
                    <pre className="max-w-3xl overflow-x-auto whitespace-pre-wrap font-mono text-[11px] text-paper/75">
                      {JSON.stringify(row, null, 2)}
                    </pre>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        className="text-left underline-offset-2 hover:underline"
                        onClick={() => setEditJson(JSON.stringify(row, null, 2))}
                      >
                        Edytuj
                      </button>
                      {id ? (
                        <button
                          type="button"
                          className="text-left text-brand underline-offset-2 hover:underline"
                          onClick={() => setDeleteId(id)}
                        >
                          Usuń
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-3 py-6 text-paper/45">
                  Brak wierszy.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 border border-paper/10 p-4">
        <p className="font-display text-[11px] tracking-[0.14em] text-paper/45 uppercase">
          Upsert wiersza (JSON)
        </p>
        <textarea
          className="h-48 w-full border border-paper/20 bg-chrome/40 p-3 font-mono text-xs outline-none focus:border-brand"
          value={editJson}
          onChange={(e) => setEditJson(e.target.value)}
          placeholder='{"id":"…", ...}'
        />
        <button
          type="button"
          onClick={() => void saveRow()}
          className="bg-brand px-4 py-2 font-display text-xs tracking-[0.12em] uppercase"
        >
          Zapisz do {table || "…"}
        </button>
      </div>

      <Modal
        open={deleteId !== null}
        title="Usuń rekord"
        onClose={() => {
          if (!deleting) setDeleteId(null);
        }}
      >
        <p className="text-sm text-paper/70">
          Na pewno usunąć rekord z tabeli{" "}
          <span className="font-mono text-paper">{table}</span>?
        </p>
        <p className="mt-3 break-all font-mono text-xs text-paper/55">
          {deleteId}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={deleting}
            onClick={() => void confirmDelete()}
            className="bg-brand px-4 py-2 font-display text-xs tracking-[0.12em] text-paper uppercase disabled:opacity-50"
          >
            {deleting ? "Usuwanie…" : "Usuń"}
          </button>
          <button
            type="button"
            disabled={deleting}
            onClick={() => setDeleteId(null)}
            className="border border-paper/20 px-4 py-2 font-display text-xs tracking-[0.12em] text-paper/70 uppercase hover:border-paper/40 hover:text-paper disabled:opacity-50"
          >
            Anuluj
          </button>
        </div>
      </Modal>
    </div>
  );
}
