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
 * @description Get all courses.
 * @route GET /
 */

export const getAllCoursesForSchedule = async (
  userId: string,
  schedulePreferenceQuery: SchedulePreferenceQuery
): Promise<Course[]> => {
  // get the user's courses
  const courses: Course[] = await courseService.getAllCourses(
    undefined,
    undefined
  );
  let coursesResult: Course[] = courses.filter(
    (course) => course.userId == userId
  );
  if (coursesResult == undefined || coursesResult.length == 0) {
    throw new Error(
      "There is no course in the application, please upload the course information first."
    );
  }
};
