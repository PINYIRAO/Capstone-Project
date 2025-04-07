/**
 * schedule Controller (scheduleController.ts)
 *
 * This file defines functions (controllers) for handling incoming requests related to schedules.
 * These functions interact with the course service (courseService.ts) to perform schedule generate.
 */

import { Request, Response, NextFunction } from "express";
import { successResponse } from "../../models/responseModel";
import { HTTP_STATUS } from "../../../../constants/httpConstants";
import { getCoursesForSchedule } from "./getCoursesForSchedule";
import { calcSchedules } from "./calcSchedules";

const userId: string = "admin";

/**
 * @description Get all shedules.
 * @route GET /
 * @returns {Promise<void>}
 */
export const getAllSchedules = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // get the coures for schedule
    const { courses, message } = await getCoursesForSchedule(userId, req.query);
    if (courses.length === 0) {
      res.status(HTTP_STATUS.OK).json(successResponse([], message));
      return;
    }

    // get the available scheduls
    const { schedules, message: shceduleMsg } = calcSchedules(courses);
    if (schedules.length === 0) {
      res.status(HTTP_STATUS.OK).json(successResponse([], shceduleMsg));
      return;
    }

    //

    if (courses.length === 0) {
      res.status(HTTP_STATUS.OK).json(successResponse([], message));
      return;
    }
  } catch (error) {
    next(error);
  }
};
