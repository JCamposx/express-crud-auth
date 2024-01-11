import { fileURLToPath } from "url";
import { Router } from "express";
import { readdirSync } from "fs";
import path from "path";

import { requestErrorHandler } from "../middlewares/errorHandler.middleware.js";
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
    const updatedModuleRouter = moduleRouter.default;

    updatedModuleRouter.stack = updatedModuleRouter.stack.map((layer) => {
      layer.route.stack = layer.route.stack.map((stackItem) => {
        stackItem.handle = requestErrorHandler(stackItem.handle);

        return stackItem;
      });

      return layer;
    });

    router.use(`/${cleanName}`, ...authMiddleware, updatedModuleRouter);
  });
});

export default router;
