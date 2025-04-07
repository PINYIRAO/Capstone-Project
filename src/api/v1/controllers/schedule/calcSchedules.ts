/**
 * get all schedules for schdule Controller (scheduleController.ts)
 *
 * get all shedulets regarding the time conflich of the diffrenct courses
 * filter with userid
 * filter with elective course preference if have
 * filter with other preference option
 * return the courses for schedule
 *
 */

import type { Course } from "../../models/courseModel";
import { Section } from "../../models/courseSectionModel";

/**
 * @description Get all available schedules.
 */

export const calcSchedules = (
  courses: Course[]
): { schedules: Course[][]; message: string } => {
  const courseCount: number = courses.length;
  let availableSchedules: Course[][] = [];
  let initSchedulesFlag: boolean = false;
  if (!courses.length) {
    throw new Error("This is no courses meeting conditions for scheduling");
  }

  for (const course of courses) {
    // at the begin the schedule is empty, so for the first course,insert all sections into the schedult
    if (!initSchedulesFlag) {
      for (const section of course.courseSections) {
        availableSchedules.push([{ ...course, courseSections: [section] }]);
      }
      initSchedulesFlag = true;
      continue;
    }

    // for the other course to check the time conflict with the schedult
    for (const section of course.courseSections) {
      // if the vailable schedules has the course, then ignore
      // if the vailable  schedules doesn't have the course and there is no conflict, then push the course
      for (const availableSchedule of availableSchedules.slice()) {
        if (!calcTimeConflictFlag(availableSchedule, section)) {
          availableSchedule.push({ ...course, courseSections: [section] });
          availableSchedules.push(availableSchedule);
        }
      }
    }
  }

  // select the schedules have all courses should be scheduled
  availableSchedules = availableSchedules.filter(
    (availableSchedule) => availableSchedule.length === courseCount
  );

  // return the schedule
  if (availableSchedules.length === 0) {
    return { schedules: [], message: "There is no available schedule" };
  }
  return {
    schedules: availableSchedules,
    message: "get the schedule successfully",
  };
};

// calc the if there is confict when select new section
function calcTimeConflictFlag(courses: Course[], section: Section): boolean {
  for (const classObj of section.sectionSchedules) {
    for (const course of courses) {
      for (const selectedSection of course.courseSections) {
        for (const selectedClassObj of selectedSection.sectionSchedules) {
          if (
            !(
              classObj.day !== selectedClassObj.day ||
              classObj.startTime >= selectedClassObj.endTime ||
              classObj.endTime <= selectedClassObj.startTime
            )
          ) {
            return true;
          }
        }
      }
    }
  }
  return false;
}
