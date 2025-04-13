jest.mock("../src/api/v1//services/courseDataService", () => ({
  getAllCourses: jest.fn(),
  createCourse: jest.fn(),
  updateCourse: jest.fn(),
}));
import type { Course } from "../src/api/v1/models/courseModel";
import {
  getAllCourses,
  createCourse,
  updateCourse,
} from "../src/api/v1/services/courseDataService";
// import { getAllCourses } from "../src/api/v1/services/courseDataService";
import { updateCourseFromOCR } from "../src/api/v1/services/uploadCourseImage/updateCourseFromOCR";

describe("update course database from ocr", () => {
  it("should update the cours if already exists in the database", async () => {
    const mockedCourse: Course[] = [
      {
        program: "Application Design and Delivery",
        term: 3,
        id: "1",
        courseCode: "COMP-3018",
        courseName: "Back-End Development",
        courseType: "Required",
        uid: "admin",
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
        ],
      },
    ];
    (getAllCourses as jest.Mock).mockResolvedValue(mockedCourse);

    await updateCourseFromOCR("admin", mockedCourse[0]);

    expect(updateCourse).toHaveBeenCalledTimes(1);
  });

  it("should create a new cours if not exist in the database", async () => {
    const mockedCourse: Course[] = [
      {
        program: "Application Design and Delivery",
        term: 3,
        id: "1",
        courseCode: "COMP-3018",
        courseName: "Back-End Development",
        courseType: "Required",
        uid: "admin",
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
        ],
      },
    ];
    (getAllCourses as jest.Mock).mockResolvedValue([]);

    await updateCourseFromOCR("admin", mockedCourse[0]);

    expect(createCourse).toHaveBeenCalledTimes(1);
  });

  it("should throw an error if exists more than two records for one course in the database", async () => {
    const mockedCourse: Course[] = [
      {
        program: "Application Design and Delivery",
        term: 3,
        id: "1",
        courseCode: "COMP-3018",
        courseName: "Back-End Development",
        courseType: "Required",
        uid: "admin",
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
        ],
      },
      {
        program: "Application Design and Delivery",
        term: 3,
        id: "1",
        courseCode: "COMP-3018",
        courseName: "Back-End Development",
        courseType: "Required",
        uid: "admin",
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
        ],
      },
    ];
    (getAllCourses as jest.Mock).mockResolvedValue(mockedCourse);

    await expect(updateCourseFromOCR("admin", mockedCourse[0])).rejects.toThrow(
      /The system has more than one records for this course/
    );
  });
});
