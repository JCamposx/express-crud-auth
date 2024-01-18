import { ZodError, ZodObject } from "zod";

/**
 * Validates schema errors for a given data against a Zod schema.
 *
 * @param {Object} params - The parameters for validation.
 * @param {ZodObject} params.schema - The Zod schema to validate against.
 * @param {Object} params.data - The data to validate against the schema.
 * @param {Object[]} [params.expectedErrors=[]] - The expected errors to match against.
 * @param {Boolean} [params.shouldThrowError=true] - Whether the validation should throw an error.
 * @returns {Object[]} - The actual errors after validating the data.
 */
const validateSchema = ({
  schema,
  data,
  expectedErrors = [],
  shouldThrowError = true,
}) => {
  if (!shouldThrowError) {
    expect(() => schema.parse(data)).not.toThrow();

    return;
  }

  let errors;

  try {
    schema.parse(data);
  } catch (error) {
    expect(error).toBeInstanceOf(ZodError);

    errors = error.errors;
  }

  expect(errors).toBeDefined();

  expect(errors).toHaveLength(expectedErrors.length);

  expectedErrors.forEach((expectedError) => {
    expect(errors).toContainEqual(expect.objectContaining(expectedError));
  });

  return errors;
};

export default validateSchema;
