const WEEKDAY_LABELS = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"] as const;

const MONTH_LABELS = [
  "Styczeń",
  "Luty",
  "Marzec",
  "Kwiecień",
  "Maj",
  "Czerwiec",
  "Lipiec",
  "Sierpień",
  "Wrzesień",
  "Październik",
  "Listopad",
  "Grudzień",
] as const;

export function getWeekdayLabels() {
  return WEEKDAY_LABELS;
}

export function getMonthLabel(year: number, monthIndex: number): string {
  return `${MONTH_LABELS[monthIndex]} ${year}`;
}

/** YYYY-MM-DD w lokalnej strefie (bez przesunięcia UTC). */
export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseDateKey(key: string): string {
  const date = parseDateKeyToDate(key);
  const weekday = date.toLocaleDateString("pl-PL", { weekday: "long" });
  const rest = date.toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return `${weekday}, ${rest}`;
}

function parseDateKeyToDate(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatPolishDate(key: string): string {
  return parseDateKey(key);
}

export type CalendarCell = {
  key: string;
  day: number;
  inMonth: boolean;
};

/** Siatka miesiąca: poniedziałek jako pierwszy dzień tygodnia (6 wierszy). */
export function buildMonthGrid(year: number, monthIndex: number): CalendarCell[] {
  const first = new Date(year, monthIndex, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const daysInPrev = new Date(year, monthIndex, 0).getDate();

  const cells: CalendarCell[] = [];

  for (let i = 0; i < startOffset; i++) {
    const day = daysInPrev - startOffset + i + 1;
    const date = new Date(year, monthIndex - 1, day);
    cells.push({ key: toDateKey(date), day, inMonth: false });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, monthIndex, day);
    cells.push({ key: toDateKey(date), day, inMonth: true });
  }

  let nextDay = 1;
  while (cells.length < 42) {
    const date = new Date(year, monthIndex + 1, nextDay);
    cells.push({ key: toDateKey(date), day: nextDay, inMonth: false });
    nextDay += 1;
  }

  return cells;
}

export function shiftMonth(
  year: number,
  monthIndex: number,
  delta: number,
): { year: number; monthIndex: number } {
  const date = new Date(year, monthIndex + delta, 1);
  return { year: date.getFullYear(), monthIndex: date.getMonth() };
}
