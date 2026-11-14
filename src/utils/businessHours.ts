// src/utils/businessHours.ts
/**
 * Business hours for display. The source is the `hours` array on the
 * contact-us entry that holds them (the same data the JSON-LD
 * `openingHoursSpecification` is built from in utils/schema/identity.ts), so
 * the footer and the schema can't disagree.
 *
 * Consecutive days with the same times collapse into one row:
 * all seven → "Every day", Monday–Friday → "Mon – Fri", one day → "Sat".
 */
import { getPublishedCollection } from "@/utils/collections";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export interface HoursRow {
  days: string;
  hours: string;
}

interface HoursSpec {
  dayOfWeek: string[];
  opens: string;
  closes: string;
}

/** "07:00" → "7 AM", "22:30" → "10:30 PM". */
function formatTime(time: string): string {
  const [h, m = "00"] = time.split(":");
  const hour = Number(h);
  const suffix = hour >= 12 && hour < 24 ? "PM" : "AM";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return m === "00" ? `${display} ${suffix}` : `${display}:${m} ${suffix}`;
}

const short = (day: string) => day.slice(0, 3);

export function groupHours(specs: HoursSpec[]): HoursRow[] {
  // The time label for each day, in Monday-first order (closed days stay unset).
  const byDay = new Map<string, string>();
  for (const spec of specs) {
    const label = `${formatTime(spec.opens)} – ${formatTime(spec.closes)}`;
    for (const day of spec.dayOfWeek) byDay.set(day, label);
  }

  const rows: { from: string; to: string; hours: string; count: number }[] = [];
  for (const day of DAYS) {
    const hours = byDay.get(day) ?? "Closed";
    const last = rows[rows.length - 1];
    if (last && last.hours === hours) {
      last.to = day;
      last.count++;
    } else {
      rows.push({ from: day, to: day, hours, count: 1 });
    }
  }

  if (rows.length === 1 && rows[0].hours !== "Closed") {
    return [{ days: "Every day", hours: rows[0].hours }];
  }
  return rows.map((r) => ({
    days: r.count === 1 ? short(r.from) : `${short(r.from)} – ${short(r.to)}`,
    hours: r.hours,
  }));
}

export async function getBusinessHours(): Promise<HoursRow[]> {
  const contacts = await getPublishedCollection("contact-us");
  const specs = (contacts as any[]).find((c) => c.data?.hours?.length)?.data.hours ?? [];
  return specs.length ? groupHours(specs) : [];
}
