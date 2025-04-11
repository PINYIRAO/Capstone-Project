export function extractClassDays(classInfo: string): string[] {
  // extract the day
  const daysRegex: RegExp = /^(\\n)?([A-Za-z/]+)/;
  // const daysRegex: RegExp =       /^.*?(\\n)?([A-Za-z/]+)\s+\d{1,2}:\d{2}\s*[AP]M\s*-\s*\d{1,2}:\d{2}\s*[AP]M/;
  const daysMatch: string[] | null = classInfo.match(daysRegex);
  const days: string[] = daysMatch ? daysMatch[2].split("/") : [];

  return days;
}
