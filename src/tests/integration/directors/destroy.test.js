import TYPE_FETCHING from "../../helpers/constants/typeFetching.js";
import ROUTES from "../../helpers/constants/routes.js";

import checkUnauthenticatedResponse from "../../helpers/functions/checkUnauthenticatedResponse.js";
import authenticateUser from "../../helpers/functions/authenticateUser.js";
import api from "../../helpers/functions/sendHTTPRequest.js";
import _ from "../../../utils/classes/validationError.js";
import Director from "../../../models/director.model.js";
import url from "../../helpers/functions/urlBuilder.js";

describe(`DELETE ${ROUTES.DIRECTORS.DESTROY}`, () => {
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
        url: url(ROUTES.DIRECTORS.DESTROY, { id: director.id }),
        type: TYPE_FETCHING.DELETE,
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
          url: url(ROUTES.DIRECTORS.DESTROY, { id: "someinvalidid" }),
          type: TYPE_FETCHING.DELETE,
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
          url: url(ROUTES.DIRECTORS.DESTROY, { id: deletedDirector.id }),
          type: TYPE_FETCHING.DELETE,
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
      test("should return 204 with no json data", async () => {
        const directorToDelete = await Director.findOne();

        const response = await api({
          url: url(ROUTES.DIRECTORS.DESTROY, { id: directorToDelete.id }),
          type: TYPE_FETCHING.DELETE,
          cookies,
          checkContentType: false,
        });

        expect(response.statusCode).toBe(204);

        expect(response.body).toEqual({});

        const remainingDirectors = (await Director.find()).map((director) =>
          director.toJSON(),
        );

        expect(remainingDirectors).toHaveLength(DIRECTORS.length - 1);

        const expectedDirectors = DIRECTORS.slice(1);

        expect(remainingDirectors).toEqual(
          expect.arrayContaining(
            expectedDirectors.map((director) =>
              expect.objectContaining(director),
            ),
          ),
        );
      });
    });
  });
});
