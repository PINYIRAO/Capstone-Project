import { Request, Response, NextFunction } from "express";
import * as multer from "multer";
import path from "path";

// internal module imports
import { MiddlewareFunction, RequestData } from "../types/expressTypes";
import { getErrorCode } from "../utils/errorUtils";

const storageOption: multer.DiskStorageOptions = {
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  // set the filename saved in the server
  filename: function (req, file, cb) {
    const uniqueSuffix: string =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
};
const storage: multer.StorageEngine = multer.diskStorage(storageOption);

export const upload = (): MiddlewareFunction => {
  return (req: Request, res: Response, next: NextFunction) => {
    multer.default({
      storage: storage,
      limits: {
        fileSize: 1024 * 1024, // file max size 1MB
        files: 5, // up to five files
      },
    });
  };
};
