import Director from "../models/director.model.js";

/**
 * Get all movie directors.
 */
export const index = async (req, res) => {
  const directors = await Director.find();

  res.status(200).json({
    data: directors,
  });
};

/**
 * Get one specific movie director.
 */
export const show = async (req, res) => {
  const { id } = req.params;

  const foundDirector = await Director.findById(id);

  res.status(200).json({
    data: foundDirector,
  });
};

/**
 * Store a ne movie director.
 */
export const store = async (req, res) => {
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
};

/**
 * Update data of a movie director.
 */
export const update = async (req, res) => {
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
};

/**
 * Delete a specific movie director.
 */
export const destroy = async (req, res) => {
  const { id } = req.params;

  await Director.findByIdAndDelete(id);

  res.sendStatus(204);
};
