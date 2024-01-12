import mongoose from "mongoose";

import HTTPError from "../libs/httpError.js";

const directorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    nationality: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;

        delete ret._id;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
  },
);

directorSchema.post(
  ["findOne", "findOneAndUpdate", "findOneAndDelete"],
  function (doc, next) {
    if (!doc) {
      throw new HTTPError("Director not found", 404);
    }

    next();
  },
);

export default mongoose.model("Director", directorSchema);
