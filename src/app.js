import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";

import NODE_ENVS from "./utils/constants/nodeEnvs.js";
import { NODE_ENV } from "./config.js";

import { responseErrorHandler } from "./middlewares/errorHandler.middleware.js";
import routes from "./routes/index.routes.js";

const app = express();

if (NODE_ENV === NODE_ENVS.DEVELOPMENT) {
  app.use(morgan("dev"));
} else if (NODE_ENV === NODE_ENVS.PRODUCTION) {
  app.use(morgan("combined"));
}

app.use(express.json());

app.use(cookieParser());

app.use("/api", routes);

app.use(responseErrorHandler);

export default app;
