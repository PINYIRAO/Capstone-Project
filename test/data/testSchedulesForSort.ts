import { Course } from "src/api/v1/models/courseModel";

export const testSchedulesForSort: Course[][] = [
  [
    {
      courseCode: "COMP-3021",
      courseName: "Secure Coding and Testing",
      courseSections: [
        {
          sectionCode: "COMP-3021-FTE01",
          sectionDeliveryType: "Lecture",
          sectionEndDate: new Date("2025-04-25T00:00:00.000"),
          sectionInstructor: "Christine Stone",
          sectionName: "Secure Coding and Testing",
          sectionSchedules: [
            {
              day: 1,
              deliveryType: "Lecture",
              endTime: 11,
              location: "409 Ward Stream     Keithchester, WI 48718",
              startTime: 8,
            },
          ],
          sectionSeats: 30,
          sectionStartDate: new Date("2025-01-06T00:00:00.000"),
        },
      ],
      courseType: "Required",
      id: "38g4UePkWkuQujelJa3u",
      program: "Application Design and Delivery",
      term: 3,
      userId: "admin",
    },
    {
      courseCode: "COMP-3018",
      courseName: "Back-End Development",
      courseSections: [
        {
          sectionCode: "COMP-3018-FTE01",
          sectionDeliveryType: "Lecture",
          sectionEndDate: new Date("2025-04-25T00:00:00.000"),
          sectionInstructor: "Christine Stone",
          sectionName: "Back-End Development",
          sectionSchedules: [
            {
              day: 2,
              deliveryType: "Lecture",
              endTime: 15,
              location: "72640 Timothy Hills Suite 726    Mooreshire, MN 86382",
              startTime: 12,
            },
            {
              day: 3,
              deliveryType: "Lecture",
              endTime: 16,
              location: "116 Brandon Heights Apt. 381    Kevinmouth, CA 77175",
              startTime: 13,
            },
          ],
          sectionSeats: 30,
          sectionStartDate: new Date("2025-04-25T00:00:00.000"),
        },
      ],
      courseType: "Required",
      id: "9nqka7DdnVcnRO1Hbp7Q",
      program: "Application Design and Delivery",
      term: 3,
      userId: "admin",
    },
  ],
  [
    {
      courseCode: "COMP-3021",
      courseName: "Secure Coding and Testing",
      courseSections: [
        {
          sectionCode: "COMP-3021-FTE02",
          sectionDeliveryType: "Online",
          sectionEndDate: new Date("2025-04-25T00:00:00.000"),
          sectionInstructor: "Christine Stone",
          sectionName: "Secure Coding and Testing",
          sectionSchedules: [
            {
              day: 1,
              deliveryType: "Online",
              endTime: 11,
              location: "409 Ward Stream     Keithchester, WI 48718",
              startTime: 8,
            },
          ],
          sectionSeats: 30,
          sectionStartDate: new Date("2025-01-06T00:00:00.000"),
        },
      ],
      courseType: "Required",
      id: "38g4UePkWkuQujelJa3u",
      program: "Application Design and Delivery",
      term: 3,
      userId: "admin",
    },
    {
      courseCode: "COMP-3018",
      courseName: "Back-End Development",
      courseSections: [
        {
          sectionCode: "COMP-3018-FTE02",
          sectionDeliveryType: "Hybrid",
          sectionEndDate: new Date("2025-04-25T00:00:00.000"),
          sectionInstructor: "Christine Stone",
          sectionName: "Back-End Development",
          sectionSchedules: [
            {
              day: 5,
              deliveryType: "Online",
              endTime: 15,
              location: "72640 Timothy Hills Suite 726    Mooreshire, MN 86382",
              startTime: 12,
            },
            {
              day: 3,
              deliveryType: "Lecture",
              endTime: 16,
              location: "116 Brandon Heights Apt. 381    Kevinmouth, CA 77175",
              startTime: 13,
            },
          ],
          sectionSeats: 30,
          sectionStartDate: new Date("2025-04-25T00:00:00.000"),
        },
      ],
      courseType: "Required",
      id: "9nqka7DdnVcnRO1Hbp7Q",
      program: "Application Design and Delivery",
      term: 3,
      userId: "admin",
    },
  ],
];
