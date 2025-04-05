/**
 * Upload Controller (uploadController.ts)
 *
 * This file defines functions (controllers) for handling the upload course screenshots.
 * These functions interact with the course service (courseService.ts) to perform the actual
 * logic for creating and updating operations on courses.
 */

import { Request, Response, NextFunction } from "express";
import type { Course, CourseType } from "../models/courseModel";
import { errorResponse, successResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import tesseract from "tesseract.js";
import { getErrorCode, getErrorMessage } from "../utils/errorUtils";
import type { Section } from "../models/courseSectionModel";
import type { Class } from "../models/courseSectionModel";
import type { DeliveryType } from "../models/courseSectionModel";
import {
  getAllCourses,
  createCourse,
  updateCourse,
} from "../services/courseService";
import { ServiceError } from "../errors/errors";

// asssumed the overall const for course data
const program: string = "Application Design and Delivery";
const userId: string = "admin";
const term: number = 3;
const courseType: CourseType = "Required";

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
      // get the course from the images
      let sectionsObj: Section[] = [];
      if (Array.isArray(req.files)) {
        for (const file of req.files) {
          const sectionsObjTemp: Section[] | null = extractSectionData(
            await ocrEachFile(file)
          );
          if (sectionsObjTemp !== null) {
            sectionsObj = sectionsObj.concat(sectionsObjTemp);
          }
        }
      }
      // console.log(JSON.stringify(sectionsObj, null, 2));
      // change the sections info to course structure
      if (sectionsObj.length !== 0) {
        const courses: Partial<Course>[] = [];
        for (const section of sectionsObj) {
          const regex: RegExp = /^([A-Za-z]+-\d+)/;
          const match: string[] | null = section.sectionCode.match(regex);
          if (match !== null) {
            const courseCode: string = match[1]; //find courseCode
            const courseName: string = section.sectionName;
            // create a new course
            const newCourseInfo: Partial<Course> = {
              program,
              term,
              courseCode,
              courseName,
              courseType,
              userId,
              courseSections: [section],
            };
            if (courses.length == 0) {
              courses.push(newCourseInfo);
              continue;
            }
            let courseExistFlag: number = 0;
            for (const c of courses) {
              if (c.courseCode == courseCode) {
                // append to the curren course
                if (c.courseSections) {
                  c.courseSections.push(section);
                } else {
                  c.courseSections = [section];
                }
                courseExistFlag = 1;
              }
            }
            if (!courseExistFlag) {
              courses.push(newCourseInfo);
            }
          }
        }
        console.log(JSON.stringify(courses, null, 2));
        // update the course
        for (const courseObj of courses) {
          await updateCourseFromImage(courseObj, userId);
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
function extractSectionData(inputText: string | null): Section[] | null {
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
    // console.log(sections);
    const sectionsObj: Section[] = [];
    for (const section of sections) {
      let sectionObj: Section;
      let sectionPart0202: string | null;
      let sectionPart0203: string = "";
      let match: string[] | null;
      let sectionSeats: number = 999;
      let sectionInstructor: string = "";
      // set a default value, it should be determined by the classes type
      const sectionLectureType: DeliveryType = "Mixed";
      let sectionCode: string = "NONE";
      let sectionName: string = "NONE";
      let sectionStartDate: Date = new Date("1900-01-01");
      let sectionEndDate: Date = new Date("1900-01-01");

      // split the section into two parts
      const sectionDeli01: RegExp =
        /\\nSeats.*?Times Locations Instructors\\n/g;
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
        sectionCode = SectionPart0101[1].trim();
        // example data: Back-End Development
        sectionName = SectionPart0101[2].replace(/\\n/g, " ").trim();
        // example data: 2025-01-06T00:00:00.000Z
        sectionStartDate = new Date(SectionPart0101[3]); // sectionStartDate
        // example data: 2025-04-25T00:00:00.000Z
        sectionEndDate = new Date(SectionPart0101[4]); // sectionEndDate
        // console.log(sectionCode, sectionName, sectionStartDate, sectionEndDate);
      }

      // parse the second part
      // 1. parse the instructor
      const regexDeli0201: RegExp = /([A-Za-z]+,\s*[A-Za-z])\s*\(([^)]+)\)/;
      // /([A-Za-z]+,\s*[A-Za-z])\s*\((Lecture|Online|Lecture(,\s*Online)?)/;
      const sectionPart0201: string[] | null =
        sectionPart01[1].match(regexDeli0201);
      if (sectionPart0201) {
        // get the courseInstructor
        // example data: Shabaga, D
        sectionInstructor = sectionPart0201?.[1] || "";
        // the left are the second part remove the instructor info
        // example data:
        // 4/35/0 T12:00 PM - 3:00 PM Roblin Centre (Prev. PSC), \nPrincess Building PSCP312\n2025-01-06 - 2025-04-25\nLecture\nW 1:00 PM - 4:00 PM Roblin Centre (Prev. PSC)\n2025-01-06 - 2025-04-25 Online\n
        sectionPart0202 = sectionPart01[1]
          .replace(/([A-Za-z]+,\s*[A-Za-z])\s*\(([^)]+)\)/g, "")
          .trim();
      } else {
        // just for in case there is no instructor
        sectionPart0202 = sectionPart01[1];
      }
      // console.log(sectionInstructor, sectionPart0202);
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
          // console.log(sectionSeats, sectionPart0203);
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
        // parts.forEach((v) => {
        //   console.log(v);
        // });
        parts.forEach((v) => {
          const classObj: Class[] | null = extractClassData(v);
          if (classObj !== null) {
            classes = classes.concat(classObj);
          }
        });
      }
      // console.log(classes);
      // eslint-disable-next-line prefer-const
      sectionObj = {
        sectionCode,
        sectionName,
        sectionInstructor,
        sectionLectureType,
        sectionStartDate,
        sectionEndDate,
        sectionSeats,
        sectionSchedules: classes,
      };
      sectionsObj.push(sectionObj);
    }
    // console.log(JSON.stringify(sectionsObj, null, 2));
    return sectionsObj;
  }

  return null;
}

