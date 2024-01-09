export const NODE_ENVS = {
  DEVELOPMENT: "dev",
  PRODUCTION: "prod",
};

export const COOKIE_OPTIONS = {
  httpOnly: true,
  ...(process.env.NODE_ENV === NODE_ENVS.PRODUCTION && {
    secure: true,
    sameSite: "strict",
  }),
};
