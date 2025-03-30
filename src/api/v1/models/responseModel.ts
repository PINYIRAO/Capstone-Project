/**
 * Interface representing a standard API response.
 * @template T - The type of the data property.
 */
export interface ApiResponse<T> {
  status: string /** The status of the response, e.g., 'success' or 'error'. */;
  data?: T /** The data returned in the response. */;
  message?: string /** A message providing additional information about the response. */;
  error?: string /** An error message, if applicable. */;
  code?: string /** An error code, if applicable. */;
}

/**
 * Creates a success response object.
 * @template T - The type of the data property.
 * @param {T} [data] - The data to include in the response.
 * @param {string} [message] - A message providing additional information about the response.
 * @returns {ApiResponse<T | {}>} The success response object.
 */
export const successResponse = <T>(
  data?: T /** The data to include in the response. */,
  message?: string /** A message providing additional information about the response. */
): ApiResponse<T> => ({
  status: "success",
  data,
  message,
});

/**
 * Creates an error response object.
 * @param {string} message - The error message.
 * @param {string} [code] - The error code.
 * @returns {ApiResponse<null>} The error response object.
 */
export const errorResponse = (
  message: string /** The error message. */,
  code?: string /** The error code. */
): ApiResponse<null> => ({
  status: "error",
  message,
  code,
});
