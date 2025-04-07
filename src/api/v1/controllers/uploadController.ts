/**
 * Upload Controller (uploadController.ts)
 *
 * This file defines functions (controllers) for handling the upload course screenshots.
 * These functions interact with the course service (courseService.ts) to perform the actual
 * logic for creating and updating operations on courses.
 */

import { Request, Response, NextFunction } from "express";
import type { Course } from "../models/courseModel";
import { errorResponse, successResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import type { Section } from "../models/courseSectionModel";
import { ocrEachFile } from "./ocrEachFile";
import { extractSectionData } from "./extractSection";
import { updateCourseFromOCR } from "./updateCourseFromOCR";
import { transSectionToCourse } from "./transSectionToCourse";

// asssumed the overall const for course data, need to refactored in the following steps
const userId: string = "uploadtest";

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
      // get the course from the images
      let sectionsObj: Section[] = [];
      let courses: Partial<Course>[] = [];
      if (Array.isArray(req.files)) {
        for (const file of req.files) {
          // get section data from each image file
          const sectionsObjTemp: Section[] | null = extractSectionData(
            // oce each file, get the text
            await ocrEachFile(file)
          );
          // concatenate the sections information all together
          if (sectionsObjTemp !== null) {
            sectionsObj = sectionsObj.concat(sectionsObjTemp);
          }
        }
      }
      // change the sections info to course structure
      if (sectionsObj.length !== 0) {
        // trans the section information to course structure
        courses = transSectionToCourse(sectionsObj);
        // console.log(JSON.stringify(courses, null, 2));
        // update the course
        for (const courseObj of courses) {
          // update the firestore course information using the course info from OCR
          await updateCourseFromOCR(courseObj, userId);
        }
      }

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
