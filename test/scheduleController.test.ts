jest.mock("../src/api/v1/controllers/schedule/getCoursesForSchedule", () => ({
  getCoursesForSchedule: jest.fn(),
}));
jest.mock("../src/api/v1/controllers/schedule/calcSchedules", () => ({
  calcSchedules: jest.fn(),
}));
jest.mock("../src/api/v1/controllers/schedule/sortSchedules", () => ({
  sortSchedules: jest.fn(),
}));

import { Request, Response, NextFunction } from "express";
import { getCoursesForSchedule } from "../src/api/v1/controllers/schedule/getCoursesForSchedule";
import { calcSchedules } from "../src/api/v1/controllers/schedule/calcSchedules";
import { sortSchedules } from "../src/api/v1/controllers/schedule/sortSchedules";
import { getAllSchedules } from "../src/api/v1/controllers/schedule/scheduleController";

describe("schedules Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = { query: {}, params: {}, body: {} };
    mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    mockNext = jest.fn();
  });

  it("show return sorted schedules", async () => {
    (getCoursesForSchedule as jest.Mock).mockResolvedValue({
      courses: ["2"],
    });
    (calcSchedules as jest.Mock).mockReturnValue({ schedules: ["3"] });

    await getAllSchedules(mockReq as Request, mockRes as Response, mockNext);

    expect(getCoursesForSchedule).toHaveBeenCalledTimes(1);
    expect(calcSchedules).toHaveBeenCalledTimes(1);
    expect(sortSchedules).toHaveBeenCalledTimes(1);

    expect(mockRes.status).toHaveBeenCalledWith(200);
  });
  it("show return 200 if has no courses", async () => {
    (getCoursesForSchedule as jest.Mock).mockResolvedValue({
      courses: [],
    });

    expect(mockRes.status).toHaveBeenCalledWith(200);
  });
  it("show return 200 if has no available schedules", async () => {
    (getCoursesForSchedule as jest.Mock).mockResolvedValue({
      courses: ["2"],
    });
    (calcSchedules as jest.Mock).mockReturnValue({ schedules: [] });

    expect(mockRes.status).toHaveBeenCalledWith(200);
  });
});
