import { Router } from "express";

import {
  destroy,
  index,
  show,
  store,
  update,
} from "../controllers/movie.controller.js";
import validateSchema from "../middlewares/validateSchema.middleware.js";
import { storeSchema, updateSchema } from "../schemas/movie.schema.js";

const router = Router();

router.get("/", index);

router.get("/:id", show);

router.post("/", validateSchema(storeSchema), store);

router.patch("/:id", validateSchema(updateSchema), update);

router.delete("/:id", destroy);

export default router;
