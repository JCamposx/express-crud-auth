import TYPE_FETCHING from "../../helpers/constants/typeFetching.js";
import ROUTES from "../../helpers/constants/routes.js";

import checkUnauthenticatedResponse from "../../helpers/functions/checkUnauthenticatedResponse.js";
import authenticateUser from "../../helpers/functions/authenticateUser.js";
import api from "../../helpers/functions/sendHTTPRequest.js";
import _ from "../../../utils/classes/validationError.js";
import Director from "../../../models/director.model.js";
import url from "../../helpers/functions/urlBuilder.js";

describe(`GET ${ROUTES.DIRECTORS.SHOW}`, () => {
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

  beforeEach(async () => {
    await Director.insertMany(DIRECTORS);
  });

  describe("when user is not authenticated", () => {
    test("should return 401 without any director data", async () => {
      const director = await Director.findOne();

      await checkUnauthenticatedResponse({
        url: url(ROUTES.DIRECTORS.SHOW, { id: director.id }),
        type: TYPE_FETCHING.GET,
      });
    });
  });

  describe("when user is authenticated", () => {
    let cookies;

    beforeAll(async () => {
      const { cookies: responseCookies } = await authenticateUser({
        username: "usertest",
        email: "user@test.com",
        password: "password1234",
      });

      cookies = responseCookies;
    });

    describe("when the requested id is not valid", () => {
      test("should return 400 if it is not a mongoose ObjectID", async () => {
        const response = await api({
          url: url(ROUTES.DIRECTORS.SHOW, { id: "someInvalidObjectID" }),
          type: TYPE_FETCHING.GET,
          cookies,
        });

        expect(response.statusCode).toBe(400);

        expect(response.body.data).not.toBeDefined();

        expect(response.body).toEqual({
          message: "Invalid director ID",
        });
      });

      test("should return 404 if it doesn't belong to any director", async () => {
        const directorToDelete = await Director.findOne();

        const deletedDirector = await Director.findByIdAndDelete(
          directorToDelete.id,
          { new: true },
        );

        const response = await api({
          url: url(ROUTES.DIRECTORS.SHOW, { id: deletedDirector.id }),
          type: TYPE_FETCHING.GET,
          cookies,
        });

        expect(response.statusCode).toBe(404);

        expect(response.body.data).not.toBeDefined();

        expect(response.body).toEqual({
          message: "Director not found",
        });
      });
    });

    describe("when the requested id is valid", () => {
      test("should return 200 with requested director data", async () => {
        const directorToFind = await Director.findOne();

        const response = await api({
          url: url(ROUTES.DIRECTORS.SHOW, { id: directorToFind.id }),
          type: TYPE_FETCHING.GET,
          cookies,
        });

        expect(response.statusCode).toBe(200);

        expect(response.body.data).toBeDefined();

        expect(response.body.data).toBeInstanceOf(Object);

        const expectedDirector = {
          ...directorToFind.toJSON(),
          id: directorToFind.id.toString(),
        };

        expect(response.body.data).toEqual(expectedDirector);
      });
    });
  });
});
