import { HTTP_STATUS } from "../../../../constants/httpConstants";
import { ServiceError } from "../../errors/errors";
import { getErrorCode, getErrorMessage } from "../../utils/errorUtils";
import { DecodedIdToken } from "firebase-admin/auth";
import { auth } from "../../../../../config/firebaseConfig";
import fetch, { Response as FetchResponse } from "node-fetch";

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

type TokenResponse = {
  kind: string;
  localId: string;
  email: string;
  displayName: string;
  idToken: string;
  registered: boolean;
  refreshToken: string;
  expiresIn: string;
};

export const getRoleAndToken = async (
  users: User[]
): Promise<TokenObject[]> => {
  const url: string =
    "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBTTcse8AzPVPgHrv1vJsjKMVgUjOG4qgw";
  const tokenObjects: TokenObject[] = [];
  try {
    for (const value of users) {
      const response: FetchResponse = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });

      if (!response.ok) {
        throw new ServiceError(
          `Failed to get the user ${value.email}'s Token`,
          "FAILED_GET_TOKEN",
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      }
      const result: TokenResponse = (await response.json()) as TokenResponse;

      const decodedIdToken: DecodedIdToken = await auth.verifyIdToken(
        result.idToken
      );

      tokenObjects.push({
        uid: decodedIdToken.uid,
        email: result.email,
        idToken: result.idToken,
        role: decodedIdToken.role,
      });
    }
    return tokenObjects;
  } catch (error: unknown) {
    throw new ServiceError(
      `Get IdTokens and roles Unseccessfully: ${getErrorMessage(error)}`,
      getErrorCode(error)
    );
  }
};
