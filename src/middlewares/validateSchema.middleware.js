import ValidationError from "../utils/classes/validationError.js";
import HTTPError from "../utils/classes/httpError.js";

/**
 * Validate request data against a Zod schema.
 */
const validateSchema = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);

    next();
  } catch (error) {
    if (!error.errors) {
      throw new HTTPError(error.message);
    }

    const validationErrors = error.errors.reduce((acc, err) => {
      const fieldName = err.path[0];
      const errorMessage = err.message;

      acc[fieldName] = acc[fieldName] || [];
      acc[fieldName].push(errorMessage);

      return acc;
    }, {});

    throw new ValidationError(validationErrors);
  }
};

export default validateSchema;
