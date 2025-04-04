/**
 * Upload Controller (uploadController.ts)
 *
 * This file defines functions (controllers) for handling the upload course screenshots.
 * These functions interact with the course service (courseService.ts) to perform the actual
 * logic for creating and updating operations on courses.
 */

import { Request, Response, NextFunction } from "express";
import * as courseService from "../services/courseService";
import type { Course } from "../models/courseModel";
import { errorResponse, successResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import tesseract from "tesseract.js";
import { getErrorMessage } from "../utils/errorUtils";
import type { Section } from "../models/courseSectionModel";

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
  if (!req.files || req.files.length == 0) {
    res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json(errorResponse("This is no course files attached"));
    return;
  } else {
    try {
      if (Array.isArray(req.files)) {
        for (const file of req.files) {
          extractSectionData(await ocrEachFile(file));
        }
      }

      res.status(HTTP_STATUS.OK).json(successResponse(null, "Course updated"));
      return;
    } catch (error) {
      next(error);
    }
  }
};

// do OCR for each file
async function ocrEachFile(file: Express.Multer.File): Promise<string | null> {
  try {
    const data: tesseract.RecognizeResult = await tesseract.recognize(
      file.path,
      "eng"
    );
    return data.data.text.replace(/\n/g, "\\n") || null;
  } catch (err) {
    throw new Error(
      `Error during OCR the file ${file.filename}: ${getErrorMessage(err)}`
    );
  }
}

// organize the ocr text to the structured course data
function extractSectionData(inputText: string | null): Partial<Course> | null {
  if (inputText == null) {
    return null;
  } else {
    // first split the text by section sector
    // Example data
    // [
    //   'COMP-3018-FTE01 Add Section to Schedule\\nBack-End Development\\nRuns from 2025-01-06 - 2025-04-25\\nSeats @) Times Locations Instructors\\n4/35/0 T12:00 PM - 3:00 PM Roblin Centre (Prev. PSC), Shabaga, D (Lecture, Online)\\nPrincess Building PSCP312\\n2025-01-06 - 2025-04-25\\nLecture\\nW 1:00 PM - 4:00 PM Roblin Centre (Prev. PSC)\\n2025-01-06 - 2025-04-25 Online\\n'
    // ]
    // [
    //   'COMP-3018-FTE02 Add Section to Schedule\\nBack-End Development\\nRuns from 2025-01-06 - 2025-04-25\\nSeats ® Times Locations Instructors\\n0/35/0 Roblin Centre (Prev. PSC), Bialowas, M (Lecture,\\nM 8:00 AM -11:00 AM Innovation Centre INNE239 Online)\\n2025-01-06 - 2025-04-25\\nLecture\\nTh 2:00 PM - 5:00 PM Roblin Centre (Prev. PSC)\\n2025-01-06 - 2025-04-25 Online\\n'
    // ]
    const sectionDeli: RegExp = /(?=COMP-\d+-\w+\d+ Add Section to Schedule)/g;
    const sections: string[] = inputText.split(sectionDeli).filter(Boolean);
    for (const section of sections) {
      // split the section into two parts
      const sectionDeli01: RegExp =
        /\\nSeats @\) Times Locations Instructors\\n/g;
      // example data
      // [
      //   'COMP-3018-FTE01 Add Section to Schedule\\nBack-End Development\\nRuns from 2025-01-06 - 2025-04-25',
      //   '4/35/0 T12:00 PM - 3:00 PM Roblin Centre (Prev. PSC), Shabaga, D (Lecture, Online)\\nPrincess Building PSCP312\\n2025-01-06 - 2025-04-25\\nLecture\\nW 1:00 PM - 4:00 PM Roblin Centre (Prev. PSC)\\n2025-01-06 - 2025-04-25 Online\\n'
      // ]
      const sectionPart01: string[] = section
        .split(sectionDeli01)
        .filter(Boolean);
      // parse the first part

      const regexDeli0101: RegExp =
        /^(.*?)Add Section to Schedule\\n(.*?)\\nRuns from (\d{4}-\d{2}-\d{2}) - (\d{4}-\d{2}-\d{2})/;
      const SectionPart0101: string[] | null =
        sectionPart01[0].match(regexDeli0101);
      if (SectionPart0101) {
        // example data: COMP-3018-FTE01
        const sectionCode: string = SectionPart0101[1].trim();
        // example data: Back-End Development
        const sectionName: string = SectionPart0101[2]
          .replace(/\\n/g, " ")
          .trim();
        // example data: 2025-01-06T00:00:00.000Z
        const sectionStartDate: Date = new Date(SectionPart0101[3]); // sectionStartDate
        // example data: 2025-04-25T00:00:00.000Z
        const sectionEndDate: Date = new Date(SectionPart0101[4]); // sectionEndDate

        console.log(sectionCode, sectionName, sectionStartDate, sectionEndDate);
      }
    }
  }

  return null;
}
