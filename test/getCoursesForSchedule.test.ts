jest.mock("../src/api/v1/services/courseDataService", () => ({
  getAllCourses: jest.fn(),
}));

import { Course } from "src/api/v1/models/courseModel";
import { SchedulePreferenceQuery } from "../src/api/v1/models/coursePreferenceModel";
import { getAllCourses } from "../src/api/v1/services/courseDataService";
import { testCourses } from "./data/testCoursesforSchedule";
import { getCoursesForSchedule } from "../src/api/v1/services/scheduleCourse/getCoursesForSchedule";
import { Section } from "src/api/v1/models/courseSectionModel";

describe("get courses for schedule", () => {
  const userId: string = "admin";
  beforeEach(() => {
    jest.clearAllMocks();
    (getAllCourses as jest.Mock).mockResolvedValue(testCourses);
  });

  it("should return no course if there is courses return", async () => {
    const schedulePreferenceQuery: SchedulePreferenceQuery = {};
    (getAllCourses as jest.Mock).mockResolvedValue([]);
    const actualCourses: { courses: Course[]; message: string } =
      await getCoursesForSchedule(userId, schedulePreferenceQuery);
    expect(actualCourses.message).toMatch(/no course/);
  });

  it("should return three courses if there is no parameter for preference", async () => {
    const schedulePreferenceQuery: SchedulePreferenceQuery = {};

    const actualCourses: { courses: Course[]; message: string } =
      await getCoursesForSchedule(userId, schedulePreferenceQuery);
    expect(actualCourses.courses.length).toBe(3);
  });

  it("should return 0 course if there is parameter for optional course but couldn't find any one of them", async () => {
    const schedulePreferenceQuery: SchedulePreferenceQuery = {
      electiveSelection: ["COMM-2170"],
    };

    const actualCourses: { courses: Course[]; message: string } =
      await getCoursesForSchedule(userId, schedulePreferenceQuery);
    expect(actualCourses.courses.length).toBe(0);
    expect(actualCourses.message).toMatch(
      /no course for shcedule regarding the elective course choice/
    );
  });
  it("should return filter optional course if there is parameter for optional course", async () => {
    const schedulePreferenceQuery: SchedulePreferenceQuery = {
      electiveSelection: ["COMM-2176"],
    };

    const actualCourses: { courses: Course[]; message: string } =
      await getCoursesForSchedule(userId, schedulePreferenceQuery);
    expect(actualCourses.courses.length).toBe(3);
  });

  it("should return filter the section if there is preference for time slot", async () => {
    const schedulePreferenceQuery: SchedulePreferenceQuery = {
      notAvailableTimeSpots: [[3, 13, 16]],
    };

    const actualCourses: { courses: Course[]; message: string } =
      await getCoursesForSchedule(userId, schedulePreferenceQuery);

    let actualSections: Section[] = [];
    for (const course of actualCourses.courses) {
      if (course.courseCode == "COMP-3018") {
        actualSections = course.courseSections;
      }
    }
    expect(actualSections.length).toBe(1);
  });
  it("should return filter the section if there is preference for instructor", async () => {
    const schedulePreferenceQuery: SchedulePreferenceQuery = {
      preferenceForInstructor: {
        goFor: ["Christine Stone"],
        notGoFor: ["Elizabeth Lee"],
      },
    };

    const actualCourses: { courses: Course[]; message: string } =
      await getCoursesForSchedule(userId, schedulePreferenceQuery);

    let goForSections: Section[] = [];
    let noeGoForSections: Section[] = [];
    for (const course of actualCourses.courses) {
      if (course.courseCode == "COMP-3018") {
        goForSections = course.courseSections;
        noeGoForSections = course.courseSections;
      }
    }
    expect(goForSections.length).toBe(1);
    expect(noeGoForSections.length).toBe(1);
  });
  it("should return filter the section if there is preference for delivery type", async () => {
    const schedulePreferenceQuery: SchedulePreferenceQuery = {
      preferenceForDeliveryType: {
        lecture: ["COMP-3021"], // the section code for lecture type
        online: ["COMM-2176"], // the section code for online type
        hybrid: ["COMP-3018"], // the course code for hybrid type
      },
    };

    const actualCourses: { courses: Course[]; message: string } =
      await getCoursesForSchedule(userId, schedulePreferenceQuery);

    let lectureSections: Section[] = [];
    let onlineSections: Section[] = [];
    let hybridSections: Section[] = [];
    for (const course of actualCourses.courses) {
      if (course.courseCode == "COMP-3021") {
        lectureSections = course.courseSections;
      } else if (course.courseCode == "COMM-2176") {
        onlineSections = course.courseSections;
      } else if (course.courseCode == "COMP-3018") {
        hybridSections = course.courseSections;
      }
    }
    expect(lectureSections.length).toBe(1);
    expect(onlineSections.length).toBe(1);
    expect(hybridSections.length).toBe(1);
  });
  it("should return filter the section if there is preference for specific section", async () => {
    const schedulePreferenceQuery: SchedulePreferenceQuery = {
      preferenceForSection: {
        goFor: ["COMP-3018-FTE01"],
        notGoFor: ["COMM-2176-FTE01"],
      },
    };

    const actualCourses: { courses: Course[]; message: string } =
      await getCoursesForSchedule(userId, schedulePreferenceQuery);

    let goForSections: Section[] = [];
    let noeGoForSections: Section[] = [];
    for (const course of actualCourses.courses) {
      if (course.courseCode == "COMP-3018") {
        goForSections = course.courseSections;
      } else if (course.courseCode == "COMM-2176") {
        noeGoForSections = course.courseSections;
      }
    }
    expect(goForSections.length).toBe(1);
    expect(noeGoForSections.length).toBe(1);
  });
});