function extractClassData(classInfo: string | null): Class[] | null {
  const classesInfo: Class[] = [];
  if (classInfo !== null) {
    // extract the day
    const daysRegex: RegExp = /^(\\n)?([A-Za-z/]+)/;
    // const daysRegex: RegExp =       /^.*?(\\n)?([A-Za-z/]+)\s+\d{1,2}:\d{2}\s*[AP]M\s*-\s*\d{1,2}:\d{2}\s*[AP]M/;
    const daysMatch: string[] | null = classInfo.match(daysRegex);
    const days: string[] = daysMatch ? daysMatch[2].split("/") : [];

    // extract the start and end time
    const timeRegex: RegExp =
      /(\d{1,2}:\d{2} (AM|PM)) - (\d{1,2}:\d{2} (AM|PM))/;
    const timeMatch: string[] | null = classInfo.match(timeRegex);
    const startTimeStr: string = timeMatch ? timeMatch[1] : "";
    const endTimeStr: string = timeMatch ? timeMatch[3] : "";
    const startTime: number = convertTo24Hour(startTimeStr)
      ? 0
      : convertTo24Hour(startTimeStr);
    const endTime: number = convertTo24Hour(endTimeStr)
      ? 0
      : convertTo24Hour(endTimeStr);
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
        // if the day couldn't get right, then set the default for 99
        day: day in dayMapping ? dayMapping[day] : 99,
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

  // sometimes OCR can't get the corret time, just is a empty string
  // to aviod the consequence error, return 0 here
  if (isNaN(newHour * 100 + minute)) {
    return 0;
  }

  return newHour * 100 + minute; // convert 3:00 PM into 1500 format
};

async function updateCourseFromImage(
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
