import type { PublicFlag } from "@/lib/api/generated/models";

/** Kalendarz publiczny `/kalendarz` */
export const PUBLIC_CALENDAR_FLAG = "public_calendar";
/** Globalne powiadomienia toast (witryna; w panelach ta sama flaga jest też w `/flags/panels`) */
export const UI_TOASTS_FLAG = "ui_toasts";

export function isFlagEnabled(
  flags: unknown,
  key: string,
  defaultWhenMissing = false,
): boolean {
  if (!Array.isArray(flags)) return true;
  const list = flags as PublicFlag[];
  const flag = list.find((f) => f.key === key);
  if (!flag) return defaultWhenMissing;
  return flag.enabled;
}
