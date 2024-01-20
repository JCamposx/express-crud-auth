import TYPE_FETCHING from "../../helpers/constants/typeFetching.js";
import ROUTES from "../../helpers/constants/routes.js";

import authenticateUser from "../../helpers/functions/authenticateUser.js";
import api from "../../helpers/functions/sendHTTPRequest.js";
import _ from "../../../utils/classes/validationError.js";
import Director from "../../../models/director.model.js";
import url from "../../helpers/functions/urlBuilder.js";

describe(`GET ${ROUTES.DIRECTORS.INDEX}`, () => {
  describe("when user is not authenticated", () => {
    test("should return 401 without any director data", async () => {
      const response = await api({
        url: url(ROUTES.DIRECTORS.INDEX),
        type: TYPE_FETCHING.GET,
      });

      expect(response.statusCode).toBe(401);

      expect(response.body.data).not.toBeDefined();

      expect(response.body).toEqual(
        expect.objectContaining({
          message: "No token has been provided",
        }),
      );
    });
  });

  describe("when user is authenticated", () => {
    test("should return 200 with directors data", async () => {
      const DIRECTORS = [
        {
          name: "Director 1",
          lastname: "Lastname 1",
          nationality: "Country 1",
        },
        {
          name: "Director 2",
          lastname: "Lastname 2",
          nationality: "Country 2",
        },
        {
          name: "Director 3",
          lastname: "Lastname 3",
          nationality: "Country 3",
        },
        {
          name: "Director 4",
          lastname: "Lastname 4",
          nationality: "Country 4",
        },
      ];

      await Director.insertMany(DIRECTORS);

      const { cookies } = await authenticateUser({
        username: "usertest",
        email: "user@test.com",
        password: "password1234",
      });

      const response = await api({
        url: url(ROUTES.DIRECTORS.INDEX),
        type: TYPE_FETCHING.GET,
        cookies,
      });

      expect(response.statusCode).toBe(200);

      expect(response.body.data).toBeDefined();

      expect(response.body.data).toBeInstanceOf(Array);

      expect(response.body.data).toHaveLength(DIRECTORS.length);

      expect(response.body.data).toEqual(
        expect.arrayContaining(
          DIRECTORS.map((director) => expect.objectContaining(director)),
        ),
      );
    });
  });
});
