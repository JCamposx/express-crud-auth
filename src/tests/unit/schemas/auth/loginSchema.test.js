import INVALID_PASSWORDS from "./helpers/constants/invalidPasswords.js";
import INVALID_EMAILS from "./helpers/constants/invalidEmails.js";

import validateSchema from "../helpers/functions/validateSchema.js";
import { loginSchema } from "../../../../schemas/auth.schema.js";

describe("login schema", () => {
  const VALID_DATA = {
    email: "valid@email.com",
    password: "password1234",
  };

  describe("when data is not correct", () => {
    describe("when email is not valid", () => {
      test("should throw an error if email is missing", () => {
        const dataWithoutEmail = { ...VALID_DATA };

        delete dataWithoutEmail.email;

        const expectedErrors = [
          {
            message: "Email is required",
            path: ["email"],
          },
        ];

        validateSchema({
          schema: loginSchema,
          data: dataWithoutEmail,
          expectedErrors,
        });
      });

      describe("when email doesn't have a correct format", () => {
        test.each(INVALID_EMAILS)(
          "should throw an error for %p as given email",
          (invalidEmail) => {
            const dataWithInvalidEmail = {
              ...VALID_DATA,
              email: invalidEmail,
            };

            const expectedErrors = [
              {
                message: "Invalid email format",
                path: ["email"],
              },
            ];

            validateSchema({
              schema: loginSchema,
              data: dataWithInvalidEmail,
              expectedErrors,
            });
          },
        );
      });
    });

    describe("when password is not valid", () => {
      test("should throw an error if password is missing", () => {
        const dataWithoutPassword = { ...VALID_DATA };

        delete dataWithoutPassword.password;

        const expectedErrors = [
          {
            message: "Password is required",
            path: ["password"],
          },
        ];

        validateSchema({
          schema: loginSchema,
          data: dataWithoutPassword,
          expectedErrors,
        });
      });

      describe("when password length is less than 6 characters", () => {
        test.each(INVALID_PASSWORDS)(
          "should throw an error with %p as given password",
          (invalidPassword) => {
            const dataWithInvalidPassword = {
              ...VALID_DATA,
              password: invalidPassword,
            };

            const expectedErrors = [
              {
                message: "Password must be at least 6 characters",
                path: ["password"],
              },
            ];

            validateSchema({
              schema: loginSchema,
              data: dataWithInvalidPassword,
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
        schema: loginSchema,
        data: VALID_DATA,
        shouldThrowError: false,
      });

      expect(errors).not.toBeDefined();
    });
  });
});
