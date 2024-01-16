import mongoose from "mongoose";

import HTTPError from "../utils/classes/httpError.js";

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

directorSchema.pre(
  ["findOne", "findOneAndUpdate", "findOneAndDelete"],
  async function (next) {
    const { _id: id } = this._conditions;

    if (!id) {
      next();
    }

    if (!mongoose.isValidObjectId(id)) {
      throw new HTTPError("Invalid director ID", 400);
    }

    next();
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
