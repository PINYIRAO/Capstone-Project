import { transSectionToCourse } from "../src/api/v1/services/uploadCourseImage/transSectionToCourse";
import type { Course } from "../src/api/v1/models/courseModel";
import type { Section } from "../src/api/v1/models/courseSectionModel";

describe("extract section data", () => {
  it("Should transform the section data into course structure data", () => {
    const sectionsObj: Section[] = [
      {
        sectionCode: "COMP-3018-FTE01",
        sectionName: "Back-End Development",
        sectionInstructor: "Shabaga, D",
        sectionDeliveryType: "Hybrid",
        sectionStartDate: new Date("2025-01-06"),
        sectionEndDate: new Date("2025-04-25"),
        sectionSeats: 35,
        sectionSchedules: [
          {
            day: 2,
            deliveryType: "Lecture",
            startTime: 1200,
            endTime: 1500,
            location: "Roblin Centre (Prev. PSC), Princess Building PSCP312",
          },
          {
            day: 3,
            deliveryType: "Online",
            startTime: 1300,
            endTime: 1600,
            location: "Roblin Centre (Prev. PSC)",
          },
        ],
      },
      {
        sectionCode: "COMP-3099-FTE01",
        sectionName: "Back-End Development",
        sectionInstructor: "Shabaga, D",
        sectionDeliveryType: "Hybrid",
        sectionStartDate: new Date("2025-01-06"),
        sectionEndDate: new Date("2025-04-25"),
        sectionSeats: 35,
        sectionSchedules: [
          {
            day: 2,
            deliveryType: "Lecture",
            startTime: 1200,
            endTime: 1500,
            location: "Roblin Centre (Prev. PSC), Princess Building PSCP312",
          },
          {
            day: 3,
            deliveryType: "Online",
            startTime: 1300,
            endTime: 1600,
            location: "Roblin Centre (Prev. PSC)",
          },
        ],
      },
      {
        sectionCode: "COMP-3018-FTE01",
        sectionName: "Back-End Development",
        sectionInstructor: "Shabaga, D",
        sectionDeliveryType: "Hybrid",
        sectionStartDate: new Date("2025-01-06"),
        sectionEndDate: new Date("2025-04-25"),
        sectionSeats: 35,
        sectionSchedules: [
          {
            day: 2,
            deliveryType: "Lecture",
            startTime: 1200,
            endTime: 1500,
            location: "Roblin Centre (Prev. PSC), Princess Building PSCP312",
          },
          {
            day: 3,
            deliveryType: "Online",
            startTime: 1300,
            endTime: 1600,
            location: "Roblin Centre (Prev. PSC)",
          },
        ],
      },
    ];
    const expectedCourses: Partial<Course>[] = [
      {
        program: "Application Design and Delivery",
        term: 3,
        courseCode: "COMP-3018",
        courseName: "Back-End Development",
        courseType: "Required",
        uid: "uploadtest",
        courseSections: [
          {
            sectionCode: "COMP-3018-FTE01",
            sectionName: "Back-End Development",
            sectionInstructor: "Shabaga, D",
            sectionDeliveryType: "Hybrid",
            sectionStartDate: new Date("2025-01-06"),
            sectionEndDate: new Date("2025-04-25"),
            sectionSeats: 35,
            sectionSchedules: [
              {
                day: 2,
                deliveryType: "Lecture",
                startTime: 1200,
                endTime: 1500,
                location:
                  "Roblin Centre (Prev. PSC), Princess Building PSCP312",
              },
              {
                day: 3,
                deliveryType: "Online",
                startTime: 1300,
                endTime: 1600,
                location: "Roblin Centre (Prev. PSC)",
              },
            ],
          },
          {
            sectionCode: "COMP-3018-FTE01",
            sectionName: "Back-End Development",
            sectionInstructor: "Shabaga, D",
            sectionDeliveryType: "Hybrid",
            sectionStartDate: new Date("2025-01-06"),
            sectionEndDate: new Date("2025-04-25"),
            sectionSeats: 35,
            sectionSchedules: [
              {
                day: 2,
                deliveryType: "Lecture",
                startTime: 1200,
                endTime: 1500,
                location:
                  "Roblin Centre (Prev. PSC), Princess Building PSCP312",
              },
              {
                day: 3,
                deliveryType: "Online",
                startTime: 1300,
                endTime: 1600,
                location: "Roblin Centre (Prev. PSC)",
              },
            ],
          },
        ],
      },
      {
        program: "Application Design and Delivery",
        term: 3,
        courseCode: "COMP-3099",
        courseName: "Back-End Development",
        courseType: "Required",
        uid: "uploadtest",
        courseSections: [
          {
            sectionCode: "COMP-3099-FTE01",
            sectionName: "Back-End Development",
            sectionInstructor: "Shabaga, D",
            sectionDeliveryType: "Hybrid",
            sectionStartDate: new Date("2025-01-06"),
            sectionEndDate: new Date("2025-04-25"),
            sectionSeats: 35,
            sectionSchedules: [
              {
                day: 2,
                deliveryType: "Lecture",
                startTime: 1200,
                endTime: 1500,
                location:
                  "Roblin Centre (Prev. PSC), Princess Building PSCP312",
              },
              {
                day: 3,
                deliveryType: "Online",
                startTime: 1300,
                endTime: 1600,
                location: "Roblin Centre (Prev. PSC)",
              },
            ],
          },
        ],
      },
    ];

    const actualCourses: Partial<Course>[] | null = transSectionToCourse(
      "uploadtest",
      sectionsObj
    );

    expect(actualCourses).toEqual(expectedCourses);
  });
});
