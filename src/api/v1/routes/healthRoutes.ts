/**
 * Health check Routes (health.ts)
 *
 * This file defines the routes for health check in our application.
 * It uses the Express framework for routing
 */
import express, { Router } from "express";

// express Router instance created.
const router: Router = express.Router();

/**
 * @route GET /
 * @description check the application health status.
 */
/**
 * @openapi
 * /health:
 *  get:
 *   summary: Get health status of the application
 *   tags: [Health]
 *   responses:
 *    200:
 *     description: The application's status indicated by a message "Server is healthy"
 */
router.get("/", (req, res) => {
  res.send("Server is healthy");
});
export default router;
