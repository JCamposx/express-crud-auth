import "dotenv/config";

import { NODE_ENVS } from "./constants.js";

export const NODE_ENV = process.env.NODE_ENV || NODE_ENVS.DEVELOPMENT;

export const PORT = process.env.PORT || 3000;
