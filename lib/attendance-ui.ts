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

/** Etykiety statusów rekordu API (obecność QR / auto). */
export const ATTENDANCE_RECORD_STYLES: Record<
  string,
  { badge: string; label: string }
> = {
  present: ATTENDANCE_STYLES.present,
  absent: ATTENDANCE_STYLES.absent,
  pending_unauthorized: {
    badge: "bg-[#8a6a2f] text-paper",
    label: "Oczekuje",
  },
  rejected: {
    badge: ATTENDANCE_NONE_BADGE,
    label: "Odrzucone",
  },
};

export function attendanceRecordStyle(status: string | null | undefined): {
  badge: string;
  label: string;
} {
  const key = status || "present";
  return (
    ATTENDANCE_RECORD_STYLES[key] ?? {
      badge: ATTENDANCE_NONE_BADGE,
      label: key,
    }
  );
}

/** Czas klubowy — daty i godziny obecności zawsze w Europe/Warsaw. */
const CLUB_TIME_ZONE = "Europe/Warsaw";

const CLUB_DATE_FMT: Intl.DateTimeFormatOptions = {
  timeZone: CLUB_TIME_ZONE,
};

/** Czytelna data + godzina check-inu (Warszawa, nie TZ przeglądarki / UTC serwera). */
export function formatAttendanceCheckedAt(iso: string): {
  date: string;
  time: string;
} {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) {
      return { date: iso, time: "" };
    }
    let weekday = d.toLocaleDateString("pl-PL", {
      ...CLUB_DATE_FMT,
      weekday: "long",
    });
    if (weekday) {
      weekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
    }
    const rest = d.toLocaleDateString("pl-PL", {
      ...CLUB_DATE_FMT,
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const time = d.toLocaleTimeString("pl-PL", {
      ...CLUB_DATE_FMT,
      hour: "2-digit",
      minute: "2-digit",
    });
    return { date: `${weekday}, ${rest}`, time };
  } catch {
    return { date: iso, time: "" };
  }
}

export function formatAttendanceCheckedAtLabel(iso: string): string {
  const { date, time } = formatAttendanceCheckedAt(iso);
  return time ? `${date} ${time}` : date;
}

/** YYYY-MM-DD dnia skanu w Europe/Warsaw (nie prefiks UTC z ISO). */
export function attendanceDayKey(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return iso.slice(0, 10);
  }
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: CLUB_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

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
