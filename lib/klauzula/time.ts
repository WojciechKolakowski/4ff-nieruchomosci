export const TIME_ZONE = "Europe/Warsaw";

const formatter = new Intl.DateTimeFormat("pl-PL", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

export type WarsawTime = {
  /** "19.09.2026 14:32:07" */
  dateTime: string;
  /** "19.09.2026 14:32:07 (Europe/Warsaw)" */
  dateTimeWithZone: string;
  /** "2026-09-19_1432" — for file names */
  fileStamp: string;
};

export function formatWarsaw(date: Date): WarsawTime {
  const parts = Object.fromEntries(
    formatter.formatToParts(date).map((part) => [part.type, part.value])
  );
  const dateTime = `${parts.day}.${parts.month}.${parts.year} ${parts.hour}:${parts.minute}:${parts.second}`;
  return {
    dateTime,
    dateTimeWithZone: `${dateTime} (${TIME_ZONE})`,
    fileStamp: `${parts.year}-${parts.month}-${parts.day}_${parts.hour}${parts.minute}`,
  };
}
