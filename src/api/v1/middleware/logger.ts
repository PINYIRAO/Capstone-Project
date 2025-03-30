import morgan from "morgan";
import fs from "fs";
import path from "path";
import { Writable } from "stream";
import { RequestHandler } from "express";
import winston, { Logger } from "winston";

// create a write stream( in append mode) for regular logs
const accessLogStream: Writable = fs.createWriteStream(
  path.join(__dirname, "../../../../logs/access.log"),
  { flags: "a" }
);

const accessLogger: RequestHandler = morgan("combined", {
  stream: accessLogStream,
});

// use winston to log an error

const errorLogger: Logger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, "../../../../logs/err.log"),
    }),
  ],
});

export { accessLogger, errorLogger };
