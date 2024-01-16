import bcrypt from "bcryptjs";

import { COOKIE_OPTIONS } from "../constants.js";

import { createAccessToken } from "../utils/functions/jwt.js";
import HTTPError from "../utils/classes/httpError.js";
import User from "../models/user.model.js";

/**
 * Authentication controller.
 * @class AuthController
 */
class AuthController {
  /**
   * Register a new user and generate an access token.
   * @static
   * @async
   */
  static async register(req, res) {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await user.save();

    const token = await createAccessToken({ id: savedUser._id });

    res.cookie("token", token, COOKIE_OPTIONS);

    res.status(201).json({
      user: {
        username: savedUser.username,
        email: savedUser.email,
      },
      token,
    });
  }

  /**
   * Authenticate a user and generate an access token.
   * @static
   * @async
   */
  static async login(req, res) {
    const { email, password } = req.body;

    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      throw new HTTPError("User not found with the given email", 401);
    }

    const passwordMatch = await bcrypt.compare(password, foundUser.password);

    if (!passwordMatch) {
      throw new HTTPError("Incorrect password", 401);
    }

    const token = await createAccessToken({ id: foundUser._id });

    res.cookie("token", token, COOKIE_OPTIONS);

    res.status(200).json({
      user: {
        username: foundUser.username,
        email: foundUser.email,
        token,
      },
    });
  }

  /**
   * Remove user authentication by deleting the access token.
   * @static
   * @async
   */
  static async logout(req, res) {
    res.cookie("token", "", {
      ...COOKIE_OPTIONS,
      expires: new Date(0),
    });

    res.sendStatus(204);
  }
}

export default AuthController;
