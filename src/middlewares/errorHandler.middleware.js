import { NODE_ENVS } from "../constants.js";
import { NODE_ENV } from "../config.js";

/**
 * Handle errors in route requests.
 */
export const requestErrorHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Get errors and return custom JSON.
 */
export const responseErrorHandler = (err, req, res, next) => {
  console.error(`[${req.method} ${req.path}] ${err.stack || err}`);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";
  const errors = err.errors || {};

  const responseError = {
    message,
    errors,
  };

  if (Object.keys(errors).length === 0) {
    delete responseError.errors;
  }

  if (NODE_ENV === NODE_ENVS.PRODUCTION && statusCode === 500) {
    responseError.message = "Internal server error";
  }

  res.status(statusCode).json(responseError);
};
