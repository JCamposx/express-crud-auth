import jwt from "jsonwebtoken";

import { TOKEN_SECRET } from "../config.js";

/**
 * Validate the access token using JWT.
 */
const validateToken = (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      res.status(401).json({
        message: "No token has been provided",
      });

      return;
    }

    jwt.verify(token, TOKEN_SECRET, (error, user) => {
      if (error) {
        res.status(403).json({
          message: "Invalid token",
        });

        return;
      }

      req.user = {
        id: user.id,
      };

      next();
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });

    return;
  }
};

export default validateToken;
