import TYPE_FETCHING from "../../helpers/constants/typeFetching.js";
import ROUTES from "../../helpers/constants/routes.js";

import authenticateUser from "../../helpers/functions/authenticateUser.js";
import api from "../../helpers/functions/sendHTTPRequest.js";
import url from "../../helpers/functions/urlBuilder.js";

describe(`POST ${ROUTES.AUTH.LOGOUT}`, () => {
  describe("when user is not authenticated", () => {
    test("should return 401", async () => {
      const response = await api({
        url: url(ROUTES.AUTH.LOGOUT),
        type: TYPE_FETCHING.POST,
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe("when user is authenticated", () => {
    test("should return 204 with empty body and remove user's token", async () => {
      const { cookies } = await authenticateUser({
        username: "newuser",
        email: "new@user.com",
        password: "password1234",
      });

      const response = await api({
        url: url(ROUTES.AUTH.LOGOUT),
        type: TYPE_FETCHING.POST,
        cookies,
        checkContentType: false,
      });

      expect(response.statusCode).toBe(204);
    });
  });
});
