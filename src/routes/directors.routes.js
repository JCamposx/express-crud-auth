import { Router } from "express";

import { storeSchema, updateSchema } from "../schemas/director.schema.js";
import validateSchema from "../middlewares/validateSchema.middleware.js";
import DirectorController from "../controllers/director.controller.js";

const router = Router();

router.get("/", DirectorController.index);

router.get("/:id", DirectorController.show);

router.post("/", validateSchema(storeSchema), DirectorController.store);

router.patch("/:id", validateSchema(updateSchema), DirectorController.update);

router.delete("/:id", DirectorController.destroy);

export default router;
