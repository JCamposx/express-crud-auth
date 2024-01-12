import { Router } from "express";

import validateSchema from "../middlewares/validateSchema.middleware.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";
import validateToken from "../middlewares/validateToken.middleware.js";
import AuthController from "../controllers/auth.controller.js";

const router = Router();

router.post(
  "/register",
  validateSchema(registerSchema),
  AuthController.register,
);

router.post("/login", validateSchema(loginSchema), AuthController.login);

router.post("/logout", validateToken, AuthController.logout);

export default router;
