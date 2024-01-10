import { Router } from "express";

import { login, logout, register } from "../controllers/auth.controller.js";
import validateSchema from "../middlewares/validateSchema.middleware.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";
import validateToken from "../middlewares/validateToken.middleware.js";

const router = Router();

router.post("/register", validateSchema(registerSchema), register);

router.post("/login", validateSchema(loginSchema), login);

router.post("/logout", validateToken, logout);

export default router;
