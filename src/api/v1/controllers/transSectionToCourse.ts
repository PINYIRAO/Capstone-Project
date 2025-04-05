import type { Course, CourseType } from "../models/courseModel";
import type { Section } from "../models/courseSectionModel";

// asssumed the overall const for course data, need to refactored in the following steps
const program: string = "Application Design and Delivery";
const userId: string = "admin";
const term: number = 3;
const courseType: CourseType = "Required";

export function transSectionToCourse(
  sectionsObj: Section[]
): Partial<Course>[] {
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
  return courses;
}
