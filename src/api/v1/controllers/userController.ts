/**
 * User Controller (userController.ts)
 *
 * This file defines functions (controllers) for handling incoming requests related to users.
 * These functions interact with the user service (userService.ts) to perform the actual
 * logic for CRUD operations on users.
 */

import { Request, Response, NextFunction } from "express";
import * as userService from "../services/userService";
import type { User } from "../models/userModel";
import { successResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";

/**
 * @description Get all users.
 * @route GET /
 * @returns {Promise<void>}
 */
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users: User[] = await userService.getAllUsers();
    res.status(HTTP_STATUS.OK).json(successResponse(users, "User Retrieved"));
  } catch (error) {
    next(error);
  }
};

/**
 * @description get an existing user by id.
 * @route get /:id
 * @returns {Promise<void>}
 */
export const getUserByUID = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // call the userService by passing the id from thge url path and the body of the request
    const user: User = await userService.getUserByUID(res.locals.uid);

    res.status(HTTP_STATUS.OK).json(successResponse(user, "User Found"));
  } catch (error) {
    next(error);
  }
};

/**
 * @description Create a new user.
 * @route POST /
 * @returns {Promise<void>}
 */
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // call the userService by passing the body of the request
    // set the uid for user
    const newUser: User = await userService.createUser(req.body);

    res
      .status(HTTP_STATUS.CREATED)
      .json(successResponse(newUser, "User Created"));
  } catch (error) {
    next(error);
  }
};

/**
 * @description Update an existing user.
 * @route PUT /:id
 * @returns {Promise<void>}
 */
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // call the userService by passing the id from thge url path and the body of the request
    // set the uid for user
    const updatedUser: Partial<User> = await userService.updateUser(
      res.locals.uid,
      req.body
    );

    res
      .status(HTTP_STATUS.OK)
      .json(successResponse(updatedUser, "User Updated"));
  } catch (error) {
    next(error);
  }
};

/**
 * @description Delete an user.
 * @route DELETE /:id
 * @returns {Promise<void>}
 */
export const deactivateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const deletedUser: Partial<User> = await userService.deactivateUser(
      res.locals.uid
    );

    res
      .status(HTTP_STATUS.OK)
      .json(successResponse(deletedUser, "User Deleted"));
  } catch (error) {
    next(error);
  }
};
