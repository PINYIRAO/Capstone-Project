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

router.get(
  "/",
  authenticate,
  isAuthorized({ hasRole: ["admin"] }),
  getAllUsers
);

router.get("/profile", authenticate, getUserByUID);

router.post("/", createUser);
router.put("/updateprofile", authenticate, updateUser);
router.delete("/", authenticate, deactivateUser);

export default router;
