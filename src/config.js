import "dotenv/config";

import { NODE_ENVS } from "./constants.js";

export const NODE_ENV = process.env.NODE_ENV || NODE_ENVS.DEVELOPMENT;

export const PORT = process.env.PORT || 3000;

export const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/db";

export const TOKEN_SECRET = process.env.TOKEN_SECRET || "secret";
