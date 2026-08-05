import type { Role } from "@/lib/api/generated/models";

export const VIEW_AS_KEY = "slavia_klub_view_as";

export type ViewAsState = {
  userId: string;
  displayName: string;
  email: string;
  roles: Role[];
} | null;

export function readViewAs(): ViewAsState {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(VIEW_AS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ViewAsState;
  } catch {
    return null;
  }
}

export function readViewAsUserId(): string | null {
  return readViewAs()?.userId ?? null;
}

export function writeViewAs(value: ViewAsState) {
  if (typeof window === "undefined") return;
  if (value) {
    localStorage.setItem(VIEW_AS_KEY, JSON.stringify(value));
  } else {
    localStorage.removeItem(VIEW_AS_KEY);
  }
}

export function clearViewAsStorage() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(VIEW_AS_KEY);
}
