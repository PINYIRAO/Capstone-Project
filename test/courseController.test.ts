import { Request, Response, NextFunction } from "express";
import * as courseController from "../src/api/v1/controllers/courseController";
import * as courseService from "../src/api/v1/services/courseService";
import mockCourses from "./data/courseSample";

jest.mock("../src/api/v1/services/courseService", () => ({
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
    mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    mockNext = jest.fn();
  });

  describe("getAllCourses", () => {
    it("should return the courses meeting the requirements", async () => {
      mockReq.query = {
        courseCode: "COMP-3018",
        courseName: "Back-End Development",
      };
      (courseService.getAllCourses as jest.Mock).mockResolvedValue(mockCourses);
      await courseController.getAllCourses(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(courseService.getAllCourses).toHaveBeenCalledWith(
        "COMP-3018",
        "Back-End Development"
      );
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Course Retrieved",
        data: mockCourses,
        status: "success",
      });
    });
    it("should call the next funtion for handle error when error occurs while get all courses", async () => {
      (courseService.getAllCourses as jest.Mock).mockRejectedValue("failed");

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
      (courseService.getCourseById as jest.Mock).mockResolvedValue(mockCourses);

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
      (courseService.getCourseById as jest.Mock).mockRejectedValue("failed");
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
      (courseService.createCourse as jest.Mock).mockResolvedValue(mockCourses);

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
      (courseService.createCourse as jest.Mock).mockRejectedValue("failed");
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
      (courseService.updateCourse as jest.Mock).mockResolvedValue(mockCourses);

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
      (courseService.updateCourse as jest.Mock).mockRejectedValue("failed");
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
      (courseService.deleteCourse as jest.Mock).mockResolvedValue(mockCourses);

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
    (courseService.deleteCourse as jest.Mock).mockRejectedValue("failed");
    mockReq.params = { id: "1234" };
    await courseController.deleteCourse(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );
    expect(mockNext).toHaveBeenCalledTimes(1);
  });
});
