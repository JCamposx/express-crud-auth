import HTTPError from "../libs/httpError.js";
import Director from "./director.model.js";
import mongoose from "mongoose";

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
  const foundDirector = await Director.findById(this.director);

  if (!foundDirector) {
    throw new HTTPError("Director not found", 422, {
      director_id: ["Director not found"],
    });
  }

  next();
});

export default mongoose.model("Movie", movieSchema);
