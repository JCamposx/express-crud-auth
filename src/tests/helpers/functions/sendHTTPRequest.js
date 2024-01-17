import supertest from "supertest";

import TYPE_FETCHING from "../constants/typeFetching.js";

import app from "../../../app.js";

const api = supertest(app);

/**
 * Sends HTTP requests for testing.
 *
 * @param {string} url - The URL of the request.
 * @param {string} [type="GET"] - The request type. Should be one of TYPE_FETCHING constants.
 * @param {object} [body={}] - The request body to send.
 * @returns {Promise<supertest.Response>} - The response of the request.
 */
const sendHTTPRequest = async (url, type = TYPE_FETCHING.GET, body = {}) => {
  let response;

  switch (type) {
    case TYPE_FETCHING.GET:
      response = await api.get(url).set("Accept", "application/json");
      break;
    case TYPE_FETCHING.POST:
      response = await api
        .post(url)
        .send(body)
        .set("Accept", "application/json");
      break;
    case TYPE_FETCHING.PUT:
      response = await api
        .put(url)
        .send(body)
        .set("Accept", "application/json");
      break;
    case TYPE_FETCHING.PATCH:
      response = await api
        .patch(url)
        .send(body)
        .set("Accept", "application/json");
      break;
    case TYPE_FETCHING.DELETE:
      response = await api.delete(url).set("Accept", "application/json");
      break;
    default:
      throw new Error(`Unsupported HTTP method: ${type}`);
  }

  expect(response.headers["content-type"]).toMatch(/application\/json/);

  return response;
};

export default sendHTTPRequest;
