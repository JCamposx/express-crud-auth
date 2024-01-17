import TYPE_FETCHING from "../../../utils/constants/typeFetching.js";
import ROUTES from "../../../utils/constants/routes.js";

import sendHTTPRequest from "../../../utils/functions/sendHTTPRequest.js";
import url from "../../../utils/functions/urlBuilder.js";
import User from "../../../models/user.model.js";

describe(`POST ${ROUTES.AUTH.REGISTER}`, () => {
  const FIELD_NAMES = {
    USERNAME: "username",
    EMAIL: "email",
    PASSWORD: "password",
    PASSWORD_CONFIRMATION: "password_confirmation",
  };

  const VALID_BODY = {
    [FIELD_NAMES.USERNAME]: "usertest",
    [FIELD_NAMES.EMAIL]: "user@test.com",
    [FIELD_NAMES.PASSWORD]: "usertest1234",
    [FIELD_NAMES.PASSWORD_CONFIRMATION]: "usertest1234",
  };

  describe("when required data is missing", () => {
    const MISSING_FIELDS = [
      FIELD_NAMES.USERNAME,
      FIELD_NAMES.EMAIL,
      FIELD_NAMES.PASSWORD,
      FIELD_NAMES.PASSWORD_CONFIRMATION,
      [FIELD_NAMES.PASSWORD, FIELD_NAMES.PASSWORD_CONFIRMATION],
      [FIELD_NAMES.USERNAME, FIELD_NAMES.EMAIL],
      [FIELD_NAMES.EMAIL, FIELD_NAMES.PASSWORD],
    ];

    test.each(MISSING_FIELDS)(
      "should return 422 if %p is missing",
      async (missingField) => {
        const bodyWithMissingData = { ...VALID_BODY };

        if (Array.isArray(missingField)) {
          missingField.forEach((field) => delete bodyWithMissingData[field]);
        } else {
          delete bodyWithMissingData[missingField];
        }

        const response = await sendHTTPRequest(
          url(ROUTES.AUTH.REGISTER),
          TYPE_FETCHING.POST,
          bodyWithMissingData,
        );

        expect(response.statusCode).toBe(422);

        const expectedErrors = {};

        if (Array.isArray(missingField)) {
          missingField.forEach((field) => {
            expectedErrors[field] = [expect.any(String)];
          });
        } else {
          expectedErrors[missingField] = [expect.any(String)];
        }

        expect(response.body).toEqual({
          message: expect.any(String),
          errors: expectedErrors,
        });
      },
    );
  });

  describe("when email doesn't have a correct format", () => {
    const INVALID_EMAILS = [
      "user",
      "user@test",
      "user@test.",
      "user@@test.com",
      "@user@@test.com",
    ];

    test.each(INVALID_EMAILS)(
      "should return 422 with %p as given email",
      async (invalidEmail) => {
        const bodyWithInvalidEmail = {
          ...VALID_BODY,
          [FIELD_NAMES.EMAIL]: invalidEmail,
        };

        const response = await sendHTTPRequest(
          url(ROUTES.AUTH.REGISTER),
          TYPE_FETCHING.POST,
          bodyWithInvalidEmail,
        );

        expect(response.statusCode).toBe(422);

        expect(response.body).toEqual({
          message: expect.any(String),
          errors: {
            [FIELD_NAMES.EMAIL]: [expect.any(String)],
          },
        });
      },
    );
  });

  describe("when password and password confirmation are invalid", () => {
    test("should return 422 if password and password confirmation are not at least 6 characters long", async () => {
      const INVALID_PASSWORDS = ["1", "12", "123", "1234", "12345"];

      for (const invalidPassword of INVALID_PASSWORDS) {
        const bodyWithInvalidPassword = {
          ...VALID_BODY,
          [FIELD_NAMES.PASSWORD]: invalidPassword,
          [FIELD_NAMES.PASSWORD_CONFIRMATION]: invalidPassword,
        };

        const response = await sendHTTPRequest(
          url(ROUTES.AUTH.REGISTER),
          TYPE_FETCHING.POST,
          bodyWithInvalidPassword,
        );

        expect(response.statusCode).toBe(422);

        expect(response.body).toEqual({
          message: expect.any(String),
          errors: {
            [FIELD_NAMES.PASSWORD]: [expect.any(String)],
            [FIELD_NAMES.PASSWORD_CONFIRMATION]: [expect.any(String)],
          },
        });
      }
    });

    test("should return 422 if password confirmation doesn't match password", async () => {
      const bodyWithInvalidPasswordConfirmation = {
        ...VALID_BODY,
        [FIELD_NAMES.PASSWORD]: "test123",
        [FIELD_NAMES.PASSWORD_CONFIRMATION]: "test456",
      };

      const response = await sendHTTPRequest(
        url(ROUTES.AUTH.REGISTER),
        TYPE_FETCHING.POST,
        bodyWithInvalidPasswordConfirmation,
      );

      expect(response.statusCode).toBe(422);

      expect(response.body).toEqual({
        message: expect.any(String),
        errors: {
          [FIELD_NAMES.PASSWORD_CONFIRMATION]: [expect.any(String)],
        },
      });
    });
  });

  describe("when data validation is successful", () => {
    beforeEach(async () => {
      await User.create({
        [FIELD_NAMES.USERNAME]: VALID_BODY[FIELD_NAMES.USERNAME],
        [FIELD_NAMES.EMAIL]: VALID_BODY[FIELD_NAMES.EMAIL],
        [FIELD_NAMES.PASSWORD]: VALID_BODY[FIELD_NAMES.PASSWORD],
      });
    });

    const TAKEN_USERNAME_MESSAGE = "Username is already taken";
    const TAKEN_EMAIL_MESSAGE = "Email is already taken";

    test("should return 409 if username is already registered", async () => {
      const bodyWithTakenUsername = {
        ...VALID_BODY,
        [FIELD_NAMES.USERNAME]: VALID_BODY[FIELD_NAMES.USERNAME],
        [FIELD_NAMES.EMAIL]: "new@email.com",
      };

      const response = await sendHTTPRequest(
        url(ROUTES.AUTH.REGISTER),
        TYPE_FETCHING.POST,
        bodyWithTakenUsername,
      );

      expect(response.statusCode).toBe(409);

      expect(response.body).toEqual({
        message: TAKEN_USERNAME_MESSAGE,
      });
    });

    test("should return 409 if email is already registered", async () => {
      const bodyWithTakenEmail = {
        ...VALID_BODY,
        [FIELD_NAMES.USERNAME]: "newusername",
        [FIELD_NAMES.EMAIL]: VALID_BODY[FIELD_NAMES.EMAIL],
      };

      const response = await sendHTTPRequest(
        url(ROUTES.AUTH.REGISTER),
        TYPE_FETCHING.POST,
        bodyWithTakenEmail,
      );

      expect(response.statusCode).toBe(409);

      expect(response.body).toEqual({
        message: TAKEN_EMAIL_MESSAGE,
      });
    });

    test("should return 201 and authenticate user if username and email are completely new", async () => {
      const NEW_DATA = {
        [FIELD_NAMES.USERNAME]: "newusername",
        [FIELD_NAMES.EMAIL]: "new@email.com",
      };

      const bodyWithTakenEmail = {
        ...VALID_BODY,
        [FIELD_NAMES.USERNAME]: NEW_DATA[FIELD_NAMES.USERNAME],
        [FIELD_NAMES.EMAIL]: NEW_DATA[FIELD_NAMES.EMAIL],
      };

      const response = await sendHTTPRequest(
        url(ROUTES.AUTH.REGISTER),
        TYPE_FETCHING.POST,
        bodyWithTakenEmail,
      );

      expect(response.headers["set-cookie"]).toBeDefined();

      expect(response.statusCode).toBe(201);

      expect(response.body).toEqual({
        token: expect.any(String),
        user: {
          [FIELD_NAMES.USERNAME]: NEW_DATA[FIELD_NAMES.USERNAME],
          [FIELD_NAMES.EMAIL]: NEW_DATA[FIELD_NAMES.EMAIL],
        },
      });
    });
  });
});
