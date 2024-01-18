import INVALID_PASSWORDS from "./helpers/constants/invalidPasswords.js";
import INVALID_EMAILS from "./helpers/constants/invalidEmails.js";

import validateSchema from "../helpers/functions/validateSchema.js";
import { registerSchema } from "../../../../schemas/auth.schema.js";

describe("register schema", () => {
  const VALID_DATA = {
    username: "usertest",
    email: "user@test.com",
    password: "password1234",
    password_confirmation: "password1234",
  };

  describe("when data is not correct", () => {
    describe("when username is not valid", () => {
      test("should throw an error if username is missing", () => {
        const dataWithoutUsername = { ...VALID_DATA };

        delete dataWithoutUsername.username;

        const expectedErrors = [
          {
            message: "Username is required",
            path: ["username"],
          },
        ];

        validateSchema({
          schema: registerSchema,
          data: dataWithoutUsername,
          expectedErrors,
        });
      });
    });

    describe("when email is not valid", () => {
      test("should throw an error if email is missing", () => {
        const dataWithoutEmail = { ...VALID_DATA };

        delete dataWithoutEmail.email;

        const expectedErrors = [
          { message: "Email is required", path: ["email"] },
        ];

        validateSchema({
          schema: registerSchema,
          data: dataWithoutEmail,
          expectedErrors,
        });
      });

      describe("when email doesn't have a correct format", () => {
        test.each(INVALID_EMAILS)(
          "should throw an error with %p as given email",
          (invalidEmail) => {
            const dataWithInvalidEmail = {
              ...VALID_DATA,
              email: invalidEmail,
            };

            const expectedErrors = [
              { message: "Invalid email format", path: ["email"] },
            ];

            validateSchema({
              schema: registerSchema,
              data: dataWithInvalidEmail,
              expectedErrors,
            });
          },
        );
      });
    });

    describe("when password and password confirmation are not valid", () => {
      test("should throw an error if password is missing", () => {
        const dataWithoutPassword = { ...VALID_DATA };

        delete dataWithoutPassword.password;

        expect(() => registerSchema.parse(dataWithoutPassword)).toThrow();

        const expectedErrors = [
          { message: "Password is required", path: ["password"] },
        ];

        validateSchema({
          schema: registerSchema,
          data: dataWithoutPassword,
          expectedErrors,
        });
      });

      test("should throw an error if password confirmation is missing", () => {
        const dataWithoutPasswordConfirmation = { ...VALID_DATA };

        delete dataWithoutPasswordConfirmation.password_confirmation;

        const expectedErrors = [
          {
            message: "Password confirmation is required",
            path: ["password_confirmation"],
          },
        ];

        validateSchema({
          schema: registerSchema,
          data: dataWithoutPasswordConfirmation,
          expectedErrors,
        });
      });

      describe("when password and password confirmation length are less than 6 characters", () => {
        test.each(INVALID_PASSWORDS)(
          "should throw an error with %p as given password and password confirmation",
          (invalidPassword) => {
            const dataWithInvalidPasswords = {
              ...VALID_DATA,
              password: invalidPassword,
              password_confirmation: invalidPassword,
            };

            const expectedErrors = [
              {
                message: "Password must be at least 6 characters",
                path: ["password"],
              },
              {
                message: "Password confirmation must be at least 6 characters",
                path: ["password_confirmation"],
              },
            ];

            validateSchema({
              schema: registerSchema,
              data: dataWithInvalidPasswords,
              expectedErrors,
            });
          },
        );
      });

      test("should throw an error if password doesn't match password confirmation", () => {
        const dataWithDifferentPasswordConfirmation = {
          ...VALID_DATA,
          password_confirmation: "somedifferentpassword",
        };

        const expectedErrors = [
          {
            message: "Password confirmation must match the password",
            path: ["password_confirmation"],
          },
        ];

        validateSchema({
          schema: registerSchema,
          data: dataWithDifferentPasswordConfirmation,
          expectedErrors,
        });
      });
    });
  });

  describe("when data completely correct", () => {
    test("should pass validation without any error", () => {
      const errors = validateSchema({
        schema: registerSchema,
        data: VALID_DATA,
        shouldThrowError: false,
      });

      expect(errors).not.toBeDefined();
    });
  });
});
