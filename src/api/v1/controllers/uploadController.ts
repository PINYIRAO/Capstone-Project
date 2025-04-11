/**
 * Upload Controller (uploadController.ts)
 *
 * This file defines functions (controllers) for handling the upload course screenshots.
 * These functions interact with the course service (courseDataService.ts) to perform the actual
 * logic for creating and updating operations on courses.
 */

import { Request, Response, NextFunction } from "express";
import type { Course } from "../models/courseModel";
import { errorResponse, successResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { uploadService } from "../services/uploadCourseImage/uploadService";

/**
 * @description Get the course information and then create or update the course.
 * @route GET /
 * @returns {Promise<void>}
 */
export const uploadCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // make sure the user attached the files
  if (!req.files || Object.keys(req.files).length == 0) {
    res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json(errorResponse("This is no course files attached"));
    return;
  } else {
    try {
      // get the courses inforatmion and update
      let courses: Partial<Course>[] = [];
      courses = await uploadService(req.files);

      if (courses.length == 0) {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(
            errorResponse("Course information not found", "GET_NON_COURSE")
          );
      } else {
        res
          .status(HTTP_STATUS.OK)
          .json(successResponse(courses, "Course updated by OCR"));
      }
      return;
    } catch (error) {
      next(error);
    }
  }
};
