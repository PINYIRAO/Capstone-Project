import { Request, Response, NextFunction } from "express";
import * as multer from "multer";

// internal module imports
import { MiddlewareFunction } from "../types/expressTypes";

const storageOption: multer.DiskStorageOptions = {
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    cb(null, "uploads/");
  },
  // set the filename saved in the server
  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    const uniqueSuffix: string =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
};
const storage: multer.StorageEngine = multer.diskStorage(storageOption);

const upload: MiddlewareFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  multer
    .default({
      storage: storage,
      limits: {
        fileSize: 1024 * 1024, // max size 1MB for each single file
        files: 5, // toal up to five files
      },
    })
    .array("courseScreenshots", 5)(req, res, next);
};

export default upload;
