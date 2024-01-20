import TYPE_FETCHING from "../constants/typeFetching.js";

import api from "./sendHTTPRequest.js";

/**
 * Checks the response when a user is not authenticated.
 *
 * @param {Object} options - Options for the request.
 * @param {string} [options.url="/"] - The URL of the request.
 * @param {string} [options.type=TYPE_FETCHING.GET] - The request type. Should be one of TYPE_FETCHING constants.
 */
const checkUnauthenticatedResponse = async ({
  url = "/",
  type = TYPE_FETCHING.GET,
}) => {
  const { statusCode, body } = await api({ url, type });

  expect(statusCode).toBe(401);

  expect(body.data).not.toBeDefined();

  expect(body).toEqual(
    expect.objectContaining({
      message: "No token has been provided",
    }),
  );
};

export default checkUnauthenticatedResponse;
