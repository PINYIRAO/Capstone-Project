import express, { Router } from "express";
import {
  getAllUsers,
  getUserByUID,
  createUser,
  updateUser,
  deactivateUser,
} from "../controllers/userController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router: Router = express.Router();
/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     summary: Get all users
 *     description: Admins can retrieve a list of all registered users.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/",
  authenticate,
  isAuthorized({ hasRole: ["admin"] }),
  getAllUsers
);

/**
 * @openapi
 * /api/v1/users/profile:
 *   get:
 *     summary: Get current user profile
 *     description: Retrieve profile information for the currently authenticated user.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", authenticate, getUserByUID);
/**
 * @openapi
 * /api/v1/users:
 *   post:
 *     summary: Register a new user
 *     description: Public route to register a new user with email and password.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSignUp'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid request data
 */
router.post("/", createUser);
/**
 * @openapi
 * /api/v1/users/updateprofile:
 *   put:
 *     summary: Update current user profile
 *     description: Authenticated users can update their profile information.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.put("/updateprofile", authenticate, updateUser);
/**
 * @openapi
 * /api/v1/users:
 *   delete:
 *     summary: Deactivate (soft-delete) current user
 *     description: Authenticated users can deactivate their own account. The account is marked as deleted but not removed.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deactivated successfully
 *       401:
 *         description: Unauthorized
 */
router.delete("/", authenticate, deactivateUser);

export default router;
