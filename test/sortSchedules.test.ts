import { testSchedulesForSort } from "./data/testSchedulesForSort";
import { sortSchedules } from "../src/api/v1/controllers/schedule/sortSchedules";
import { SortedSchedule } from "src/api/v1/models/sortSchedule";

describe("get courses for schedule", () => {
  it("should throw an error if courses is empty", async () => {
    const actualSortedSchedules: {
      schedules: SortedSchedule[];
      message: string;
    } = sortSchedules(testSchedulesForSort, {
      sortOptions: [],
    });

    expect(actualSortedSchedules.message).toMatch(/with no sort condition/);
  });
  it("should sorted by the options if have", async () => {
    const actualSortedSchedules: {
      schedules: SortedSchedule[];
      message: string;
    } = sortSchedules(testSchedulesForSort, {
      sortOptions: ["daysGoToCampus", "daysAttendMorningClass"],
    });

    expect(actualSortedSchedules.schedules.length).toBe(2);
    expect(actualSortedSchedules.schedules[0].baseInfo.daysGoToCampus).toBe(1);
  });
});
