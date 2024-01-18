import { ZodError } from "zod";

import INVALID_PASSWORDS from "./helpers/constants/invalidPasswords.js";
import INVALID_EMAILS from "./helpers/constants/invalidEmails.js";

import { registerSchema } from "../../../../schemas/auth.schema.js";

describe("register schema", () => {
  let errors;

  const VALID_DATA = {
    username: "usertest",
    email: "user@test.com",
    password: "password1234",
    password_confirmation: "password1234",
  };

  afterEach(() => (errors = undefined));

  describe("when data is not correct", () => {
    describe("when username is not valid", () => {
      test("should throw an error if username is missing", () => {
        const dataWithoutUsername = { ...VALID_DATA };

        delete dataWithoutUsername.username;

        try {
          registerSchema.parse(dataWithoutUsername);
        } catch (error) {
          expect(error).toBeInstanceOf(ZodError);

          errors = error.errors;
        }

        expect(errors).toBeDefined();

        expect(errors).toHaveLength(1);

        expect(errors).toContainEqual(
          expect.objectContaining({
            message: "Username is required",
            path: ["username"],
          }),
        );
      });
    });

    describe("when email is not valid", () => {
      test("should throw an error if email is missing", () => {
        const dataWithoutEmail = { ...VALID_DATA };

        delete dataWithoutEmail.email;

        try {
          registerSchema.parse(dataWithoutEmail);
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
          "should throw an error with %p as given email",
          (invalidEmail) => {
            const dataWithInvalidEmail = {
              ...VALID_DATA,
              email: invalidEmail,
            };

            try {
              registerSchema.parse(dataWithInvalidEmail);
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

    describe("when password and password confirmation are not valid", () => {
      test("should throw an error if password is missing", () => {
        const dataWithoutPassword = { ...VALID_DATA };

        delete dataWithoutPassword.password;

        expect(() => registerSchema.parse(dataWithoutPassword)).toThrow();

        try {
          registerSchema.parse(dataWithoutPassword);

          fail("Expected an exception to be thrown");
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

      test("should throw an error if password confirmation is missing", () => {
        const dataWithoutPasswordConfirmation = { ...VALID_DATA };

        delete dataWithoutPasswordConfirmation.password_confirmation;

        try {
          registerSchema.parse(dataWithoutPasswordConfirmation);
        } catch (error) {
          expect(error).toBeInstanceOf(ZodError);

          errors = error.errors;
        }

        expect(errors).toBeDefined();

        expect(errors).toHaveLength(1);

        expect(errors).toContainEqual(
          expect.objectContaining({
            message: "Password confirmation is required",
            path: ["password_confirmation"],
          }),
        );
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

            try {
              registerSchema.parse(dataWithInvalidPasswords);
            } catch (error) {
              expect(error).toBeInstanceOf(ZodError);

              errors = error.errors;
            }

            expect(errors).toBeDefined();

            expect(errors).toHaveLength(2);

            expect(errors).toContainEqual(
              expect.objectContaining({
                message: "Password must be at least 6 characters",
                path: ["password"],
              }),
            );

            expect(errors).toContainEqual(
              expect.objectContaining({
                message: "Password confirmation must be at least 6 characters",
                path: ["password_confirmation"],
              }),
            );
          },
        );
      });

      test("should throw an error if password doesn't match password confirmation", () => {
        const dataWithDifferentPasswordConfirmation = {
          ...VALID_DATA,
          password_confirmation: "somedifferentpassword",
        };

        try {
          registerSchema.parse(dataWithDifferentPasswordConfirmation);
        } catch (error) {
          expect(error).toBeInstanceOf(ZodError);

          errors = error.errors;
        }

        expect(errors).toBeDefined();

        expect(errors).toHaveLength(1);

        expect(errors).toContainEqual(
          expect.objectContaining({
            message: "Password confirmation must match the password",
            path: ["password_confirmation"],
          }),
        );
      });
    });
  });

  describe("when data completely correct", () => {
    test("should pass validation without any error", () => {
      expect(() => registerSchema.parse(VALID_DATA)).not.toThrow();
    });
  });
});
