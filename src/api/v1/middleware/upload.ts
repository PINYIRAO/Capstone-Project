import { Request, Response, NextFunction } from "express";
import * as multer from "multer";
import storageOption from "../../../../config/multerConfig";

// internal module imports
import { MiddlewareFunction } from "../types/expressTypes";

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
