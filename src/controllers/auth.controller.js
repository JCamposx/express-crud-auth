import bcrypt from "bcryptjs";

import { COOKIE_OPTIONS } from "../constants.js";

import { createAccessToken } from "../libs/jwt.js";
import User from "../models/user.model.js";

/**
 * Register a new user and generate an access token.
 */
export const register = async (req, res) => {
  try {
    const { username, email, password, password_confirmation } = req.body;

    if (password !== password_confirmation) {
      res.status(400).json({
        message: "Password confirmation doesn't match password",
      });

      return;
    }

    const foundUserByUsername = await User.findOne({ username });

    if (foundUserByUsername) {
      res.status(409).json({
        message: "Username is already taken",
      });

      return;
    }

    const foundUserByEmail = await User.findOne({ email });

    if (foundUserByEmail) {
      res.status(409).json({
        message: "Email is already taken",
      });

      return;
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
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * Authenticate a user and generate an access token.
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      res.status(401).json({
        message: "User not found with the given email",
      });

      return;
    }

    const passwordMatch = await bcrypt.compare(password, foundUser.password);

    if (!passwordMatch) {
      res.status(401).json({
        message: "Incorrect password",
      });

      return;
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
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * Remove user authentication by deleting the access token.
 */
export const logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      ...COOKIE_OPTIONS,
      expires: new Date(0),
    });

    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
