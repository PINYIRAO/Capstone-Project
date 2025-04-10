import { extractClassData } from "../src/api/v1/controllers/course/extractClass";
import type { Class } from "../src/api/v1/models/courseSectionModel";
describe("extract class", () => {
  it("should return the classes array", () => {
    const classInfo: string =
      "T12:00 PM - 3:00 PM Roblin Centre (Prev. PSC),\\nPrincess Building PSCP312\\n2025-01-06 - 2025-04-25\\nLecture";
    const expectedClasses: Class[] = [
      {
        day: 2,
        deliveryType: "Lecture",
        startTime: 1200,
        endTime: 1500,
        location: "Roblin Centre (Prev. PSC), Princess Building PSCP312",
      },
    ];
    const actualClasses: Class[] = extractClassData(classInfo) as Class[];
    expect(actualClasses).toEqual(expectedClasses);
  });
  it("should transform the 12:00AM to 0", () => {
    const classInfo: string =
      "T12:00 AM - 3:00 AM Roblin Centre (Prev. PSC),\\nPrincess Building PSCP312\\n2025-01-06 - 2025-04-25\\nLecture";
    const expectedClasses: Class[] = [
      {
        day: 2,
        deliveryType: "Lecture",
        startTime: 0,
        endTime: 300,
        location: "Roblin Centre (Prev. PSC), Princess Building PSCP312",
      },
    ];
    const actualClasses: Class[] = extractClassData(classInfo) as Class[];
    expect(actualClasses).toEqual(expectedClasses);
  });
  it("should handle when can't get the day", () => {
    const classInfo: string =
      "Princess 12:00 AM - 3:00 AM Roblin Centre (Prev. PSC),\\nPrincess Building PSCP312\\n2025-01-06 - 2025-04-25\\nLecture";
    const expectedClasses: Class[] = [
      {
        day: 99,
        deliveryType: "Lecture",
        startTime: 0,
        endTime: 300,
        location: "Roblin Centre (Prev. PSC), Princess Building PSCP312",
      },
    ];
    const actualClasses: Class[] = extractClassData(classInfo) as Class[];
    expect(actualClasses).toEqual(expectedClasses);
  });
  it("should return the start time to be 0 when can't get the information", () => {
    const classInfo: string =
      "TE00 AM - 3:00 AM Roblin Centre (Prev. PSC),\\nPrincess Building PSCP312\\n2025-01-06 - 2025-04-25\\nLecture";
    const expectedClasses: Class[] = [
      {
        day: 99,
        deliveryType: "Lecture",
        startTime: 0,
        endTime: 0,
        location:
          "00 AM3:00 AM Roblin Centre (Prev. PSC), Princess Building PSCP312",
      },
    ];
    const actualClasses: Class[] = extractClassData(classInfo) as Class[];
    expect(actualClasses).toEqual(expectedClasses);
  });
});
