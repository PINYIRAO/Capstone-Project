jest.mock("../config/firebaseConfig", () => ({
  auth: { verifyIdToken: jest.fn() },
}));

import dotenv from "dotenv";
dotenv.config();
import { Request, Response } from "express";
import authenticate from "../src/api/v1/middleware/authenticate";
import { auth } from "../config/firebaseConfig";
import { AuthenticationError } from "../src/api/v1/errors/errors";

describe("authenticate middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      locals: {},
    };
    nextFunction = jest.fn();
  });

  it("should call next passing authenticationError when no token is provided", async () => {
    // Assemble
    const expectedError: AuthenticationError = new AuthenticationError(
      "Unauthorized: No token provided",
      "TOKEN_NOT_FOUND"
    );

    await authenticate(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalledWith(expectedError);
  });

  it("should call next passing authenticationError when malformed token is provided", async () => {
    // Assemble
    mockRequest.headers = {
      authorization: "Bearer ",
    };

    const expectedError: AuthenticationError = new AuthenticationError(
      "Unauthorized: No token provided",
      "TOKEN_NOT_FOUND"
    );

    await authenticate(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalledWith(expectedError);
  });

  // If we were testing for errors thrown instead...
  // it("should throw authenticationError when no token is provided", async () => {
  //     await expect(
  //         authenticate(
  //             mockRequest as Request,
  //             mockResponse as Response,
  //             nextFunction
  //         )
  //     ).rejects.toThrow(AuthenticationError);

  //     expect(nextFunction).not.toHaveBeenCalled();
  // });

  it("should call next() when token is valid", async () => {
    // Assemble
    mockRequest.headers = {
      authorization: "Bearer mock-token",
    };

    // mock the google function "verifyIdToken"
    (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({
      uid: "mock-uid",
      role: "user",
    });

    // Act
    await authenticate(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(auth.verifyIdToken).toHaveBeenCalledWith("mock-token");
    expect(mockResponse.locals).toEqual({
      uid: "mock-uid",
      role: "user",
    });
    expect(nextFunction).toHaveBeenCalled();
  });
});
