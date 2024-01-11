import bcrypt from "bcryptjs";

import { COOKIE_OPTIONS } from "../constants.js";

import { createAccessToken } from "../libs/jwt.js";
import HTTPError from "../libs/httpError.js";
import User from "../models/user.model.js";

/**
 * Register a new user and generate an access token.
 */
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  const foundUserByUsername = await User.findOne({ username });

  if (foundUserByUsername) {
    throw new HTTPError("Username is already taken", 409);
  }

  const foundUserByEmail = await User.findOne({ email });

  if (foundUserByEmail) {
    throw new HTTPError("Email is already taken", 409);
  }

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
      token,
    },
  });
};

/**
 * Authenticate a user and generate an access token.
 */
export const login = async (req, res) => {
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
};

/**
 * Remove user authentication by deleting the access token.
 */
export const logout = async (req, res) => {
  res.cookie("token", "", {
    ...COOKIE_OPTIONS,
    expires: new Date(0),
  });

  res.sendStatus(204);
};
