import type { ReactNode } from "react";
import type {
  ExerciseRecordKind,
  LibraryExercise,
} from "@/lib/api/generated/models";
import { PLAN_FIELD } from "@/lib/plans/labels";

export type RecordFormValues = {
  exerciseId: string;
  kg: string;
  reps: string;
  date: string;
  kind: ExerciseRecordKind;
};

export function RecordFormFields({
  library,
  values,
  onChange,
  leading,
  trailing,
}: {
  library: LibraryExercise[];
  values: RecordFormValues;
  onChange: (patch: Partial<RecordFormValues>) => void;
  leading?: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <>
      {leading}
      <label className="text-sm text-paper/70">
        Ćwiczenie
        <select
          className={PLAN_FIELD}
          value={values.exerciseId}
          onChange={(e) => onChange({ exerciseId: e.target.value })}
        >
          <option value="">Wybierz</option>
          {library.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm text-paper/70">
        kg
        <input
          className={PLAN_FIELD}
          value={values.kg}
          onChange={(e) => onChange({ kg: e.target.value })}
          inputMode="decimal"
        />
      </label>
      <label className="text-sm text-paper/70">
        Powtórzenia
        <select
          className={PLAN_FIELD}
          value={values.reps}
          onChange={(e) => onChange({ reps: e.target.value })}
        >
          <option value="1">1 RM</option>
          <option value="3">3 RM</option>
          <option value="5">5 RM</option>
        </select>
      </label>
      <label className="text-sm text-paper/70">
        Data
        <input
          type="date"
          className={PLAN_FIELD}
          value={values.date}
          onChange={(e) => onChange({ date: e.target.value })}
        />
      </label>
      <label className="text-sm text-paper/70">
        Rodzaj
        <select
          className={PLAN_FIELD}
          value={values.kind}
          onChange={(e) =>
            onChange({ kind: e.target.value as ExerciseRecordKind })
          }
        >
          <option value="test">Test</option>
          <option value="training">Trening</option>
        </select>
      </label>
      {trailing}
    </>
  );
}
