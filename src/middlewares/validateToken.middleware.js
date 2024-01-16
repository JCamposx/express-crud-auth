import jwt from "jsonwebtoken";

import { TOKEN_SECRET } from "../config.js";

import HTTPError from "../utils/classes/httpError.js";

/**
 * Validate the access token using JWT.
 */
const validateToken = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    throw new HTTPError("No token has been provided", 401);
  }

  jwt.verify(token, TOKEN_SECRET, (error, user) => {
    if (error) {
      throw new HTTPError("Invalid token", 401);
    }

    req.user = {
      id: user.id,
    };

    next();
  });
};

export default validateToken;
