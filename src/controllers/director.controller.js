import Director from "../models/director.model.js";

/**
 * Director controller.
 * @class DirectorController
 */
class DirectorController {
  /**
   * Get all movie directors.
   * @static
   * @async
   */
  static async index(req, res) {
    const directors = await Director.find();

    res.status(200).json({
      data: directors,
    });
  }

  /**
   * Get one specific movie director.
   * @static
   * @async
   */
  static async show(req, res) {
    const { id } = req.params;

    const foundDirector = await Director.findById(id);

    res.status(200).json({
      data: foundDirector,
    });
  }

  /**
   * Store a ne movie director.
   * @static
   * @async
   */
  static async store(req, res) {
    const { name, lastname, nationality } = req.body;

    const director = new Director({
      name,
      lastname,
      nationality,
    });

    const savedDirector = await director.save();

    res.status(201).json({
      data: savedDirector,
    });
  }

  /**
   * Update data of a movie director.
   * @static
   * @async
   */
  static async update(req, res) {
    const { id } = req.params;

    const { name, lastname, nationality } = req.body;

    const updatedDirector = await Director.findByIdAndUpdate(
      id,
      {
        name,
        lastname,
        nationality,
      },
      {
        new: true,
      },
    );

    res.status(200).json({
      data: updatedDirector,
    });
  }

  /**
   * Delete a specific movie director.
   * @static
   * @async
   */
  static async destroy(req, res) {
    const { id } = req.params;

    await Director.findByIdAndDelete(id);

    res.sendStatus(204);
  }
}

export default DirectorController;
