import { convertTo24Hour } from "./convertTo24Hour";
export function extractClassTime(classInfo: string): {
  startTimeStr: string;
  endTimeStr: string;
  startTime: number;
  endTime: number;
} {
  // extract the start and end time
  const timeRegex: RegExp = /(\d{1,2}:\d{2} (AM|PM)) - (\d{1,2}:\d{2} (AM|PM))/;
  const timeMatch: string[] | null = classInfo.match(timeRegex);
  const startTimeStr: string = timeMatch ? timeMatch[1] : "";
  const endTimeStr: string = timeMatch ? timeMatch[3] : "";
  const startTime: number = convertTo24Hour(startTimeStr)
    ? convertTo24Hour(startTimeStr)
    : 0;
  const endTime: number = convertTo24Hour(endTimeStr)
    ? convertTo24Hour(endTimeStr)
    : 0;

  return { startTimeStr, endTimeStr, startTime, endTime };
}
