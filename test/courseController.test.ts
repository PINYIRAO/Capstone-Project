import { Request, Response, NextFunction } from "express";
import * as courseController from "../src/api/v1/controllers/courseController";
import * as courseDataService from "../src/api/v1/services/courseDataService";
import mockCourses from "./data/courseSample";

jest.mock("../src/api/v1/services/courseDataService", () => ({
  getAllCourses: jest.fn(),
  getCourseById: jest.fn(),
  createCourse: jest.fn(),
  updateCourse: jest.fn(),
  deleteCourse: jest.fn(),
}));

describe("course Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = { query: {}, params: {}, body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { uid: "admin" },
    };
    mockNext = jest.fn();
  });

  describe("getAllCourses", () => {
    it("should return the courses meeting the requirements", async () => {
      mockReq.query = {
        courseCode: "COMP-3018",
        courseName: "Back-End Development",
      };
      (courseDataService.getAllCourses as jest.Mock).mockResolvedValue(
        mockCourses
      );
      await courseController.getAllCourses(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(courseDataService.getAllCourses).toHaveBeenCalledWith(
        "admin",
        "COMP-3018",
        "Back-End Development"
      );
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Course Retrieved",
        data: mockCourses,
        status: "success",
      });
    });
    it("should return the all courses whilt not giving the query paras", async () => {
      mockReq.query = {
        courseCode: undefined,
        courseName: undefined,
      };
      (courseDataService.getAllCourses as jest.Mock).mockResolvedValue(
        mockCourses
      );
      await courseController.getAllCourses(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(courseDataService.getAllCourses).toHaveBeenCalledWith(
        "admin",
        undefined,
        undefined
      );
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Course Retrieved",
        data: mockCourses,
        status: "success",
      });
    });

    it("should call the next funtion for handle error when error occurs while get all courses", async () => {
      (courseDataService.getAllCourses as jest.Mock).mockRejectedValue(
        "failed"
      );

      mockReq.query = { courseCode: "COMP-3018" };

      await courseController.getAllCourses(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );
      expect(mockNext).toHaveBeenCalledTimes(1);
    });
  });
  describe("getCourseById", () => {
    it("should return the course with the specific id", async () => {
      (courseDataService.getCourseById as jest.Mock).mockResolvedValue(
        mockCourses
      );

      mockReq.params = { id: "1234" };

      await courseController.getCourseById(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Course Found",
        data: mockCourses,
        status: "success",
      });
    });
    it("should call the next funtion for handle error when error occurs while get specific course", async () => {
      (courseDataService.getCourseById as jest.Mock).mockRejectedValue(
        "failed"
      );
      mockReq.params = { id: "1234" };
      await courseController.getCourseById(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );
      expect(mockNext).toHaveBeenCalledTimes(1);
    });
  });
  describe("createCourse", () => {
    it("should create the course successfully", async () => {
      mockReq.body = mockCourses;
      (courseDataService.createCourse as jest.Mock).mockResolvedValue(
        mockCourses
      );

      mockReq.params = { id: "1234" };

      await courseController.createCourse(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Course Created",
        data: mockCourses,
        status: "success",
      });
    });
    it("should call the next funtion for handle error when error occurs while create specific course", async () => {
      (courseDataService.createCourse as jest.Mock).mockRejectedValue("failed");
      await courseController.createCourse(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );
      expect(mockNext).toHaveBeenCalledTimes(1);
    });
  });
  describe("updateCourse", () => {
    it("should update the course successfully", async () => {
      mockReq.body = mockCourses;
      (courseDataService.updateCourse as jest.Mock).mockResolvedValue(
        mockCourses
      );

      mockReq.params = { id: "1234" };

      await courseController.updateCourse(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Course Updated",
        data: mockCourses,
        status: "success",
      });
    });
    it("should call the next funtion for handle error when error occurs while update specific course", async () => {
      (courseDataService.updateCourse as jest.Mock).mockRejectedValue("failed");
      mockReq.params = { id: "1234" };
      await courseController.updateCourse(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );
      expect(mockNext).toHaveBeenCalledTimes(1);
    });
  });
  describe("deleteCourse", () => {
    it("should delete the course successfully", async () => {
      (courseDataService.deleteCourse as jest.Mock).mockResolvedValue(
        mockCourses
      );

      mockReq.params = { id: "1234" };

      await courseController.deleteCourse(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Course Deleted",
        data: null,
        status: "success",
      });
    });
  });
  it("should call the next funtion for handle error when error occurs while delete specific course", async () => {
    (courseDataService.deleteCourse as jest.Mock).mockRejectedValue("failed");
    mockReq.params = { id: "1234" };
    await courseController.deleteCourse(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );
    expect(mockNext).toHaveBeenCalledTimes(1);
  });
});
