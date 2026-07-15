import { describe, expect, it } from "vitest";
import { formatRelativeDate, isOverdue, relativeDays } from "../relative-date";

const now = new Date(2026, 6, 9, 12, 0, 0);

describe("relativeDays", () => {
  it("counts whole calendar days forward", () => {
    expect(relativeDays("2026-09-08", now)).toBe(61);
  });

  it("counts whole calendar days backward as negative", () => {
    expect(relativeDays("2026-06-08", now)).toBe(-31);
  });

  it("is zero on the same calendar day regardless of time", () => {
    expect(relativeDays("2026-07-09T23:30:00", now)).toBe(0);
  });

  it("reads a bare date as a calendar date, not a UTC instant", () => {
    expect(relativeDays("2026-07-10", now)).toBe(1);
  });

  it("is unaffected by the hour of `now`", () => {
    expect(relativeDays("2026-07-10", new Date(2026, 6, 9, 0, 30, 0))).toBe(1);
    expect(relativeDays("2026-07-10", new Date(2026, 6, 9, 23, 30, 0))).toBe(1);
  });
});

describe("formatRelativeDate", () => {
  it("formats a future date in French", () => {
    expect(formatRelativeDate("2026-09-08", now)).toBe("dans 61 jours");
  });

  it("formats a past date in French", () => {
    expect(formatRelativeDate("2026-06-08", now)).toBe("il y a 31 jours");
  });

  it("uses the natural word for today", () => {
    expect(formatRelativeDate("2026-07-09", now)).toBe("aujourd’hui");
  });

  it("uses the natural word for tomorrow", () => {
    expect(formatRelativeDate("2026-07-10", now)).toBe("demain");
  });
});

describe("isOverdue", () => {
  it("is true strictly before today", () => {
    expect(isOverdue("2026-07-08", now)).toBe(true);
  });

  it("is false today", () => {
    expect(isOverdue("2026-07-09", now)).toBe(false);
  });

  it("is false in the future", () => {
    expect(isOverdue("2026-07-10", now)).toBe(false);
  });
});
