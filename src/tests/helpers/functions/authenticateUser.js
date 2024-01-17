import TYPE_FETCHING from "../constants/typeFetching.js";
import ROUTES from "../constants/routes.js";

import sendHTTPRequest from "./sendHTTPRequest.js";
import url from "./urlBuilder.js";

/**
 * Authenticate a user by making a registration request.
 *
 * @async
 * @function
 * @param {Object} data - User data for registration.
 * @param {string} data.username - The username of the user.
 * @param {string} data.email - The email address of the user.
 * @param {string} data.password - The password of the user.
 * @returns {Promise<{ user: Object, cookies: string }>} - A promise that resolves with an object containing user information and cookies.
 */
const authenticateUser = async (data) => {
  const body = {
    username: data.username,
    email: data.email,
    password: data.password,
    password_confirmation: data.password,
  };

  const response = await sendHTTPRequest({
    url: url(ROUTES.AUTH.REGISTER),
    type: TYPE_FETCHING.POST,
    body: body,
  });

  const { user } = response.body;

  const cookies = cookiesToObject(response.headers["set-cookie"]);

  return {
    user,
    cookies,
  };
};

/**
 * Transform an array of cookies into an object.
 *
 * @param {Array} cookiesArray - Array of cookie strings.
 * @returns {Object} - Object with cookie names as keys and values as values.
 */
const cookiesToObject = (cookiesArray) => {
  const cookiesObject = {};

  cookiesArray.forEach((cookie) => {
    const [nameValue] = cookie.split(";");
    const [name, value] = nameValue.split("=");

    cookiesObject[name.trim()] = value.trim();
  });

  return cookiesObject;
};

export default authenticateUser;
