jest.mock("multer", () => {
  // mock the array to a middleware function
  const middleMock: jest.Mock = jest.fn(
    (_fieldName: string, _filenumber: number) =>
      (req: Request, res: Response, next: NextFunction) =>
        next()
  );
  return {
    __esModule: true,
    default: jest.fn(() => ({
      array: middleMock,
    })),
    diskStorage: jest.fn(),
  };
});
import { Request, Response, NextFunction } from "express";
import upload from "../src/api/v1/middleware/upload";
import * as multer from "multer";
describe("upload middleware", () => {
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

  it("should recall the multer functions", async () => {
    upload(mockReq as Request, mockRes as Response, mockNext);
    expect(multer.default).toHaveBeenCalled();
    expect(multer.default().array).toHaveBeenCalled();
  });
});
