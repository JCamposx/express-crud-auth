import INVALID_STRINGS from "../helpers/constants/invalidStrings.js";

import { updateSchema } from "../../../../schemas/director.schema.js";
import validateSchema from "../helpers/functions/validateSchema.js";

describe("director - update schema", () => {
  const VALID_DATA = {
    name: "New name",
    lastname: "New lastname",
    nationality: "New nationality",
  };

  describe("when data is not correct", () => {
    describe("when name is not string", () => {
      test.each(INVALID_STRINGS)(
        "should throw an error for %p as given name",
        (invalidName) => {
          const dataWithNotStringName = {
            ...VALID_DATA,
            name: invalidName,
          };

          const expectedErrors = [{ path: ["name"] }];

          validateSchema({
            schema: updateSchema,
            data: dataWithNotStringName,
            expectedErrors,
          });
        },
      );
    });

    describe("when lastname is not string", () => {
      test.each(INVALID_STRINGS)(
        "should throw an error for %p as given lastname",
        (invalidName) => {
          const dataWithNotStringName = {
            ...VALID_DATA,
            lastname: invalidName,
          };

          const expectedErrors = [{ path: ["lastname"] }];

          validateSchema({
            schema: updateSchema,
            data: dataWithNotStringName,
            expectedErrors,
          });
        },
      );
    });

    describe("when nationality is not string", () => {
      test.each(INVALID_STRINGS)(
        "should throw an error for %p as given nationality",
        (invalidName) => {
          const dataWithNotStringName = {
            ...VALID_DATA,
            nationality: invalidName,
          };

          const expectedErrors = [{ path: ["nationality"] }];

          validateSchema({
            schema: updateSchema,
            data: dataWithNotStringName,
            expectedErrors,
          });
        },
      );
    });
  });

  describe("when data is completely correct", () => {
    describe("when some fields are missing", () => {
      const FIELD_NAMES = {
        NAME: "name",
        LASTNAME: "lastname",
        NATIONALITY: "nationality",
      };

      const MISSING_FIELDS = [
        ...Object.values(FIELD_NAMES),
        [FIELD_NAMES.NAME, FIELD_NAMES.LASTNAME],
        [FIELD_NAMES.LASTNAME, FIELD_NAMES.NATIONALITY],
        [FIELD_NAMES.NAME, FIELD_NAMES.NATIONALITY],
        [FIELD_NAMES.NAME, FIELD_NAMES.LASTNAME, FIELD_NAMES.NATIONALITY],
      ];

      test.each(MISSING_FIELDS)(
        "should pass validation if %p is missing",
        (missingField) => {
          const dataWithMissingFields = { ...VALID_DATA };

          if (Array.isArray(missingField)) {
            missingField.forEach(
              (field) => delete dataWithMissingFields[field],
            );
          } else {
            delete dataWithMissingFields[missingField];
          }

          const errors = validateSchema({
            schema: updateSchema,
            data: dataWithMissingFields,
            shouldThrowError: false,
          });

          expect(errors).not.toBeDefined();
        },
      );
    });

    describe("when fields are fully completed", () => {
      test("should pass validation without any error", () => {
        const errors = validateSchema({
          schema: updateSchema,
          data: VALID_DATA,
          shouldThrowError: false,
        });

        expect(errors).not.toBeDefined();
      });
    });
  });
});
