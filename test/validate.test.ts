import { Request, Response, NextFunction } from "express";
import { validate, validateRequest } from "../src/api/v1/middleware/validate";
import { courseCreationSchema } from "../src/api/v1/validations/course/courseCreationValidate";
import { Course } from "src/api/v1/models/courseModel";

describe("validate function for courses", () => {
  it("should not throw an error for valid course data", () => {
    const courseData: Course = {
      id: "RqnPztmHVirkiakFOmIi",
      program: "Application Design and Delivery",
      term: 3,
      courseCode: "COMP-3020",
      courseName: "Cloud Infra and Development",
      courseType: "Required",
      uid: "admin",
      courseSections: [
        {
          sectionCode: "COMP-3020-FTO01",
          sectionName: "Cloud Infra and Development",
          sectionInstructor: "Marissa Shepherd",
          sectionDeliveryType: "Online",
          sectionStartDate: new Date("2025-01-06T00:00:00.000"),
          sectionEndDate: new Date("2025-04-25T00:00:00.000"),
          sectionSeats: 30,
          sectionSchedules: [
            {
              day: 3,
              deliveryType: "Online",
              startTime: 8,
              endTime: 11,
              location: "116 Brandon Heights Apt. 381\nKevinmouth, CA 77175",
            },
            {
              day: 5,
              deliveryType: "Online",
              startTime: 8,
              endTime: 11,
              location: "116 Brandon Heights Apt. 381\nKevinmouth, CA 77175",
            },
          ],
        },
      ],
    };

    expect(() => validate(courseCreationSchema, courseData)).not.toThrow();
  });

  it("should throw an error for no course sections", () => {
    const courseData: Course = {
      id: "RqnPztmHVirkiakFOmIi",
      program: "Application Design and Delivery",
      term: 3,
      courseCode: "COMP-3020",
      courseName: "Cloud Infra and Development",
      courseType: "Required",
      uid: "admin",
      courseSections: [],
    };

    expect(() => validate(courseCreationSchema, courseData)).toThrow(
      /have at least a section/
    );
  });
});

describe("validateRequest middleware for courses", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should call next for valid course data", () => {
    req.body = {
      id: "RqnPztmHVirkiakFOmIi",
      program: "Application Design and Delivery",
      term: 3,
      courseCode: "COMP-3020",
      courseName: "Cloud Infra and Development",
      courseType: "Required",
      uid: "admin",
      courseSections: [
        {
          sectionCode: "COMP-3020-FTO01",
          sectionName: "Cloud Infra and Development",
          sectionInstructor: "Marissa Shepherd",
          sectionDeliveryType: "Online",
          sectionStartDate: new Date("2025-01-06T00:00:00.000"),
          sectionEndDate: new Date("2025-04-25T00:00:00.000"),
          sectionSeats: 30,
          sectionSchedules: [
            {
              day: 3,
              deliveryType: "Online",
              startTime: 8,
              endTime: 11,
              location: "116 Brandon Heights Apt. 381\nKevinmouth, CA 77175",
            },
            {
              day: 5,
              deliveryType: "Online",
              startTime: 8,
              endTime: 11,
              location: "116 Brandon Heights Apt. 381\nKevinmouth, CA 77175",
            },
          ],
        },
      ],
    };

    validateRequest(courseCreationSchema)(
      req as Request,
      res as Response,
      next
    );

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should return 400 for missing courseSections", () => {
    req.body = {
      id: "RqnPztmHVirkiakFOmIi",
      program: "Application Design and Delivery",
      term: 3,
      courseCode: "COMP-3020",
      courseName: "Cloud Infra and Development",
      courseType: "Required",
      uid: "admin",
      courseSections: [],
    };

    expect(() => {
      validateRequest(courseCreationSchema)(
        req as Request,
        res as Response,
        next
      );
    }).toThrow(/have at least a section/);

    expect(next).not.toHaveBeenCalled();
  });
});
