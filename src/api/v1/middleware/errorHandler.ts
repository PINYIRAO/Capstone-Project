import { Request, Response, NextFunction } from "express";
import { errorLogger } from "./logger";
import { ExtendedError } from "../errors/errors";
import { errorResponse } from "../models/responseModel";
import { getErrorCode } from "../utils/errorUtils";
import { HTTP_STATUS } from "../../../constants/httpConstants";

/**
 * Global error handling middleware for an Express application.
 * Catches all errors passed to next() and formats them into a consistent response format.
 *
 * @param err - The error object passed from previous middleware or route handlers
 * @param req - Express request object
 * @param res - Express response object
 * @param _next - Express next function (unused but required for Express error middleware signature)
 *
 * Features:
 * - Handles RepositoryError and ServiceError with their specific status codes and messages
 * - Provides consistent error response format
 * - Logs errors for debugging
 *
 * @example
 * // In your Express app setup after all other middleware and controllers:
 * app.use(errorHandler);
 *
 * // In your route handlers:
 * router.get('/users/:id', async (req, res, next) => {
 *   try {
 *     // ... your logic
 *   } catch (error: unknown) {
 *     if (error instanceof RepositoryError) {
 *       next(error);  // Will be handled with proper status code and message
 *     } else {
 *       next(new ServiceError("User operation failed", "USER_ERROR", 400));
 *     }
 *   }
 * });
 */
const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // log the error with detailed information
  errorLogger.error(err.message, {
    code: getErrorCode(err),
    stack: err.stack,
    method: req.method,
    url: req.url,
    header: req.headers,
    environment: process.env.NODE_ENV,
  });

  // handle specific types of errors
  if (err instanceof ExtendedError) {
    res.status(err.statusCode).json(errorResponse(err.message, err.code));
  } else {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(
        errorResponse(
          "An unexpected error occurred that is not categorized by the application",
          "UNKNOWN_ERROR"
        )
      );
  }
};

export default errorHandler;
