import { fileURLToPath } from "url";
import { Router } from "express";
import { readdirSync } from "fs";
import path from "path";

import validateToken from "../middlewares/validateToken.middleware.js";

const PATH_ROUTER = path.dirname(fileURLToPath(import.meta.url));

const router = Router();

const cleanFileName = (fileName) => {
  const file = fileName.split(".").shift();

  return file;
};

readdirSync(PATH_ROUTER).forEach((fileName) => {
  const cleanName = cleanFileName(fileName);

  if (cleanName === "index") {
    return;
  }

  const authMiddleware = cleanName === "auth" ? [] : [validateToken];

  import(`./${fileName}`).then((moduleRouter) => {
    router.use(`/${cleanName}`, ...authMiddleware, moduleRouter.default);
  });
});

export default router;
