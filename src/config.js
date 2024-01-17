import dotenv from "dotenv";

import NODE_ENVS from "./utils/constants/nodeEnvs.js";

export const NODE_ENV = process.env.NODE_ENV || NODE_ENVS.DEVELOPMENT;

dotenv.config({
  path: NODE_ENV === NODE_ENVS.PRODUCTION ? ".env" : `.env.${NODE_ENV}`,
});

export const PORT = process.env.PORT || 3000;

export const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/db";

export const TOKEN_SECRET = process.env.TOKEN_SECRET || "secret";
