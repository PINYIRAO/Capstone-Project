import type { Class } from "../models/courseSectionModel";
import type { DeliveryType } from "../models/courseSectionModel";

export function extractClassData(classInfo: string | null): Class[] | null {
  const classesInfo: Class[] = [];
  if (classInfo !== null) {
    // extract the day
    const daysRegex: RegExp = /^(\\n)?([A-Za-z/]+)/;
    // const daysRegex: RegExp =       /^.*?(\\n)?([A-Za-z/]+)\s+\d{1,2}:\d{2}\s*[AP]M\s*-\s*\d{1,2}:\d{2}\s*[AP]M/;
    const daysMatch: string[] | null = classInfo.match(daysRegex);
    const days: string[] = daysMatch ? daysMatch[2].split("/") : [];

    // extract the start and end time
    const timeRegex: RegExp =
      /(\d{1,2}:\d{2} (AM|PM)) - (\d{1,2}:\d{2} (AM|PM))/;
    const timeMatch: string[] | null = classInfo.match(timeRegex);
    const startTimeStr: string = timeMatch ? timeMatch[1] : "";
    const endTimeStr: string = timeMatch ? timeMatch[3] : "";
    const startTime: number = convertTo24Hour(startTimeStr)
      ? convertTo24Hour(startTimeStr)
      : 0;
    const endTime: number = convertTo24Hour(endTimeStr)
      ? convertTo24Hour(endTimeStr)
      : 0;
    // extract the start date and end date
    const dateRegex: RegExp = /(\d{4}-\d{2}-\d{2}) - (\d{4}-\d{2}-\d{2})/;
    const dateMatch: string[] | null = classInfo.match(dateRegex);
    const startDateStr: string | null = dateMatch ? dateMatch[1] : null;
    const endDateStr: string | null = dateMatch ? dateMatch[2] : null;

    //  extract the delivery type :Lecture or Online
    const lectureTypeRegex: RegExp = /(Lecture|Online)/;
    const lectureMatch: string[] | null = classInfo.match(lectureTypeRegex);
    const lectureType: DeliveryType =
      lectureMatch !== null && ["Online", "Lecture"].includes(lectureMatch[0])
        ? (lectureMatch[0] as "Online" | "Lecture")
        : "Mixed";

    // the reamining informationis the class location
    let location: string = classInfo
      .replace(`${days.join("/")}`, "")
      .replace(`${startTimeStr} - ${endTimeStr}`, "")
      .replace(`${startDateStr} - ${endDateStr}`, "")
      .replace(lectureType, "")
      .trim();

    location = location.replace(/\\n/g, " ").trim(); // replace the \\n to a space to concatenate the string

    // define a obj for day convertion
    const dayMapping: { [key: string]: number } = {
      Sun: 0,
      M: 1, // Monday
      T: 2, // Tuesday
      W: 3, // Wednesday
      Th: 4, // Thursday
      F: 5, // Friday
      Sat: 6, // Saturday
    };
    // create the class info
    days.forEach((day) => {
      classesInfo.push({
        // if the day couldn't get right, then set the default for 99
        day: day in dayMapping ? dayMapping[day] : 99,
        lectureType,
        startTime,
        endTime,
        location,
      });
    });
  }
  return classesInfo;
}

// convert the time
const convertTo24Hour = (time: string): number => {
  const [hourMin, period] = time.split(" ");
  const [hour, minute] = hourMin.split(":").map(Number);
  let newHour: number = hour;

  if (period === "PM" && hour !== 12) {
    newHour = hour + 12;
  }
  if (period === "AM" && hour === 12) {
    newHour = 0;
  }

  // sometimes OCR can't get the corret time, just is a empty string
  // to aviod the consequence error, return 0 here
  if (isNaN(newHour * 100 + minute)) {
    return 0;
  }

  return newHour * 100 + minute; // convert 3:00 PM into 1500 format
};
