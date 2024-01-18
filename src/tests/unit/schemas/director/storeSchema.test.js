import INVALID_STRINGS from "../helpers/constants/invalidStrings.js";

import { storeSchema } from "../../../../schemas/director.schema.js";
import validateSchema from "../helpers/functions/validateSchema.js";

describe("director - store schema", () => {
  const VALID_DATA = {
    name: "Some director name",
    lastname: "Some lastname",
    nationality: "SomeCountry",
  };

  describe("when data is not correct", () => {
    describe("when name is invalid", () => {
      test("should throw an error if name is missing", () => {
        const dataWithoutName = { ...VALID_DATA };

        delete dataWithoutName.name;

        const expectedErrors = [
          {
            message: "Name is required",
            path: ["name"],
          },
        ];

        validateSchema({
          schema: storeSchema,
          data: dataWithoutName,
          expectedErrors,
        });
      });

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
              schema: storeSchema,
              data: dataWithNotStringName,
              expectedErrors,
            });
          },
        );
      });
    });

    describe("when lastname is invalid", () => {
      test("should throw an error if lastname is missing", () => {
        const dataWithoutName = { ...VALID_DATA };

        delete dataWithoutName.lastname;

        const expectedErrors = [
          {
            message: "Lastname is required",
            path: ["lastname"],
          },
        ];

        validateSchema({
          schema: storeSchema,
          data: dataWithoutName,
          expectedErrors,
        });
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
              schema: storeSchema,
              data: dataWithNotStringName,
              expectedErrors,
            });
          },
        );
      });
    });

    describe("when nationality is invalid", () => {
      test("should throw an error if nationality is missing", () => {
        const dataWithoutName = { ...VALID_DATA };

        delete dataWithoutName.nationality;

        const expectedErrors = [
          {
            message: "Nationality is required",
            path: ["nationality"],
          },
        ];

        validateSchema({
          schema: storeSchema,
          data: dataWithoutName,
          expectedErrors,
        });
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
              schema: storeSchema,
              data: dataWithNotStringName,
              expectedErrors,
            });
          },
        );
      });
    });
  });

  describe("when data completely correct", () => {
    test("should pass validation without any error", () => {
      const errors = validateSchema({
        schema: storeSchema,
        data: VALID_DATA,
        shouldThrowError: false,
      });

      expect(errors).not.toBeDefined();
    });
  });
});
