import type { PublicFlag } from "@/lib/api/generated/models";
import { isFlagEnabled, UI_TOASTS_FLAG } from "@/lib/public-flags";

export const CLUB_CALENDAR_FLAG = "club_calendar";
export const ATHLETE_CALENDAR_FLAG = "athlete_calendar";
export const TRAINING_PLANS_FLAG = "training_plans";
export const TRAINING_RECORDS_FLAG = "training_exercise_records";
export const TRAINING_PLANS_AI_FLAG = "training_plans_ai";
export const LIFT_BAR_PATH_AI_FLAG = "lift_bar_path_ai";

export { isFlagEnabled, UI_TOASTS_FLAG };

export type PanelFlagList = PublicFlag[] | undefined;
