import Director from "../models/director.model.js";

/**
 * Get all movie directors.
 */
export const index = async (req, res) => {
  try {
    const directors = await Director.find();

    res.status(200).json({
      data: directors,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message(),
    });
  }
};

/**
 * Get one specific movie director.
 */
export const show = async (req, res) => {
  try {
    const { id } = req.params;

    const foundDirector = await Director.findById(id);

    if (!foundDirector) {
      res.status(404).json({
        message: "Director not found",
      });

      return;
    }

    res.status(200).json({
      data: foundDirector,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message(),
    });
  }
};

/**
 * Store a ne movie director.
 */
export const store = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      message: error.message(),
    });
  }
};

/**
 * Update data of a movie director.
 */
export const update = async (req, res) => {
  try {
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

    if (!updatedDirector) {
      res.status(404).json({
        message: "Director not found",
      });

      return;
    }

    res.status(200).json({
      data: updatedDirector,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message(),
    });
  }
};

/**
 * Delete a specific movie director.
 */
export const destroy = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDirector = await Director.findByIdAndDelete(id);

    if (!deletedDirector) {
      res.status(404).json({
        message: "Director not found",
      });

      return;
    }

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      message: error.message(),
    });
  }
};
