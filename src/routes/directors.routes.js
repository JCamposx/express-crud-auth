import { Router } from "express";

import {
  destroy,
  index,
  show,
  store,
  update,
} from "../controllers/director.controller.js";
import { storeSchema, updateSchema } from "../schemas/director.schema.js";
import validateSchema from "../middlewares/validateSchema.middleware.js";

const router = Router();

router.get("/", index);

router.get("/:id", show);

router.post("/", validateSchema(storeSchema), store);

router.patch("/:id", validateSchema(updateSchema), update);

router.delete("/:id", destroy);

export default router;
