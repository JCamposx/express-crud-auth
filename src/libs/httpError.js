/**
 * Custom error class for handling HTTP-related errors.
 * @class HTTPError
 * @extends Error
 * @param {string} message - The error message.
 * @param {number} [statusCode=500] - The HTTP status code.
 * @param {array} [errors=[]] - Array of additional error information.
 */
class HTTPError extends Error {
  constructor(message, statusCode = 500, errors = []) {
    super(message);

    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export default HTTPError;
