/**
 * API endpoints routes.
 * Use these paths with the `urlBuilder` utility to construct complete URLs.
 */
const ROUTES = {
  auth: {
    register: "/api/auth/register",
    login: "/api/auth/login",
    logout: "/api/auth/logout",
  },
  movies: {
    index: "/api/movies",
    show: "/api/movies/:id",
    store: "/api/movies",
    update: "/api/movies/:id",
    destroy: "/api/movies/:id",
  },
  directors: {
    index: "/api/directors",
    show: "/api/directors/:id",
    store: "/api/directors",
    update: "/api/directors/:id",
    destroy: "/api/directors/:id",
  },
};

export default ROUTES;
