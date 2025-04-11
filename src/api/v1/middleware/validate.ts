// External library imports
import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import { ValidationError } from "../errors/errors";

// internal module imports
import { MiddlewareFunction, RequestData } from "../types/expressTypes";
import { getErrorCode } from "../utils/errorUtils";

/**
 * Function to validate data using a schema.
 * @param {ObjectSchema} schema - The Joi schema to validate against.
 * @param {T} data - The data to be validated.
 * @throws {Error} - Throws an error if validation fails.
 */
export const validate = <T>(schema: ObjectSchema<T>, data: T): void => {
  const { error } = schema.validate(data, { abortEarly: false });
  if (error) {
    throw new ValidationError(
      `Validation error: ${error.details.map((x) => x.message).join(", ")}`,
      "VALIDATION_ERROR"
    );
  }
};

/**
 * Middleware to validate a request based on the schema.
 * Combines all parts of the request (body, params, query) for validation.
 * @param {ObjectSchema} schema - The Joi schema to validate against.
 * @returns {(req: Request, res: Response, next: NextFunction) => void} The middleware function.
 */
export const validateRequest = (schema: ObjectSchema): MiddlewareFunction => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: RequestData = {
        ...req.body,
        ...req.params,
        ...req.query,
      };
      validate(schema, data);
      next();
    } catch (error) {
      throw new ValidationError((error as Error).message, getErrorCode(error));
    }
  };
};
