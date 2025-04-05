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
import type { Class } from "../models/courseSectionModel";
import type { DeliveryType } from "../models/courseSectionModel";

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
      let sectionPart0202: string | null;
      let sectionPart0203: string = "";
      let match: string[] | null;
      let sectionSeats: number;
      let courseInstructor: string = "";

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

      // parse the second part
      // 1. parse the instructor
      const regexDeli0201: RegExp =
        /([A-Za-z]+,\s*[A-Za-z])\s*\((Lecture|Online|Lecture,\s*Online)\)/;
      const sectionPart0201: string[] | null =
        sectionPart01[1].match(regexDeli0201);
      if (sectionPart0201) {
        // get the courseInstructor
        // example data: Shabaga, D
        courseInstructor = sectionPart0201?.[1] || "";
        // the left are the second part remove the instructor info
        // example data:
        // 4/35/0 T12:00 PM - 3:00 PM Roblin Centre (Prev. PSC), \nPrincess Building PSCP312\n2025-01-06 - 2025-04-25\nLecture\nW 1:00 PM - 4:00 PM Roblin Centre (Prev. PSC)\n2025-01-06 - 2025-04-25 Online\n
        sectionPart0202 = sectionPart01[1]
          .replace(
            /([A-Za-z]+,\s*[A-Za-z])\s*\((Lecture|Online|Lecture,\s*Online)\)/g,
            ""
          )
          .trim();
      } else {
        // just for in case there is no instructor
        sectionPart0202 = sectionPart0201;
      }
      console.log(courseInstructor, sectionPart0202);
      // parse the seat data
      const seatsRegex: RegExp = /^(\d+)\/(\d+)\/(\d+)\s*/;
      if (sectionPart0202 !== null) {
        match = sectionPart0202.match(seatsRegex);
        if (match) {
          // example data: 35
          sectionSeats = match ? parseInt(match[2], 10) : 0;
          // example data:
          // T12:00 PM - 3:00 PM Roblin Centre (Prev. PSC), \nPrincess Building PSCP312\n2025-01-06 - 2025-04-25\nLecture\nW 1:00 PM - 4:00 PM Roblin Centre (Prev. PSC)\n2025-01-06 - 2025-04-25 Online\n
          sectionPart0203 = sectionPart0202.replace(seatsRegex, "").trim();
          console.log(sectionSeats, sectionPart0203);
        }
      }

      // parse the class data
      const classRegex: RegExp =
        /(?=(?:^|\\n)(?:M|T|W|Th|F|Sat|Sun)(?:\/(?:M|T|W|Th|F|Sat|Sun))*\s\d{1,2}:\d{2}\s(?:AM|PM)\s-\s\d{1,2}:\d{2}\s(?:AM|PM))/gm;

      // example data
      // T12:00 PM - 3:00 PM Roblin Centre (Prev. PSC), \nPrincess Building PSCP312\n2025-01-06 - 2025-04-25\nLecture
      // \nW 1:00 PM - 4:00 PM Roblin Centre (Prev. PSC)\n2025-01-06 - 2025-04-25 Online\n
      let classes: Class[] = [];
      const parts: string[] = sectionPart0203
        .split(classRegex)
        .map((part) => part.trim())
        .filter((p) => p.length > 0);
      if (parts.length !== 0) {
        parts.forEach((v) => {
          console.log(v);
        });
        parts.forEach((v) => {
          const classObj: Class[] | null = extractClassData(v);
          if (classObj !== null) {
            classes = classes.concat(classObj);
          }
        });
      }
      console.log(classes);
    }
  }

  return null;
}

function extractClassData(classInfo: string | null): Class[] | null {
  const classesInfo: Class[] = [];
  if (classInfo !== null) {
    // extract the day
    const daysRegex: RegExp = /^(\\n)?([A-Za-z/]+)/;
    const daysMatch: string[] | null = classInfo.match(daysRegex);
    const days: string[] = daysMatch ? daysMatch[2].split("/") : [];

    // extract the start and end time
    const timeRegex: RegExp =
      /(\d{1,2}:\d{2} (AM|PM)) - (\d{1,2}:\d{2} (AM|PM))/;
    const timeMatch: string[] | null = classInfo.match(timeRegex);
    const startTimeStr: string = timeMatch ? timeMatch[1] : "";
    const endTimeStr: string = timeMatch ? timeMatch[3] : "";
    const startTime: number = convertTo24Hour(startTimeStr);
    const endTime: number = convertTo24Hour(endTimeStr);
    // extract the start date and end date
    const dateRegex: RegExp = /(\d{4}-\d{2}-\d{2}) - (\d{4}-\d{2}-\d{2})/;
    const dateMatch: string[] | null = classInfo.match(dateRegex);
    const startDateStr: string | null = dateMatch ? dateMatch[1] : null;
    const endDateStr: string | null = dateMatch ? dateMatch[2] : null;

    //  extract the delivery type :Lecture or Online
    const lectureTypeRegex: RegExp = /(Lecture|Online)/;
    const lectureMatch: string[] | null = classInfo.match(lectureTypeRegex);
    const lectureType: DeliveryType =
      lectureMatch !== null && ["Online", "Lecture"].includes(lectureMatch[0])
        ? (lectureMatch[0] as "Online" | "Lecture")
        : "Mixed";

    // the reamining informationis the class location
    let location: string = classInfo
      .replace(`${days.join("/")}`, "")
      .replace(`${startTimeStr} - ${endTimeStr}`, "")
      .replace(`${startDateStr} - ${endDateStr}`, "")
      .replace(lectureType, "")
      .trim();

    location = location.replace(/\\n/g, " ").trim(); // replace the \\n to a space to concatenate the string

    // define a obj for day convertion
    const dayMapping: { [key: string]: number } = {
      Sun: 0,
      M: 1, // Monday
      T: 2, // Tuesday
      W: 3, // Wednesday
      Th: 4, // Thursday
      F: 5, // Friday
      Sat: 6, // Saturday
    };
    // create the class info
    days.forEach((day) => {
      classesInfo.push({
        day: dayMapping[day],
        lectureType,
        startTime,
        endTime,
        location,
      });
    });
  }
  return classesInfo;
}

// convert the time
const convertTo24Hour = (time: string): number => {
  const [hourMin, period] = time.split(" ");
  const [hour, minute] = hourMin.split(":").map(Number);
  let newHour: number = hour;

  if (period === "PM" && hour !== 12) {
    newHour = hour + 12;
  }
  if (period === "AM" && hour === 12) {
    newHour = 0;
  }

  return newHour * 100 + minute; // convert 3:00 PM into 1500 format
};
