import type { Class } from "../../models/courseSectionModel";
import type { DeliveryType } from "../../models/courseSectionModel";
import { extractClassDays } from "./extractClassDays";
import { extractClassTime } from "./extractClassTime";
import { extractClassDate } from "./extractClassDate";
import { extractClassDeliveryType } from "./extractClassDeliveryType";
import { extractClassLocation } from "./extractClassLocation";

export function extractClassData(classInfo: string | null): Class[] | null {
  const classesInfo: Class[] = [];
  // console.log(classInfo);
  if (classInfo !== null) {
    // extract the day
    const days: string[] = extractClassDays(classInfo);

    // extract the start and end time
    const { startTimeStr, endTimeStr, startTime, endTime } =
      extractClassTime(classInfo);

    // extract the start date and end date
    const { startDateStr, endDateStr } = extractClassDate(classInfo);

    //  extract the delivery type :Lecture or Online
    const deliveryType: DeliveryType = extractClassDeliveryType(classInfo);

    // the reamining informationis the class location
    const location: string = extractClassLocation(
      classInfo,
      days,
      startTimeStr,
      endTimeStr,
      startDateStr,
      endDateStr,
      deliveryType
    );

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
        deliveryType,
        startTime,
        endTime,
        location,
      });
    });
  }
  return classesInfo;
}
