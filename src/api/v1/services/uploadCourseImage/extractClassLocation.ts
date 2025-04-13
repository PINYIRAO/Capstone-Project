import { DeliveryType } from "../../models/courseSectionModel";

export function extractClassLocation(
  classInfo: string,
  days: string[],
  startTimeStr: string,
  endTimeStr: string,
  startDateStr: string | null,
  endDateStr: string | null,
  deliveryType: DeliveryType
): string {
  // the reamining informationis the class location
  let location: string = classInfo
    .replace(`${days.join("/")}`, "")
    .replace(`${startTimeStr} - ${endTimeStr}`, "")
    .replace(`${startDateStr} - ${endDateStr}`, "")
    .replace(deliveryType, "")
    .trim();
  // replace the \\n to a space to concatenate the string
  location = location.replace(/\\n/g, " ").trim(); // replace the \\n to a space to concatenate the string
  return location;
}
