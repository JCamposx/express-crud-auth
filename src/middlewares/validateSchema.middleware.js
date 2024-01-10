/**
 * Validate request data against a Zod schema.
 */
const validateSchema = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);

    next();
  } catch (error) {
    if (!error.errors) {
      res.status(500).json({
        message: error.message,
      });

      return;
    }

    const validationErrors = error.errors.reduce((acc, err) => {
      const fieldName = err.path[0];
      const errorMessage = err.message;

      acc[fieldName] = acc[fieldName] || [];
      acc[fieldName].push(errorMessage);

      return acc;
    }, {});

    res.status(400).json({
      errors: validationErrors,
    });

    return;
  }
};

export default validateSchema;
