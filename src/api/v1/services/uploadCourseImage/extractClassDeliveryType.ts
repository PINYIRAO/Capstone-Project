import { DeliveryType } from "../../models/courseSectionModel";

export function extractClassDeliveryType(classInfo: string): DeliveryType {
  //  extract the delivery type :Lecture or Online
  const deliveryTypeRegex: RegExp = /(Lecture|Online)/;
  const lectureMatch: string[] | null = classInfo.match(deliveryTypeRegex);
  const deliveryType: DeliveryType =
    lectureMatch !== null && ["Online", "Lecture"].includes(lectureMatch[0])
      ? (lectureMatch[0] as "Online" | "Lecture")
      : "Hybrid";

  return deliveryType;
}
