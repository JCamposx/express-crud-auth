/**
 * Custom error class for handling HTTP-related errors.
 * @class HTTPError
 * @extends Error
 * @param {string} message - The error message.
 * @param {number} [statusCode=500] - The HTTP status code.
 */
class HTTPError extends Error {
  constructor(message, statusCode = 500) {
    super(message);

    this.statusCode = statusCode;
  }
}

export default HTTPError;
