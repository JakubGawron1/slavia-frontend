import { type AttendanceViewStatus } from "@/lib/attendance-ui";
import { toDateKey } from "@/lib/calendar";
import type { CalendarEventFull } from "@/lib/events";

export type AttendanceRecordLocal = {
  id: string;
  user_id: string;
  display_name: string;
  checked_at: string;
  session_token: string;
  event_id?: string | null;
  status?: string;
  source?: string;
};

export type RosterAttendanceRow = {
  athleteId: string;
  displayName: string;
  status: AttendanceViewStatus | "none";
};

export type FormState = {
  id: string;
  title: string;
  event_type: "zawody" | "trening";
  date: string;
  end_date: string;
  time: string;
  location: string;
  description: string;
  assigned_athlete_ids: string[];
  plan_id: string;
  plan_week: string;
  plan_day: string;
};

export const emptyForm = (date?: string): FormState => ({
  id: "",
  title: "",
  event_type: "trening",
  date: date ?? toDateKey(new Date()),
  end_date: date ?? toDateKey(new Date()),
  time: "15:00",
  location: "ul. Konopnickiej 13, Ruda Śląska",
  description: "",
  assigned_athlete_ids: [],
  plan_id: "",
  plan_week: "",
  plan_day: "",
});

export type CtxMenu = {
  event: CalendarEventFull;
  x: number;
  y: number;
};

export type DialogState =
  | { kind: "cancel"; event: CalendarEventFull; note: string }
  | { kind: "delete"; event: CalendarEventFull }
  | { kind: "restore-force"; event: CalendarEventFull; message: string }
  | { kind: "schedule" };
