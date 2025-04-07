/**
 * sort the schedules for schdule Controller (scheduleController.ts)
 *
 *
 */

import type { Course } from "../../models/courseModel";
import { SchedulePreferenceQuery } from "../../models/coursePreferenceModel";
import { SortOptions } from "../../models/coursePreferenceModel";
/**
 * @description Get all available schedules.
 */

type SortedSchedule = {
  baseInfo: {
    count: number;
    sortOptions?: SortOptions;
    daysGoToCampus?: number;
    daysAttendMorningClass?: number;
  };
  schedule: Course[];
};
type SortedSchedules = SortedSchedule[];
export const sortSchedules = (
  schedules: Course[][],
  schedulePreferenceQuery: SchedulePreferenceQuery
): { schedules: SortedSchedules; message: string } => {
  const { sortOptions } = schedulePreferenceQuery;
  const statistics: [number, number, number][] = [];

  const withBaseInfoSchedules: SortedSchedules = [];
  // calc the daysGoToCampus and day attend the class in the morning
  for (const [index, schedule] of schedules.entries()) {
    type Statistic = {
      goToCampus: Set<number>;
      attendMorningClass: Set<number>;
    };
    const statistic: Statistic = {
      goToCampus: new Set<number>(),
      attendMorningClass: new Set<number>(),
    };
    for (const course of schedule) {
      for (const section of course.courseSections) {
        for (const classObj of section.sectionSchedules) {
          if (classObj.lectureType === "Lecture") {
            statistic.goToCampus.add(classObj.day);
          }
          if (classObj.startTime < 1000) {
            statistic.attendMorningClass.add(classObj.day);
          }
        }
      }
    }
    statistics.push([
      index,
      statistic.goToCampus.size,
      statistic.attendMorningClass.size,
    ]);
    withBaseInfoSchedules.push({
      baseInfo: {
        count: schedules.length,
        sortOptions,
        daysGoToCampus: statistic.goToCampus.size,
        daysAttendMorningClass: statistic.attendMorningClass.size,
      },
      schedule: schedule,
    });
  }

  // if there is no option then return the original schedules
  if (!sortOptions || sortOptions.length === 0) {
    return {
      schedules: withBaseInfoSchedules,
      message: "with no sort condition",
    };
  }

  // sort
  for (const sortOption of [...sortOptions].reverse()) {
    if (sortOption === "daysGoToCampus") {
      statistics.sort((a, b) => a[1] - b[1]);
    } else if (sortOption === "daysAttendMorningClass") {
      statistics.sort((a, b) => a[2] - b[2]);
    }
    console.log(JSON.stringify(statistics, null, 2));
    console.log(JSON.stringify(sortOptions, null, 2));
  }
  // get the new schedules
  const sortedWithBaseInfoSchedules: SortedSchedules = [];
  for (const scheduleIndex of statistics) {
    sortedWithBaseInfoSchedules.push(withBaseInfoSchedules[scheduleIndex[0]]);
  }

  return {
    schedules: sortedWithBaseInfoSchedules,
    message: "Get sorted schedules successfully",
  };
};
