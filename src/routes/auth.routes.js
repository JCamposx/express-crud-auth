import { Router } from "express";

import { login, logout, register } from "../controllers/auth.controller.js";
import validateToken from "../middlewares/validateToken.middleware.js";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", validateToken, logout);

export default router;
