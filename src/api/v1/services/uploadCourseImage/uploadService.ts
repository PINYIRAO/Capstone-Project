/**
 * Upload Service (uploadService.ts)
 *
 */

import type { Course } from "../../models/courseModel";
import type { Section } from "../../models/courseSectionModel";
import { ocrEachFile } from "../../services/uploadCourseImage/ocrEachFile";
import { extractSectionData } from "../../services/uploadCourseImage/extractSection";
import { updateCourseFromOCR } from "../../services/uploadCourseImage/updateCourseFromOCR";
import { transSectionToCourse } from "../../services/uploadCourseImage/transSectionToCourse";
import { getErrorMessage } from "../../utils/errorUtils";

export const uploadService = async (
  uid: string,
  files: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[]
): Promise<Partial<Course>[]> => {
  try {
    // get the course from the images
    let sectionsObj: Section[] = [];
    let courses: Partial<Course>[] = [];
    if (Array.isArray(files)) {
      for (const file of files) {
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
        await updateCourseFromOCR(uid, courseObj);
      }
    }
    return courses;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
