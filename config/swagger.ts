import swaggerUi from "swagger-ui-express";
// import swagger ui middleware, jsdoc library
import { Express } from "express";
import { generateSwaggerSpec } from "./swaggerOptions";

const setupSwagger = (app: Express): void => {
  const specs: object = generateSwaggerSpec();
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};

// export swagger endpoint for Express app
export default setupSwagger;
