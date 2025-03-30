import swaggerJsdoc from "swagger-jsdoc";

const serverUrl: string =
  process.env.SWAGGER_SERVER_URL || "http://localhost:3000/api/v1";

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Employee and Branch Management API Documentation",
      version: "1.0.0",
      description:
        "This is the API documentation for Employee and Branch Management application.",
    },
    servers: [
      {
        url: serverUrl,
        description:
          process.env.NODE_ENV === "production"
            ? "Production Server"
            : "Local Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/api/v1/routes/*.ts", "./src/api/v1/models/*.ts"], // Path to the API docs and schemas
};

// Generate the Swagger spec
export const generateSwaggerSpec = (): object => {
  return swaggerJsdoc(swaggerOptions);
};
