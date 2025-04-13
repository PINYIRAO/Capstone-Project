// import the express application and type definition
import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();

import { ServiceError } from "./api/v1/errors/errors";
import { HTTP_STATUS } from "./constants/httpConstants";

// Importing morgan
import { accessLogger } from "./api/v1/middleware/logger";
// import setupSwagger endpoint
import setupSwagger from "../config/swagger";
// import middleware
import errorHandler from "./api/v1/middleware/errorHandler";
// import routes
import healthRoutes from "./api/v1/routes/healthRoutes";
import courseRoutes from "./api/v1/routes/courseRoutes";
import scheduleRotes from "./api/v1/routes/scheduleRoutes";
import adminRotes from "./api/v1/routes/adminRoutes";
import userRoutes from "./api/v1/routes/userRoutes";

import helmet from "helmet";
import cors from "cors";

// initialize the express application
const app: Express = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      // strict the source of resource
      directives: {
        defaultSrc: ["'self'"],
      },
    },
    // prevent from clickjacking
    xFrameOptions: { action: "sameorigin" },
    // prevent the xss attack
    xXssProtection: true,
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        [
          "http://localhost:3000",
          "http://localhost:3002",
          "http://127.0.0.1:5501",
          // "http://localhost:5501",
        ].includes(origin)
      ) {
        callback(null, true); // allow request
      } else {
        callback(
          new ServiceError(
            "Origin source is not allowed to access the API application",
            "NOT ALLOWED BY CROSS-SITE ACCESS POLICY",
            HTTP_STATUS.BAD_REQUEST // bad request
          ),
          false
        ); // deny request
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    // allow the cross site request send credentials
    credentials: true,
  })
);

// setup swagger for api documentation
setupSwagger(app);

app.use(express.json());

// Use morgan for HTTP request logging
app.use(accessLogger);

app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/schedules", scheduleRotes);
app.use("/api/v1/admin", adminRotes);
app.use("/api/v1/users", userRoutes);
app.use("/health", healthRoutes);

// apply error handling middleware
app.use(errorHandler);

// export app and server for testing
export default app;
