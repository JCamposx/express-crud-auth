import Director from "../models/director.model.js";
import Movie from "../models/movie.model.js";

/**
 * Get all movies.
 */
export const index = async (req, res) => {
  try {
    const movies = await Movie.find().populate("director");

    res.status(200).json({
      data: movies,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * Get one specific movie.
 */
export const show = async (req, res) => {
  try {
    const { id } = req.params;

    const foundMovie = await Movie.findById(id).populate("director");

    if (!foundMovie) {
      res.status(404).json({
        message: "Movie not found",
      });

      return;
    }

    res.status(200).json({
      data: foundMovie,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * Store a new movie.
 */
export const store = async (req, res) => {
  try {
    const { title, synopsis, release_date, rating, director_id } = req.body;

    const foundDirector = await Director.findById(director_id);

    if (!foundDirector) {
      res.status(404).json({
        message: "Director not found",
      });

      return;
    }

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
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * Update data of a movie.
 */
export const update = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, synopsis, release_date, rating, director_id } = req.body;

    const foundDirector = await Director.findById(director_id);

    if (!foundDirector) {
      res.status(404).json({
        message: "Director not found",
      });

      return;
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
      res.status(404).json({
        message: "Movie not found",
      });

      return;
    }

    res.status(200).json({
      data: updatedMovie,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * Delete a specific movie.
 */
export const destroy = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMovie = await Movie.findByIdAndDelete(id);

    if (!deletedMovie) {
      res.status(404).json({
        message: "Movie not found",
      });

      return;
    }

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};