/**
 * Alias re-eksportujący najczęściej używane typy z wygenerowanego klienta Orval.
 * Import z tego pliku zamiast lokalnych definicji typów zapewnia spójność ze
 * schematem OpenAPI backendu.
 */
export type {
  PublicUser,
  Role,
  FeatureFlag,
  FlagKind,
  PublicFlag,
  LogLevel,
  SystemLog,
  SiteStats,
  AthleteStats,
  AthleteProfile,
  AttendanceRecord,
  AttendanceSession,
  CompetitionResult,
  ResultStatus,
  CmsPage,
  CmsBlock,
  CmsStatus,
  LoginRequest,
  LoginResponse,
  UpdateMeBody,
  UpdateUserBody,
  CreateUserBody,
  UpdateFlagBody,
  CreateResultBody,
  UpdateResultBody,
  ErrorBody,
  OkResponse,
  HealthResponse,
} from "./generated/models";
