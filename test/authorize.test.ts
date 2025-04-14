import { Request, Response } from "express";
import isAuthorized from "../src/api/v1/middleware/authorize";
// import { AuthorizationError } from "../src/api/v1/errors/errors";
import { MiddlewareFunction } from "../src/api/v1/types/expressTypes";

describe("isAuthorized middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      params: {},
    };
    mockResponse = {
      locals: {},
    };
    nextFunction = jest.fn();
  });

  it("should call next() when user has required role", () => {
    // Arrange
    mockResponse.locals = {
      uid: "user123",
      role: "admin",
    };

    const middleware: MiddlewareFunction = isAuthorized({
      hasRole: ["admin", "manager"],
    });

    // Act
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    // Assert
    expect(nextFunction).toHaveBeenCalled();
  });

  it("should call next() when same user and allowSameUser is true", () => {
    // Arrange
    mockRequest.params = { id: "user123" };
    mockResponse.locals = {
      uid: "user123",
      role: "user",
    };

    const middleware: MiddlewareFunction = isAuthorized({
      hasRole: ["admin"],
      allowSameUser: true,
    });

    // Act
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    // Assert
    expect(nextFunction).toHaveBeenCalled();
  });
});
