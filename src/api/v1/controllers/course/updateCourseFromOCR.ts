import type { Course } from "../../models/courseModel";

import { HTTP_STATUS } from "../../../../constants/httpConstants";
import { getErrorCode, getErrorMessage } from "../../utils/errorUtils";

import {
  getAllCourses,
  createCourse,
  updateCourse,
} from "../../services/courseService";
import { ServiceError } from "../../errors/errors";

export async function updateCourseFromOCR(
  course: Partial<Course>,
  userId: string
): Promise<void> {
  try {
    let courses: Course[] = await getAllCourses(
      course.courseCode,
      course.courseName
    );

    // filter the course with userId
    courses = courses.filter((v, _i) => v.userId == userId);

    if (courses.length == 0) {
      // if there is no record for this course current, then we create a new one
      await createCourse(course);
    } else if (courses.length == 1) {
      // update the current course
      if (courses[0].id != undefined) {
        updateCourse(courses[0].id, course);
      }
    } else {
      throw new ServiceError(
        "The system has more than one records for this course",
        "DATA_ERROR",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  } catch (err) {
    throw new ServiceError(
      getErrorMessage(err),
      getErrorCode(err),
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
  return;
}
