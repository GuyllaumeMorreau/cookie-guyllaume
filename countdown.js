export function remainingDays(date, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
    throw new Error("Use a YYYY-MM-DD reunion date");
  const [year, month, day] = date.split("-").map(Number);
  const target = new Date(Date.UTC(year, month - 1, day));
  if (target.toISOString().slice(0, 10) !== date)
    throw new Error("Invalid reunion date");
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const get = (type) => Number(parts.find((part) => part.type === type).value);
  const today = Date.UTC(get("year"), get("month") - 1, get("day"));
  return Math.max(0, Math.round((target.getTime() - today) / 86400000));
}
export function thaiDate(date) {
  return new Intl.DateTimeFormat("th-TH-u-ca-gregory", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(new Date(`${date}T12:00:00+01:00`));
}
