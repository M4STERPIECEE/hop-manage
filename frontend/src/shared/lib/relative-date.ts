const MS_PER_DAY = 86_400_000;

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

const formatter = new Intl.RelativeTimeFormat("fr", { numeric: "auto" });

const localDay = (date: Date): number =>
  Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());

const targetDay = (target: string): number => {
  if (!DATE_ONLY.test(target)) return localDay(new Date(target));
  const [year, month, day] = target.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
};

export function relativeDays(target: string, now: Date = new Date()): number {
  return Math.round((targetDay(target) - localDay(now)) / MS_PER_DAY);
}

export function formatRelativeDate(
  target: string,
  now: Date = new Date(),
): string {
  return formatter.format(relativeDays(target, now), "day");
}

export function isOverdue(target: string, now: Date = new Date()): boolean {
  return relativeDays(target, now) < 0;
}
