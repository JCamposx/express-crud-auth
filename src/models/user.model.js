import mongoose from "mongoose";

import HTTPError from "../libs/httpError.js";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  const { username, email } = this;

  const User = mongoose.model("User", userSchema);

  const foundUserByUsername = await User.findOne({ username });

  if (foundUserByUsername) {
    throw new HTTPError("Username is already taken", 409);
  }

  const foundUserByEmail = await User.findOne({ email });

  if (foundUserByEmail) {
    throw new HTTPError("Email is already taken", 409);
  }

  next();
});

export default mongoose.model("User", userSchema);
