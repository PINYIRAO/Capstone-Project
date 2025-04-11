export function extractClassDate(classInfo: string): {
  startDateStr: string | null;
  endDateStr: string | null;
} {
  // extract the start date and end date
  const dateRegex: RegExp = /(\d{4}-\d{2}-\d{2}) - (\d{4}-\d{2}-\d{2})/;
  const dateMatch: string[] | null = classInfo.match(dateRegex);
  const startDateStr: string | null = dateMatch ? dateMatch[1] : null;
  const endDateStr: string | null = dateMatch ? dateMatch[2] : null;

  return { startDateStr, endDateStr };
}
