export function isDateRangeValid(
  date1: Date,
  date2: Date,
  rangeDays: number,
): boolean {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const diffInMs = Math.abs(date1.getTime() - date2.getTime());

  return diffInMs <= MS_PER_DAY * rangeDays;
}
