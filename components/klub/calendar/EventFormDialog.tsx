import { FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import type { AthleteProfile, TrainingPlan } from "@/lib/api/generated/models";
import type { FormState } from "@/components/klub/calendar/useStaffCalendar";
import {
  useListPanelFlags,
  useListPlans,
} from "@/lib/api/generated/default/default";
import { isFlagEnabled, TRAINING_PLANS_FLAG } from "@/lib/panel-flags";

const fieldClass =
  "mt-1 w-full border border-paper/20 bg-chrome/60 px-3 py-2 text-sm text-paper outline-none focus:border-brand";

export function EventFormDialog({
  form,
  formMode,
  activeAthletes,
  onChange,
  onSubmit,
  onClose,
}: {
  form: FormState | null;
  formMode: "create" | "edit";
  activeAthletes: AthleteProfile[];
  onChange: (form: FormState) => void;
  onSubmit: (e: FormEvent) => void;
  onClose: () => void;
}) {
  const flagsQuery = useListPanelFlags({ query: { staleTime: 60_000 } });
  const plansQuery = useListPlans(
    { status: "published" },
    {
      query: {
        enabled: isFlagEnabled(flagsQuery.data?.data, TRAINING_PLANS_FLAG),
      },
    },
  );
  const plans = (plansQuery.data?.data as TrainingPlan[] | undefined) ?? [];
  const plansOn = isFlagEnabled(flagsQuery.data?.data, TRAINING_PLANS_FLAG);

  return (
    <Modal
      open={!!form}
      title={formMode === "create" ? "Nowe wydarzenie" : "Edycja wydarzenia"}
      onClose={onClose}
      wide
    >
      {form ? (
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm text-paper/70 sm:col-span-2">
              Tytuł
              <input
                required
                className={fieldClass}
                value={form.title}
                onChange={(e) => onChange({ ...form, title: e.target.value })}
              />
            </label>
            <label className="text-sm text-paper/70">
              Typ
              <select
                className={fieldClass}
                value={form.event_type}
                onChange={(e) => {
                  const event_type = e.target.value as "zawody" | "trening";
                  onChange({
                    ...form,
                    event_type,
                    end_date:
                      event_type === "trening" ? form.date : form.end_date,
                  });
                }}
              >
                <option value="trening">Trening</option>
                <option value="zawody">Zawody</option>
              </select>
            </label>
            <label className="text-sm text-paper/70">
              Data rozpoczęcia
              <input
                type="date"
                required
                className={fieldClass}
                value={form.date}
                onChange={(e) => {
                  const date = e.target.value;
                  onChange({
                    ...form,
                    date,
                    end_date:
                      form.event_type === "trening" ||
                      !form.end_date ||
                      form.end_date < date
                        ? date
                        : form.end_date,
                  });
                }}
              />
            </label>
            {form.event_type === "zawody" ? (
              <label className="text-sm text-paper/70">
                Data zakończenia
                <input
                  type="date"
                  required
                  min={form.date}
                  className={fieldClass}
                  value={form.end_date || form.date}
                  onChange={(e) =>
                    onChange({ ...form, end_date: e.target.value })
                  }
                />
              </label>
            ) : null}
            <label className="text-sm text-paper/70">
              Godzina
              <input
                className={fieldClass}
                value={form.time}
                onChange={(e) => onChange({ ...form, time: e.target.value })}
              />
            </label>
            <label className="text-sm text-paper/70">
              Miejsce
              <input
                className={fieldClass}
                value={form.location}
                onChange={(e) =>
                  onChange({ ...form, location: e.target.value })
                }
              />
            </label>
            <label className="text-sm text-paper/70 sm:col-span-2">
              Opis
              <textarea
                className={fieldClass}
                rows={2}
                value={form.description}
                onChange={(e) =>
                  onChange({ ...form, description: e.target.value })
                }
              />
            </label>
          </div>
          {form.event_type === "zawody" ? (
            <fieldset className="space-y-2">
              <legend className="text-sm text-paper/70">Skład zawodników</legend>
              <div className="max-h-48 space-y-1 overflow-y-auto border border-paper/15 p-2">
                {activeAthletes.length === 0 ? (
                  <p className="px-1 py-2 text-sm text-paper/45">
                    Brak profili zawodników — dodaj je w Konta i profile.
                  </p>
                ) : (
                  activeAthletes.map((p) => {
                    const checked = form.assigned_athlete_ids.includes(p.id);
                    const noAccount = !p.user_id || p.user_id === "manual";
                    return (
                      <label
                        key={p.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            onChange({
                              ...form,
                              assigned_athlete_ids: checked
                                ? form.assigned_athlete_ids.filter(
                                    (x) => x !== p.id,
                                  )
                                : [...form.assigned_athlete_ids, p.id],
                            });
                          }}
                        />
                        <span>
                          {p.display_name}
                          {noAccount ? (
                            <span className="text-paper/40"> (bez konta)</span>
                          ) : null}
                        </span>
                      </label>
                    );
                  })
                )}
              </div>
            </fieldset>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-paper/50">
                Trening: automatycznie wszyscy zawodnicy.
              </p>
              {plansOn ? (
                <label className="text-sm text-paper/70">
                  Plan treningowy (opcjonalnie)
                  <select
                    className={fieldClass}
                    value={form.plan_id}
                    onChange={(e) =>
                      onChange({ ...form, plan_id: e.target.value })
                    }
                  >
                    <option value="">Bez przypięcia — auto z planu sezonu</option>
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="bg-brand px-4 py-2 font-display text-sm text-paper uppercase"
            >
              Zapisz
            </button>
            <button
              type="button"
              className="border border-paper/20 px-4 py-2 text-sm"
              onClick={onClose}
            >
              Anuluj
            </button>
          </div>
        </form>
      ) : null}
    </Modal>
  );
}
