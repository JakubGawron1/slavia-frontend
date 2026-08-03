/** Kolory i etykiety obecności w kalendarzu (treningi). */

export type AttendanceViewStatus = "present" | "absent" | "withdrawn";

export const ATTENDANCE_STYLES: Record<
  AttendanceViewStatus,
  { badge: string; dot: string; label: string }
> = {
  present: {
    badge: "bg-[#2f6b4f] text-paper",
    dot: "bg-[#2f6b4f]",
    label: "Obecny",
  },
  absent: {
    badge: "bg-[#8b3a3a] text-paper",
    dot: "bg-[#8b3a3a]",
    label: "Nieobecny",
  },
  withdrawn: {
    badge: "bg-[#8a6a2f] text-paper",
    dot: "bg-[#8a6a2f]",
    label: "Zrezygnował",
  },
};

export const ATTENDANCE_NONE_BADGE = "bg-paper/15 text-paper/60";
export const ATTENDANCE_NONE_LABEL = "Brak wpisu";

/** Frekwencja w siatce kadry: obecni / oczekiwani. */
export type AttendanceCountsTone = "full" | "partial" | "zero" | "empty";

export function attendanceCountsTone(
  present: number,
  expected: number,
): AttendanceCountsTone {
  if (expected <= 0) return "empty";
  if (present <= 0) return "zero";
  if (present >= expected) return "full";
  return "partial";
}

export const ATTENDANCE_COUNTS_CHIP: Record<
  Exclude<AttendanceCountsTone, "empty">,
  string
> = {
  full: "bg-[#2f6b4f] text-paper",
  partial: "bg-[#8a6a2f] text-paper",
  zero: "bg-[#8b3a3a] text-paper",
};

export function parseAttendanceStatus(
  raw: string | null | undefined,
): AttendanceViewStatus | undefined {
  if (raw === "present" || raw === "absent" || raw === "withdrawn") {
    return raw;
  }
  return undefined;
}
