import Director from "../models/director.model.js";
import Movie from "../models/movie.model.js";
import HTTPError from "../libs/httpError.js";

/**
 * Get all movies.
 */
export const index = async (req, res) => {
  const movies = await Movie.find().populate("director");

  res.status(200).json({
    data: movies,
  });
};

/**
 * Get one specific movie.
 */
export const show = async (req, res) => {
  const { id } = req.params;

  const foundMovie = await Movie.findById(id).populate("director");

  if (!foundMovie) {
    throw new HTTPError("Movie not found", 404);
  }

  res.status(200).json({
    data: foundMovie,
  });
};

/**
 * Store a new movie.
 */
export const store = async (req, res) => {
  const { title, synopsis, release_date, rating, director_id } = req.body;

  const movie = new Movie({
    title,
    synopsis,
    release_date,
    rating,
    director: director_id,
  });

  const savedMovie = await movie.save();

  res.status(201).json({
    data: savedMovie,
  });
};

/**
 * Update data of a movie.
 */
export const update = async (req, res) => {
  const { id } = req.params;

  const { title, synopsis, release_date, rating, director_id } = req.body;

  const foundDirector = await Director.findById(director_id);

  if (!foundDirector) {
    throw new HTTPError("Director not found", 404);
  }

  const updatedMovie = await Movie.findByIdAndUpdate(
    id,
    {
      title,
      synopsis,
      release_date,
      rating,
      director: director_id,
    },
    {
      new: true,
    },
  );

  if (!updatedMovie) {
    throw new HTTPError("Movie not found", 404);
  }

  res.status(200).json({
    data: updatedMovie,
  });
};

/**
 * Delete a specific movie.
 */
export const destroy = async (req, res) => {
  const { id } = req.params;

  const deletedMovie = await Movie.findByIdAndDelete(id);

  if (!deletedMovie) {
    throw new HTTPError("Movie not found", 404);
  }

  res.sendStatus(204);
};
