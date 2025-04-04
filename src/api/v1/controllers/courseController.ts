/**
 * Course Controller (courseController.ts)
 *
 * This file defines functions (controllers) for handling incoming requests related to courses.
 * These functions interact with the course service (courseService.ts) to perform the actual
 * logic for CRUD operations on courses.
 */

import { Request, Response, NextFunction } from "express";
import * as courseService from "../services/courseService";
import type { Course } from "../models/courseModel";
import { successResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";

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

/**
 * @description get an existing course by id.
 * @route get /:id
 * @returns {Promise<void>}
 */
export const getCourseById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // call the courseService by passing the id from thge url path and the body of the request
    const course: Course = await courseService.getCourseById(req.params.id);

    res.status(HTTP_STATUS.OK).json(successResponse(course, "Course Found"));
  } catch (error) {
    next(error);
  }
};

/**
 * @description Create a new course.
 * @route POST /
 * @returns {Promise<void>}
 */
export const createCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // call the courseService by passing the body of the request
    const newCourse: Course = await courseService.createCourse(req.body);

    res
      .status(HTTP_STATUS.CREATED)
      .json(successResponse(newCourse, "Course Created"));
  } catch (error) {
    next(error);
  }
};

/**
 * @description Update an existing course.
 * @route PUT /:id
 * @returns {Promise<void>}
 */
export const updateCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // call the courseService by passing the id from thge url path and the body of the request
    const updatedCourse: Course = await courseService.updateCourse(
      req.params.id,
      req.body
    );

    res
      .status(HTTP_STATUS.OK)
      .json(successResponse(updatedCourse, "Course Updated"));
  } catch (error) {
    next(error);
  }
};

/**
 * @description Delete an course.
 * @route DELETE /:id
 * @returns {Promise<void>}
 */
export const deleteCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await courseService.deleteCourse(req.params.id);

    res.status(HTTP_STATUS.OK).json(successResponse(null, "Course Deleted"));
  } catch (error) {
    next(error);
  }
};
