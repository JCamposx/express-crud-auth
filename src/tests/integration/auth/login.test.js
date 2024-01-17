import { VALID_LOGIN_BODY as VALID_BODY } from "./helpers/constants/validBody.js";
import INVALID_PASSWORDS from "./helpers/constants/invalidPasswords.js";
import TYPE_FETCHING from "../../helpers/constants/typeFetching.js";
import INVALID_EMAILS from "./helpers/constants/invalidEmails.js";
import FIELD_NAMES from "./helpers/constants/fieldNames.js";
import ROUTES from "../../helpers/constants/routes.js";

import api from "../../helpers/functions/sendHTTPRequest.js";
import createUser from "./helpers/functions/createUser.js";
import url from "../../helpers/functions/urlBuilder.js";

describe(`POST ${ROUTES.AUTH.LOGIN}`, () => {
  describe("when required data is missing", () => {
    const MISSING_FIELDS = [
      FIELD_NAMES.EMAIL,
      FIELD_NAMES.PASSWORD,
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
          url: url(ROUTES.AUTH.LOGIN),
          type: TYPE_FETCHING.POST,
          body: bodyWithMissingData,
        });

        expect(response.statusCode).toBe(422);

        const expectedErrors = {};

        if (Array.isArray(missingField)) {
          missingField.forEach(
            (field) => (expectedErrors[field] = [expect.any(String)]),
          );
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
          url: url(ROUTES.AUTH.LOGIN),
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

  describe("when password is invalid", () => {
    test("should return 422 if password is not at least 6 characters long", async () => {
      for (const invalidPassword of INVALID_PASSWORDS) {
        const bodyWithInvalidPassword = {
          ...VALID_BODY,
          [FIELD_NAMES.PASSWORD]: invalidPassword,
        };

        const response = await api({
          url: url(ROUTES.AUTH.LOGIN),
          type: TYPE_FETCHING.POST,
          body: bodyWithInvalidPassword,
        });

        expect(response.statusCode).toBe(422);

        expect(response.body).toEqual({
          message: expect.any(String),
          errors: {
            [FIELD_NAMES.PASSWORD]: [expect.any(String)],
          },
        });
      }
    });
  });

  describe("when data validation is successful", () => {
    const USER_DATA = {
      [FIELD_NAMES.USERNAME]: "newtestinguser",
      [FIELD_NAMES.EMAIL]: VALID_BODY[FIELD_NAMES.EMAIL],
      [FIELD_NAMES.PASSWORD]: VALID_BODY[FIELD_NAMES.PASSWORD],
    };

    beforeEach(async () => {
      await createUser(USER_DATA);
    });

    test("should return 401 if email is not found with any user", async () => {
      const bodyWithNotRegisteredEmail = {
        [FIELD_NAMES.EMAIL]: "email@notfound.com",
        [FIELD_NAMES.PASSWORD]: USER_DATA[FIELD_NAMES.PASSWORD],
      };

      const response = await api({
        url: url(ROUTES.AUTH.LOGIN),
        type: TYPE_FETCHING.POST,
        body: bodyWithNotRegisteredEmail,
      });

      expect(response.statusCode).toBe(401);

      expect(response.body).toEqual({
        message: expect.any(String),
      });
    });

    test("should return 401 if password is incorrect", async () => {
      const bodyWithIncorrectPassword = {
        [FIELD_NAMES.EMAIL]: USER_DATA[FIELD_NAMES.EMAIL],
        [FIELD_NAMES.PASSWORD]: "incorrectpassword",
      };

      const response = await api({
        url: url(ROUTES.AUTH.LOGIN),
        type: TYPE_FETCHING.POST,
        body: bodyWithIncorrectPassword,
      });

      expect(response.statusCode).toBe(401);

      expect(response.body).toEqual({
        message: expect.any(String),
      });
    });

    test("should return 200 and authenticate user if email and password are correct", async () => {
      const response = await api({
        url: url(ROUTES.AUTH.LOGIN),
        type: TYPE_FETCHING.POST,
        body: USER_DATA,
      });

      expect(response.statusCode).toBe(200);

      expect(response.body).toEqual({
        user: {
          email: USER_DATA[FIELD_NAMES.EMAIL],
          username: USER_DATA[FIELD_NAMES.USERNAME],
        },
        token: expect.any(String),
      });
    });
  });
});
