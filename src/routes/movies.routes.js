import { Router } from "express";

import validateSchema from "../middlewares/validateSchema.middleware.js";
import { storeSchema, updateSchema } from "../schemas/movie.schema.js";
import MovieController from "../controllers/movie.controller.js";

const router = Router();

router.get("/", MovieController.index);

router.get("/:id", MovieController.show);

router.post("/", validateSchema(storeSchema), MovieController.store);

router.patch("/:id", validateSchema(updateSchema), MovieController.update);

router.delete("/:id", MovieController.destroy);

export default router;
