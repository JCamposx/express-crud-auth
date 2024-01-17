import { ZodError } from "zod";

import INVALID_PASSWORDS from "./helpers/constants/invalidPasswords.js";
import INVALID_EMAILS from "./helpers/constants/invalidEmails.js";

import { loginSchema } from "../../../../schemas/auth.schema.js";

describe("login schema", () => {
  let errors;

  const VALID_DATA = {
    email: "valid@email.com",
    password: "password1234",
  };

  afterEach(() => (errors = undefined));

  describe("when data is not correct", () => {
    describe("when email is not valid", () => {
      test("should throw an error if email is missing", () => {
        const dataWithoutEmail = { ...VALID_DATA };

        delete dataWithoutEmail.email;

        try {
          loginSchema.parse(dataWithoutEmail);
        } catch (error) {
          expect(error).toBeInstanceOf(ZodError);

          errors = error.errors;
        }

        expect(errors).toBeDefined();

        expect(errors).toHaveLength(1);

        expect(errors).toContainEqual(
          expect.objectContaining({
            message: "Email is required",
            path: ["email"],
          }),
        );
      });

      describe("when email doesn't have a correct format", () => {
        test.each(INVALID_EMAILS)(
          "should throw an error for %p as given email",
          (invalidEmail) => {
            const dataWithInvalidEmail = {
              ...VALID_DATA,
              email: invalidEmail,
            };

            try {
              loginSchema.parse(dataWithInvalidEmail);
            } catch (error) {
              expect(error).toBeInstanceOf(ZodError);

              errors = error.errors;
            }

            expect(errors).toBeDefined();

            expect(errors).toHaveLength(1);

            expect(errors).toContainEqual(
              expect.objectContaining({
                message: "Invalid email format",
                path: ["email"],
              }),
            );
          },
        );
      });
    });

    describe("when password is not valid", () => {
      test("should throw an error if password is missing", () => {
        const dataWithoutPassword = { ...VALID_DATA };

        delete dataWithoutPassword.password;

        try {
          loginSchema.parse(dataWithoutPassword);
        } catch (error) {
          expect(error).toBeInstanceOf(ZodError);

          errors = error.errors;
        }

        expect(errors).toBeDefined();

        expect(errors).toHaveLength(1);

        expect(errors).toContainEqual(
          expect.objectContaining({
            message: "Password is required",
            path: ["password"],
          }),
        );
      });

      describe("when password length is less than 6 characters", () => {
        test.each(INVALID_PASSWORDS)(
          "should throw an error with %p as given password",
          (invalidPassword) => {
            const dataWithInvalidPassword = {
              ...VALID_DATA,
              password: invalidPassword,
            };

            try {
              loginSchema.parse(dataWithInvalidPassword);
            } catch (error) {
              expect(error).toBeInstanceOf(ZodError);

              errors = error.errors;
            }

            expect(errors).toBeDefined();

            expect(errors).toHaveLength(1);

            expect(errors).toContainEqual(
              expect.objectContaining({
                message: "Password must be at least 6 characters",
                path: ["password"],
              }),
            );
          },
        );
      });
    });
  });

  describe("when data completely correct", () => {
    test("should pass validation without any error", () => {
      expect(() => loginSchema.parse(VALID_DATA)).not.toThrow();
    });
  });
});
