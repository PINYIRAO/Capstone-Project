/**
 * get all Courses for schdule Controller (scheduleController.ts)
 *
 * get all courses
 * filter with userid
 * filter with elective course preference if have
 * filter with other preference option
 * return the courses for schedule
 *
 */

import * as courseDataService from "../courseDataService";
import type { Course } from "../../models/courseModel";
import type { SchedulePreferenceQuery } from "../../models/coursePreferenceModel";
import { Section } from "../../models/courseSectionModel";

/**
 * @description Get all courses.
 * @route GET /
 */

export const getCoursesForSchedule = async (
  uid: string,
  schedulePreferenceQuery: SchedulePreferenceQuery
): Promise<{ courses: Course[]; message: string }> => {
  // get the user's courses
  let coursesResult: Course[] = await courseDataService.getAllCourses(
    uid,
    undefined,
    undefined
  );

  // console.log(JSON.stringify(coursesResult, null, 2));
  if (coursesResult == undefined || coursesResult.length == 0) {
    return {
      courses: [],
      message:
        "There is no course in the application, please upload the course information first",
    };
  }

  // use the preference query to filter the courses
  const {
    notAvailableTimeSpots,
    preferenceForInstructor,
    preferenceForDeliveryType,
    preferenceForSection,
    electiveSelection,
  } = schedulePreferenceQuery;

  // filter with elective selection
  // match the elective selection for couse
  // if the use select the elective courses, application will set the choices for filter, otherwise consider all the electives
  if (electiveSelection && electiveSelection.length > 0) {
    // go for the specific section
    let hasElectiveCourses: boolean = false;
    coursesResult = coursesResult.filter((course) => {
      if (
        course.courseType == "Elective" &&
        !electiveSelection.includes(course.courseCode)
      ) {
        return false;
      } else if (
        course.courseType == "Elective" &&
        electiveSelection.includes(course.courseCode)
      ) {
        hasElectiveCourses = true;
      }
      return true;
    });
    if (!hasElectiveCourses) {
      return {
        courses: [],
        message:
          "There is no course for shcedule regarding the elective course choice",
      };
    }
  }

  // match the timeslot
  if (
    notAvailableTimeSpots &&
    notAvailableTimeSpots.length > 0 &&
    notAvailableTimeSpots.some((item) => {
      return Array.isArray(item) && item.length > 0;
    })
  ) {
    for (const notAvailableTimeSpot of notAvailableTimeSpots) {
      if (notAvailableTimeSpot.length > 0) {
        coursesResult = coursesResult.map((course) => {
          const newCourseSections: Section[] = course.courseSections.filter(
            (section) => {
              let notAvailableFlag: boolean = false;
              for (const v of section.sectionSchedules) {
                if (
                  !(
                    v.day !== notAvailableTimeSpot[0] ||
                    v.startTime >= notAvailableTimeSpot[2] ||
                    v.endTime <= notAvailableTimeSpot[1]
                  )
                ) {
                  notAvailableFlag = true;
                }
              }
              return !notAvailableFlag;
            }
          );
          return { ...course, ...{ courseSections: newCourseSections } };
        });
      }
    }
  }
  // match the preferenceForInstructor
  if (
    preferenceForInstructor &&
    Object.keys(preferenceForInstructor).length > 0 &&
    (preferenceForInstructor.goFor.length > 0 ||
      preferenceForInstructor.notGoFor.length > 0)
  ) {
    if (preferenceForInstructor.goFor.length > 0) {
      // go for the specific instructor
      coursesResult = coursesResult.map((course) => {
        let hasPreferenceInstructor: boolean = false;
        const matchSections: Section[] = [];
        const notMatchSections: Section[] = [];
        course.courseSections.forEach((section) => {
          if (
            preferenceForInstructor.goFor.includes(section.sectionInstructor)
          ) {
            hasPreferenceInstructor = true;
            matchSections.push(section);
          } else {
            notMatchSections.push(section);
          }
        });
        // If the course has the prefer instructor then select the instructor, otherwise, select all sections for the following filter
        if (hasPreferenceInstructor) {
          return { ...course, ...{ courseSections: matchSections } };
        } else {
          return { ...course, ...{ courseSections: notMatchSections } };
        }
      });
    }
    if (preferenceForInstructor.notGoFor.length > 0) {
      // not go for the instructor instructor
      coursesResult = coursesResult.map((course) => {
        const notMatchSections: Section[] = [];
        course.courseSections.forEach((section) => {
          if (
            !preferenceForInstructor.notGoFor.includes(
              section.sectionInstructor
            )
          ) {
            notMatchSections.push(section);
          }
        });
        // drop the section with the not go for instructor
        return { ...course, ...{ courseSections: notMatchSections } };
      });
    }
  }

  // filter with the preference for DeliveryType
  // match the preference for DeliveryType
  if (
    preferenceForDeliveryType &&
    Object.keys(preferenceForDeliveryType).length > 0 &&
    (preferenceForDeliveryType.lecture.length > 0 ||
      preferenceForDeliveryType.online.length > 0 ||
      preferenceForDeliveryType.hybrid.length > 0)
  ) {
    coursesResult = coursesResult.map((course) => {
      let hasPreferenceDeliveryType: boolean = false;
      const matchSections: Section[] = [];
      const notMatchSections: Section[] = [];
      course.courseSections.forEach((section) => {
        if (
          (section.sectionDeliveryType == "Lecture" &&
            preferenceForDeliveryType.lecture.includes(course.courseCode)) ||
          (section.sectionDeliveryType == "Online" &&
            preferenceForDeliveryType.online.includes(course.courseCode)) ||
          (section.sectionDeliveryType == "Hybrid" &&
            preferenceForDeliveryType.hybrid.includes(course.courseCode))
        ) {
          hasPreferenceDeliveryType = true;
          matchSections.push(section);
        } else {
          notMatchSections.push(section);
        }
      });
      // If the section has the prefer deliverytype in query then select the section, otherwise, select all sections for the following filter
      if (hasPreferenceDeliveryType) {
        return { ...course, ...{ courseSections: matchSections } };
      } else {
        return { ...course, ...{ courseSections: notMatchSections } };
      }
    });
  }
  // filter with the preference for specific section
  // match the preference for section
  if (
    preferenceForSection &&
    Object.keys(preferenceForSection).length > 0 &&
    (preferenceForSection.goFor.length > 0 ||
      preferenceForSection.notGoFor.length > 0)
  ) {
    if (preferenceForSection.goFor.length > 0) {
      // go for the specific section
      coursesResult = coursesResult.map((course) => {
        let hasPreferenceSection: boolean = false;
        const matchSections: Section[] = [];
        const notMatchSections: Section[] = [];
        course.courseSections.forEach((section) => {
          if (preferenceForSection.goFor.includes(section.sectionCode)) {
            hasPreferenceSection = true;
            matchSections.push(section);
          } else {
            notMatchSections.push(section);
          }
        });
        // If the course has the prefer section then select the instructor, otherwise, select all sections for the following filter
        if (hasPreferenceSection) {
          return { ...course, ...{ courseSections: matchSections } };
        } else {
          return { ...course, ...{ courseSections: notMatchSections } };
        }
      });
    }
    if (preferenceForSection.notGoFor.length > 0) {
      // not go for the specific section
      coursesResult = coursesResult.map((course) => {
        const notMatchSections: Section[] = [];
        course.courseSections.forEach((section) => {
          if (!preferenceForSection.notGoFor.includes(section.sectionCode)) {
            notMatchSections.push(section);
          }
        });
        // drop the section with the not go for instructor
        return { ...course, ...{ courseSections: notMatchSections } };
      });
    }
  }

  // drop the course with no sections after filter and check the course required count
  // check if there is some course with no sections meet the query
  const hasNoSectionCourses: string[] = [];
  coursesResult.forEach((course) => {
    if (
      course.courseSections == null ||
      course.courseSections == undefined ||
      (Array.isArray(course.courseSections) &&
        course.courseSections.length == 0)
    ) {
      hasNoSectionCourses.push(`${course.courseCode}: ${course.courseName} `);
    }
  });

  if (hasNoSectionCourses.length > 0) {
    return {
      courses: [],
      message: `These courses have no choice regarding the preference ${hasNoSectionCourses.join(
        "\n"
      )}`,
    };
  }

  return {
    courses: coursesResult,
    message: "get the courses for schedule seccessfully",
  };
};
