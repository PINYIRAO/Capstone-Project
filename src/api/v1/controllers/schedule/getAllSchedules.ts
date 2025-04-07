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

import * as courseService from "../../services/courseService";
import type { Course } from "../../models/courseModel";
import type { SchedulePreferenceQuery } from "../../models/coursePreferenceModel";
import { Section } from "../../models/courseSectionModel";

/**
 * @description Get all available schedules.
 */

export const getAllSchedules = (courses: Course[]): Course[] => {
  const courseCount: number = courses.length;
  const availableSchedules: Course[][] = [];
  let initSchedulesFlag = false;
  if (!courses.length) {
    throw new Error("This is no courses meeting conditions for scheduling");
  }

  for (const course of courses) {
    // at the begin the schedule is empty, so for the first course,insert all sections into the schedult
    if (!initSchedulesFlag) {
      for (const section of course.courseSections) {
        availableSchedules.push({ ...course, courseSections: [section] });
      }
    }

    for (const section of course.courseSections) {
      // if the vailable schedules has the course, then ignore
      // if the vailable  schedules doesn't have the course and there is no conflict, then push the course

      if (!calcTimeConflictFlag(availableSchedules, section)) {
        availableSchedules.push(course);
      }
    }
  }
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
