import express, { Router } from "express";
import {
  setCustomClaims,
  getTokenAndRoleBatch,
} from "../controllers/adminController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router: Router = express.Router();

/**
 * @openapi
 * /api/v1/admin/setCustomClaims:
 *   post:
 *     summary: Set custom claims (roles) for a user
 *     description: Allows admin users to assign custom claims (like roles) to a Firebase user.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uid:
 *                 type: string
 *               role:
 *                 type: string
 *                 example: admin
 *     responses:
 *       200:
 *         description: Successfully set custom claims
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/setCustomClaims",
  authenticate,
  isAuthorized({ hasRole: ["admin"] }),
  setCustomClaims
);

/**
 * @openapi
 * /api/v1/users/getTokenAndRoleBatch:
 *   get:
 *     summary: Get tokens and roles of all users
 *     description: Admin users can retrieve a list of users along with their tokens and assigned roles.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users with their tokens and roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   uid:
 *                     type: string
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 *                   token:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/getTokenAndRoleBatch",
  authenticate,
  isAuthorized({ hasRole: ["admin"] }),
  getTokenAndRoleBatch
);

export default router;
