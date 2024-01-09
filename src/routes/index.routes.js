import { fileURLToPath } from "url";
import { Router } from "express";
import { readdirSync } from "fs";
import path from "path";

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
