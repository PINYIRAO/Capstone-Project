import { Request } from "express";
import * as multer from "multer";

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

export default storageOption;
