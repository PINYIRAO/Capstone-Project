jest.mock(
  "../src/api/v1/services/scheduleCourse/getCoursesForScheduleService",
  () => ({
    getCoursesForSchedule: jest.fn(),
  })
);
jest.mock("../src/api/v1/services/scheduleCourse/calcSchedulesService", () => ({
  calcSchedules: jest.fn(),
}));
jest.mock("../src/api/v1/services/scheduleCourse/sortSchedulesService", () => ({
  sortSchedules: jest.fn(),
}));
jest.mock("../src/api/v1/models/responseModel", () => ({
  successResponse: jest.fn(),
}));

import { Request, Response, NextFunction } from "express";
import { getCoursesForSchedule } from "../src/api/v1/services/scheduleCourse/getCoursesForScheduleService";
import { calcSchedules } from "../src/api/v1/services/scheduleCourse/calcSchedulesService";
import { sortSchedules } from "../src/api/v1/services/scheduleCourse/sortSchedulesService";
import { getAllSchedules } from "../src/api/v1/controllers/scheduleController";
import { successResponse } from "../src/api/v1/models/responseModel";

describe("schedules Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = { query: {}, params: {}, body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { uid: "testUid" },
    };
    mockNext = jest.fn();
  });

  it("show return sorted schedules", async () => {
    (getCoursesForSchedule as jest.Mock).mockResolvedValue({
      courses: ["2"],
    });
    (calcSchedules as jest.Mock).mockReturnValue({ schedules: ["3"] });
    (sortSchedules as jest.Mock).mockReturnValue({ schedules: ["3"] });

    await getAllSchedules(mockReq as Request, mockRes as Response, mockNext);

    expect(getCoursesForSchedule).toHaveBeenCalledTimes(1);
    expect(calcSchedules).toHaveBeenCalledTimes(1);
    expect(sortSchedules).toHaveBeenCalledTimes(1);

    expect(mockRes.status).toHaveBeenCalledWith(200);
  });
  it("show return 200 if has no courses", async () => {
    (getCoursesForSchedule as jest.Mock).mockResolvedValue({
      courses: [],
      message: "no course",
    });
    await getAllSchedules(mockReq as Request, mockRes as Response, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(successResponse).toHaveBeenCalledWith([], "no course");
  });
  it("show return 200 if has no available schedules", async () => {
    (getCoursesForSchedule as jest.Mock).mockResolvedValue({
      courses: ["2"],
    });
    (calcSchedules as jest.Mock).mockReturnValue({
      schedules: [],
      message: "no available schedule",
    });
    await getAllSchedules(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(successResponse).toHaveBeenCalledWith([], "no available schedule");
  });
  it("pass to the next function if there is an error in the process", async () => {
    const err: Error = new Error("Test error message");
    (getCoursesForSchedule as jest.Mock).mockRejectedValue(err);
    await getAllSchedules(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(err);
  });
});
