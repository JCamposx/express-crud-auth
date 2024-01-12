import HTTPError from "./httpError.js";

/**
 * Custom error class for handling HTTP-related errors.
 * @class ValidationError
 * @extends HTTPError
 * @param {Object.<string, string[]>} [errors] - Object containing validation errors.
 */
class ValidationError extends HTTPError {
  constructor(errors = {}) {
    super("Failed validating data", 422);

    this.errors = errors;
  }
}

export default ValidationError;
