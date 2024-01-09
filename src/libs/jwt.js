import jwt from "jsonwebtoken";

import { TOKEN_SECRET } from "../config.js";

/**
 * Generate an access token using JWT.
 * @param {Object} payload - The data to be included in the token.
 * @returns {Promise<string>} - A promise that resolves with the access token.
 * @throws {Error} - Throws an error if there is any issue creating the token.
 */
export const createAccessToken = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, TOKEN_SECRET, { expiresIn: "14d" }, (error, token) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(token);
    });
  });
};
