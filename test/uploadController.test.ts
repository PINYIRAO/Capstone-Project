jest.mock("../src/api/v1/controllers/course/ocrEachFile", () => ({
  ocrEachFile: jest.fn(),
}));
jest.mock("../src/api/v1/controllers/course/extractSection", () => ({
  extractSectionData: jest.fn(),
}));
jest.mock("../src/api/v1/controllers/course/updateCourseFromOCR", () => ({
  updateCourseFromOCR: jest.fn(),
}));
jest.mock("../src/api/v1/controllers/course/transSectionToCourse", () => ({
  transSectionToCourse: jest.fn(),
}));

import { uploadCourses } from "../src/api/v1/controllers/course/uploadController";

import { Request, Response, NextFunction } from "express";

import { ocrEachFile } from "../src/api/v1/controllers/course/ocrEachFile";
import { extractSectionData } from "../src/api/v1/controllers/course/extractSection";
import { updateCourseFromOCR } from "../src/api/v1/controllers/course/updateCourseFromOCR";
import { transSectionToCourse } from "../src/api/v1/controllers/course/transSectionToCourse";
import { errorResponse } from "../src/api/v1/models/responseModel";

describe("upload Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = { query: {}, params: {}, body: {}, files: {} };
    mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    mockNext = jest.fn();
  });

  it("should return bad request when there is no file", async () => {
    await uploadCourses(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(
      errorResponse("This is no course files attached")
    );
  });
  it("should process when there is file(s)", async () => {
    (extractSectionData as jest.Mock).mockReturnValue([]);

    mockReq.files = [{ filename: "testImage.png" } as Express.Multer.File];
    await uploadCourses(mockReq as Request, mockRes as Response, mockNext);

    await expect(ocrEachFile).toHaveBeenCalledTimes(1);
    expect(extractSectionData).toHaveBeenCalledTimes(1);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(
      errorResponse("Course information not found", "GET_NON_COURSE")
    );
  });
  it("should handle when upload right file(s)", async () => {
    (extractSectionData as jest.Mock).mockReturnValue([
      {
        sectionCode: "COMP-3018-FTE01",
        sectionEndDate: new Date("2025-04-25"),
        sectionInstructor: "",
        sectionDeliveryType: "Mixed",
        sectionName: "Back-End Development",
        sectionSchedules: [
          {
            day: 1,
            deliveryType: "Lecture",
            startTime: 0,
            endTime: 300,
            location: "Roblin Centre (Prev. PSC), Princess Building PSCP312",
          },
        ],
        sectionSeats: 35,
        sectionStartDate: new Date("2025-01-06"),
      },
    ]);
    (transSectionToCourse as jest.Mock).mockReturnValue([
      {
        program: "Application Design and Delivery",
        term: 3,
        courseCode: "COMP-3018",
        courseName: "Back-End Development",
        courseType: "Required",
        userId: "admin",
        courseSections: [
          {
            sectionCode: "COMP-3018-FTE01",
            sectionName: "Back-End Development",
            sectionInstructor: "Shabaga, D",
            sectionDeliveryType: "Mixed",
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
            sectionDeliveryType: "Mixed",
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
        userId: "admin",
        courseSections: [
          {
            sectionCode: "COMP-3099-FTE01",
            sectionName: "Back-End Development",
            sectionInstructor: "Shabaga, D",
            sectionDeliveryType: "Mixed",
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
    ]);

    mockReq.files = [{ filename: "testImage.png" } as Express.Multer.File];
    await uploadCourses(mockReq as Request, mockRes as Response, mockNext);

    await expect(ocrEachFile).toHaveBeenCalledTimes(1);
    expect(extractSectionData).toHaveBeenCalledTimes(1);
    expect(transSectionToCourse).toHaveBeenCalledTimes(1);
    expect(updateCourseFromOCR).toHaveBeenCalledTimes(2);

    expect(mockRes.status).toHaveBeenCalledWith(200);
  });
});
