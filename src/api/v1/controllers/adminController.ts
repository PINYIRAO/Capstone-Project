import { Request, Response, NextFunction } from "express";
import { auth } from "../../../../config/firebaseConfig";
import { successResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { AuthenticationError, ExtendedError } from "../errors/errors";
import { getErrorCode, getErrorMessage } from "../utils/errorUtils";
import { getRoleAndToken } from "../services/admin/getRoleAndToken";

// the users data in the request body
type User = {
  email: string;
  password: string;
  returnSecureToken: boolean;
};

type TokenObject = {
  uid: string;
  email: string;
  idToken: string;
  role: "admin" | "manager" | "user";
};

export const setCustomClaims = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { uid, claims } = req.body;

  try {
    await auth.setCustomUserClaims(uid, claims);
    res
      .status(HTTP_STATUS.OK)
      .send(successResponse({}, `Custom claims set for user: ${uid}`));
  } catch (error: unknown) {
    if (error instanceof Error) {
      return next(
        new AuthenticationError(
          `SetCustomClaims Unseccessfully: ${getErrorMessage(error)}`,
          getErrorCode(error)
        )
      );
    } else {
      next(error);
    }
  }
};

export const getTokenAndRoleBatch = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let users: User[] = req.body;
  // get the user password from env variables
  users = users.map((user) => {
    return { ...user, password: process.env.USER_PASSWORD };
  });

  if (!users) {
    return next(
      new ExtendedError(
        "Should contain the users information in body",
        "NO USER PROVIDED",
        HTTP_STATUS.BAD_REQUEST
      )
    );
  }
  // if has users info, then get role and idtoken for them
  const tokenObjects: TokenObject[] = await getRoleAndToken(users);
  res
    .status(HTTP_STATUS.OK)
    .send(
      successResponse(
        tokenObjects,
        `Tokens and Roles for users are fetched successfully.`
      )
    );
};
