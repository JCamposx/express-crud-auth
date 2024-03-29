import { VALID_REGISTER_BODY as VALID_BODY } from "./helpers/constants/validBody.js";
import INVALID_PASSWORDS from "./helpers/constants/invalidPasswords.js";
import TYPE_FETCHING from "../../helpers/constants/typeFetching.js";
import INVALID_EMAILS from "./helpers/constants/invalidEmails.js";
import FIELD_NAMES from "./helpers/constants/fieldNames.js";
import ROUTES from "../../helpers/constants/routes.js";

import api from "../../helpers/functions/sendHTTPRequest.js";
import createUser from "./helpers/functions/createUser.js";
import url from "../../helpers/functions/urlBuilder.js";

describe(`POST ${ROUTES.AUTH.REGISTER}`, () => {
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

        const response = await api({
          url: url(ROUTES.AUTH.REGISTER),
          type: TYPE_FETCHING.POST,
          body: bodyWithMissingData,
        });

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
    test.each(INVALID_EMAILS)(
      "should return 422 with %p as given email",
      async (invalidEmail) => {
        const bodyWithInvalidEmail = {
          ...VALID_BODY,
          [FIELD_NAMES.EMAIL]: invalidEmail,
        };

        const response = await api({
          url: url(ROUTES.AUTH.REGISTER),
          type: TYPE_FETCHING.POST,
          body: bodyWithInvalidEmail,
        });

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
      for (const invalidPassword of INVALID_PASSWORDS) {
        const bodyWithInvalidPassword = {
          ...VALID_BODY,
          [FIELD_NAMES.PASSWORD]: invalidPassword,
          [FIELD_NAMES.PASSWORD_CONFIRMATION]: invalidPassword,
        };

        const response = await api({
          url: url(ROUTES.AUTH.REGISTER),
          type: TYPE_FETCHING.POST,
          body: bodyWithInvalidPassword,
        });

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

      const response = await api({
        url: url(ROUTES.AUTH.REGISTER),
        type: TYPE_FETCHING.POST,
        body: bodyWithInvalidPasswordConfirmation,
      });

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
      await createUser(VALID_BODY);
    });

    const TAKEN_USERNAME_MESSAGE = "Username is already taken";
    const TAKEN_EMAIL_MESSAGE = "Email is already taken";

    test("should return 409 if username is already registered", async () => {
      const bodyWithTakenUsername = {
        ...VALID_BODY,
        [FIELD_NAMES.USERNAME]: VALID_BODY[FIELD_NAMES.USERNAME],
        [FIELD_NAMES.EMAIL]: "new@email.com",
      };

      const response = await api({
        url: url(ROUTES.AUTH.REGISTER),
        type: TYPE_FETCHING.POST,
        body: bodyWithTakenUsername,
      });

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

      const response = await api({
        url: url(ROUTES.AUTH.REGISTER),
        type: TYPE_FETCHING.POST,
        body: bodyWithTakenEmail,
      });

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

      const response = await api({
        url: url(ROUTES.AUTH.REGISTER),
        type: TYPE_FETCHING.POST,
        body: bodyWithTakenEmail,
      });

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
