/**
 * sort the schedules for schdule Controller (scheduleController.ts)
 *
 *
 */

import type { Course } from "../../models/courseModel";
import { SchedulePreferenceQuery } from "../../models/coursePreferenceModel";
/**
 * @description Get all available schedules.
 */

export const sortSchedules = (
  schedules: Course[][],
  schedulePreferenceQuery: SchedulePreferenceQuery
): { schedules: Course[][]; message: string } => {
  const { sortOptions } = schedulePreferenceQuery;
  const statistics: [number, number, number][] = [];

  // if there is no option then return the original schedules
  if (!sortOptions || sortOptions.length === 0) {
    return { schedules: schedules, message: "with no sort condition" };
  }
  // calc the daygotocampus and day attend the class in the morning
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
  }
  // sort
  for (const sortOption of [...sortOptions].reverse()) {
    if (sortOption === "dayGoToCampus") {
      statistics.sort((a, b) => a[1] - b[1]);
    } else if (sortOption === "dayAttendMorningClass") {
      statistics.sort((a, b) => a[2] - b[2]);
    }
  }
  // get the new schedules
  const newSchedules: Course[][] = [];
  for (const scheduleIndex of statistics) {
    newSchedules.push(schedules[scheduleIndex[0]]);
  }

  return { schedules: newSchedules, message: "Sort schedules successfully" };
};
