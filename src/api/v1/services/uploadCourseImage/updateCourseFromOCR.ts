import type { Course } from "../../models/courseModel";

import { HTTP_STATUS } from "../../../../constants/httpConstants";
import { getErrorCode, getErrorMessage } from "../../utils/errorUtils";

import {
  getAllCourses,
  createCourse,
  updateCourse,
} from "../courseDataService";
import { ServiceError } from "../../errors/errors";

export async function updateCourseFromOCR(
  uid: string,
  course: Partial<Course>
): Promise<void> {
  try {
    const courses: Course[] = await getAllCourses(
      uid,
      course.courseCode,
      course.courseName
    );

    if (courses.length == 0) {
      // if there is no record for this course current, then we create a new one
      await createCourse(uid, course);
    } else if (courses.length == 1) {
      // update the current course
      if (courses[0].id != undefined) {
        updateCourse(uid, courses[0].id, course);
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
