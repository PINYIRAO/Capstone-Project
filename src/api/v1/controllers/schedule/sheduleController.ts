/**
 * schedule Controller (scheduleController.ts)
 *
 * This file defines functions (controllers) for handling incoming requests related to schedules.
 * These functions interact with the course service (courseService.ts) to perform schedule generate.
 */

import { Request, Response, NextFunction } from "express";
import * as courseService from "../../services/courseService";
import type { Course } from "../../models/courseModel";
import { successResponse } from "../../models/responseModel";
import { HTTP_STATUS } from "../../../../constants/httpConstants";

type CourseQueryParams = {
  courseCode?: string;
  courseName?: string;
};

/**
 * @description Get all courses.
 * @route GET /
 * @returns {Promise<void>}
 */
export const getAllCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { courseCode, courseName }: CourseQueryParams = req.query;
    const courses: Course[] = await courseService.getAllCourses(
      courseCode !== undefined ? courseCode : undefined,
      courseName !== undefined ? courseName : undefined
    );

    res
      .status(HTTP_STATUS.OK)
      .json(successResponse(courses, "Course Retrieved"));
  } catch (error) {
    next(error);
  }
};
