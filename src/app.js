import express from "express";
import morgan from "morgan";

import { NODE_ENV } from "./config.js";
import { NODE_ENVS } from "./constants.js";

const app = express();

if (NODE_ENV === NODE_ENVS.DEVELOPMENT) {
  app.use(morgan("dev"));
} else if (NODE_ENV === NODE_ENVS.PRODUCTION) {
  app.use(morgan("combined"));
}

export default app;
