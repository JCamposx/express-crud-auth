import Movie from "../models/movie.model.js";

/**
 * Movie controller.
 * @class MovieController
 */
class MovieController {
  /**
   * Get all movies.
   * @static
   * @async
   */
  static async index(req, res) {
    const movies = await Movie.find().populate("director");

    res.status(200).json({
      data: movies,
    });
  }

  /**
   * Get one specific movie.
   * @static
   * @async
   */
  static async show(req, res) {
    const { id } = req.params;

    const foundMovie = await Movie.findById(id).populate("director");

    res.status(200).json({
      data: foundMovie,
    });
  }

  /**
   * Store a new movie.
   * @static
   * @async
   */
  static async store(req, res) {
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
  }

  /**
   * Update data of a movie.
   * @static
   * @async
   */
  static async update(req, res) {
    const { id } = req.params;

    const { title, synopsis, release_date, rating, director_id } = req.body;

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

    res.status(200).json({
      data: updatedMovie,
    });
  }

  /**
   * Delete a specific movie.
   * @static
   * @async
   */
  static async destroy(req, res) {
    const { id } = req.params;

    await Movie.findByIdAndDelete(id);

    res.sendStatus(204);
  }
}

export default MovieController;
