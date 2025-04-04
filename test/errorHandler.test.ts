import { Request, Response, NextFunction } from "express";
import { RepositoryError, ServiceError } from "../src/api/v1/errors/errors";
import errorHandler from "../src/api/v1/middleware/errorHandler";
import { errorResponse } from "../src/api/v1/models/responseModel";

// Mock the console.error to avoid cluttering test output
console.error = jest.fn();

describe("Error Handler Middleware", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it("should handle RepositoryError with custom status code and error code", () => {
    // Arrange
    const testError: RepositoryError = new RepositoryError(
      "Document not found",
      "DOCUMENT_NOT_FOUND",
      404
    );

    // Act
    errorHandler(testError, mockReq as Request, mockRes as Response, mockNext);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith(
      errorResponse("Document not found", "DOCUMENT_NOT_FOUND")
    );
  });

  it("should handle ServiceError with custom status code and error code", () => {
    // Arrange
    const testError: ServiceError = new ServiceError(
      "Invalid input",
      "INVALID_INPUT",
      400
    );

    // Act
    errorHandler(testError, mockReq as Request, mockRes as Response, mockNext);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(
      errorResponse("Invalid input", "INVALID_INPUT")
    );
  });

  it("should handle basic Error object with default status and code", () => {
    // Arrange
    const testError: Error = new Error("Basic error");

    // Act
    errorHandler(testError, mockReq as Request, mockRes as Response, mockNext);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith(
      errorResponse(
        "An unexpected error occurred that is not categorized by the application",
        "UNKNOWN_ERROR"
      )
    );
  });
});
