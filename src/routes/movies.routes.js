import { Router } from "express";

import {
  destroy,
  index,
  show,
  store,
  update,
} from "../controllers/movie.controller.js";

const router = Router();

router.get("/", index);

router.get("/:id", show);

router.post("/", store);

router.patch("/:id", update);

router.delete("/:id", destroy);

export default router;
