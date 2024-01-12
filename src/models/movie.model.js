import mongoose from "mongoose";

import HTTPError from "../libs/httpError.js";
import Director from "./director.model.js";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    synopsis: {
      type: String,
      required: false,
      trim: true,
    },
    release_date: {
      type: Date,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    director: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Director",
      required: true,
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

movieSchema.pre("save", async function (next) {
  const { director: directorId } = this;

  await Director.findById(directorId);

  next();
});

movieSchema.pre("findOneAndUpdate", async function (next) {
  const { director: directorId } = this._update;
  const { _id: id } = this._conditions;

  const Movie = mongoose.model("Movie", movieSchema);

  if (id) {
    await Movie.findById(id);
  }

  if (!directorId) {
    next();
  }

  await Director.findById(directorId);

  next();
});

movieSchema.post(
  ["findOne", "findOneAndUpdate", "findOneAndDelete"],
  function (doc, next) {
    if (!doc) {
      throw new HTTPError("Movie not found", 404);
    }

    next();
  },
);

export default mongoose.model("Movie", movieSchema);
