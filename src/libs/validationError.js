import HTTPError from "./httpError.js";

/**
 * Custom error class for handling HTTP-related errors.
 * @class ValidationError
 * @extends HTTPError
 * @param {Object.<string, string | string[]>} [errors] - Object containing validation errors.
 */
class ValidationError extends HTTPError {
  constructor(errors = {}) {
    super("Failed validating data", 422);

    Object.entries(errors).forEach(([key, value]) => {
      errors[key] = Array.isArray(value) ? value : [value];
    });

    this.errors = errors;
  }
}

export default ValidationError;
