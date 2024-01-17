/**
 * API endpoints routes.
 * Use these paths with the `urlBuilder` utility to construct complete URLs.
 */
const ROUTES = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
  },
  MOVIES: {
    INDEX: "/api/movies",
    SHOW: "/api/movies/:id",
    STORE: "/api/movies",
    UPDATE: "/api/movies/:id",
    DESTROY: "/api/movies/:id",
  },
  DIRECTORS: {
    INDEX: "/api/directors",
    SHOW: "/api/directors/:id",
    STORE: "/api/directors",
    UPDATE: "/api/directors/:id",
    DESTROY: "/api/directors/:id",
  },
};

export default ROUTES;
