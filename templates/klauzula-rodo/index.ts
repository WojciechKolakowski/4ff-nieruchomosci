import { version as v20260919 } from "./2026-09-19";

export type { ClauseVersion } from "./2026-09-19";

/** Every clause version ever approved (old ones stay here for reference). */
export const VERSIONS = { [v20260919.id]: v20260919 } as const;

/** The only version the app offers to clients. Change when a new one is approved. */
export const CURRENT_VERSION = v20260919;
