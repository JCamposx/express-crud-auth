import NODE_ENVS from "./NODE_ENVS.js";

/**
 * Cookie options based on the current Node environment.
 */
const COOKIE_OPTIONS = {
  httpOnly: true,
  ...(process.env.NODE_ENV === NODE_ENVS.PRODUCTION && {
    secure: true,
    sameSite: "strict",
  }),
};

export default COOKIE_OPTIONS;
