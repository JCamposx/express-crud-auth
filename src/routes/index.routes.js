import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { readdirSync } from "fs";

const PATH_ROUTER = path.dirname(fileURLToPath(import.meta.url));

const router = Router();

const cleanFileName = (fileName) => {
  const file = fileName.split(".").shift();

  return file;
};

readdirSync(PATH_ROUTER).filter((fileName) => {
  const cleanName = cleanFileName(fileName);

  if (cleanName === "index") {
    return null;
  }

  import(`./${fileName}`).then((moduleRouter) => {
    router.use(`/${cleanName}`, moduleRouter.default);
  });
});

export default router;
