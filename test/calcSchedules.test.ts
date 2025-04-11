import { testCourses } from "./data/testForSchedule";
import { testCoursesNoAvailable } from "./data/testForScheduleNotAvailable";
import { calcSchedules } from "../src/api/v1/services/scheduleCourse/calcSchedules";
import { testCoursesHasDuplicated } from "./data/testForScheduleHasDuplicatedCourse";
import { Course } from "src/api/v1/models/courseModel";

describe("get courses for schedule", () => {
  it("should throw an error if courses is empty", async () => {
    expect(() => calcSchedules([])).toThrow(/no courses/);
  });
  it("should throw an schedule due to the time conflict", async () => {
    const schedules: { schedules: Course[][]; message: string } =
      await calcSchedules(testCourses);

    expect(schedules.schedules.length).toBe(1);
  });
  it("should throw no schedule due to the time conflict", async () => {
    const schedules: { schedules: Course[][]; message: string } =
      await calcSchedules(testCoursesNoAvailable);

    expect(schedules.schedules.length).toBe(0);
  });
  it("should could handle the data if has duplicated course code", async () => {
    const schedules: { schedules: Course[][]; message: string } =
      await calcSchedules(testCoursesHasDuplicated);

    expect(schedules.schedules.length).toBe(0);
  });
});
