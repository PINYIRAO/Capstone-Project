import type { Course, CourseType } from "../../models/courseModel";
import type { Section } from "../../models/courseSectionModel";

// asssumed the overall const for course data, need to refactored in the following steps
const program: string = "Application Design and Delivery";
const /* The `userId` variable in the provided TypeScript code is being used to store the user ID of
the user who is uploading the course data. It is passed as a parameter to the
`transSectionToCourse` function and then assigned to the `userId` property of each new course
object that is created within the function. This allows for tracking and associating the user
who uploaded the course data with the courses that are being processed. */
  term: number = 3;
const courseType: CourseType = "Required";

export function transSectionToCourse(
  uid: string,
  sectionsObj: Section[]
): Partial<Course>[] {
  // console.log(JSON.stringify(sectionsObj, null, 2));
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
        userId: uid,
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
          }
          // if (c.courseSections) {
          //   c.courseSections.push(section);
          // } else {
          //   c.courseSections = [section];
          // }
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
