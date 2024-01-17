import bcrypt from "bcryptjs";

import { VALID_REGISTER_BODY } from "../constants/validBody.js";
import FIELD_NAMES from "../constants/fieldNames.js";

import User from "../../../../../models/user.model.js";

/**
 * Create a new user for testing.
 *
 * @async
 * @param {Object} [data=VALID_REGISTER_BODY] - The data to create the user. Defaults to VALID_REGISTER_BODY.
 * @returns {Promise<User>} - A promise that resolves with the created user.
 */
const createUser = async (data = VALID_REGISTER_BODY) => {
  const hashedPassword = await bcrypt.hash(data[FIELD_NAMES.PASSWORD], 10);

  const user = new User({
    [FIELD_NAMES.USERNAME]: data[FIELD_NAMES.USERNAME],
    [FIELD_NAMES.EMAIL]: data[FIELD_NAMES.EMAIL],
    [FIELD_NAMES.PASSWORD]: hashedPassword,
  });

  const savedUser = await user.save();

  return savedUser;
};

export default createUser;
