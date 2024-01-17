import supertest from "supertest";

import TYPE_FETCHING from "../constants/typeFetching.js";

import app from "../../../app.js";

const api = supertest(app);

/**
 * Send HTTP requests for testing.
 *
 * @param {string} url - The URL of the request.
 * @param {string} [type="GET"] - The request type. Should be one of TYPE_FETCHING constants.
 * @param {object} [body={}] - The request body to send.
 * @param {Object.<string, string>} [cookies={}] - The cookies to include in the request.
 * @param {boolean} [verifyContentType=true] - Set if content-type 'application/json' will be verified.
 * @returns {Promise<supertest.Response>} - The response of the request.
 */
const sendHTTPRequest = async (
  url,
  type = TYPE_FETCHING.GET,
  body = {},
  cookies = {},
  verifyContentType = true,
) => {
  let response;

  const cookiesString = Object.entries(cookies)
    .map(([key, value]) => `${key}=${value}`)
    .join("; ");

  switch (type) {
    case TYPE_FETCHING.GET:
      response = await api
        .get(url)
        .set("Accept", "application/json")
        .set("Cookie", cookiesString);
      break;
    case TYPE_FETCHING.POST:
      response = await api
        .post(url)
        .send(body)
        .set("Accept", "application/json")
        .set("Cookie", cookiesString);
      break;
    case TYPE_FETCHING.PUT:
      response = await api
        .put(url)
        .send(body)
        .set("Accept", "application/json")
        .set("Cookie", cookiesString);
      break;
    case TYPE_FETCHING.PATCH:
      response = await api
        .patch(url)
        .send(body)
        .set("Accept", "application/json")
        .set("Cookie", cookiesString);
      break;
    case TYPE_FETCHING.DELETE:
      response = await api
        .delete(url)
        .set("Accept", "application/json")
        .set("Cookie", cookiesString);
      break;
    default:
      throw new Error(`Unsupported HTTP method: ${type}`);
  }

  if (verifyContentType) {
    expect(response.headers["content-type"]).toBeDefined();
    expect(response.headers["content-type"]).toMatch(/application\/json/);
  }

  return response;
};

export default sendHTTPRequest;
