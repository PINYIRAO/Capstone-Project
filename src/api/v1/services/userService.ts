import { UserSignUp, UserUpdate, User } from "../models/userModel";
import * as firestoreRepository from "../repositories/firestoreRepository";
import { RepositoryError, ServiceError } from "../errors/errors";
import { getErrorCode, getErrorMessage } from "../utils/errorUtils";
import { auth, db } from "../../../../config/firebaseConfig";
import { UserRecord } from "node_modules/firebase-admin/lib/auth";

const COLLECTION: string = "users";

/**
 * @description Get all users that qualified with the optional parameters in query， set the function async temporarily.
 * @returns a Promise that resolves to an array of `User` objects.
 */
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const snapshot: FirebaseFirestore.QuerySnapshot =
      await firestoreRepository.getDocuments(COLLECTION);
    const resultUsers: User[] = snapshot.docs.map((doc) => {
      const data: FirebaseFirestore.DocumentData = doc.data();
      return { id: doc.id, ...data } as User;
    });

    return resultUsers;
  } catch (error: unknown) {
    if (error instanceof RepositoryError) {
      throw error;
    } else {
      throw new ServiceError(
        `Failed to get documents in ${COLLECTION}, ${getErrorMessage(error)}`,
        getErrorCode(error)
      );
    }
  }
};

/**
 * @description get an user by user id.
 * @returns {Promise<User|null>}
 * @throws {Error} If the User with the given ID is not found.
 */
export const getUserByUID = async (uid: string): Promise<User> => {
  try {
    const snapshot: FirebaseFirestore.QuerySnapshot =
      await firestoreRepository.getDocumentsByFieldValue(
        COLLECTION,
        "uid",
        uid
      );
    if (snapshot.docs.length > 1) {
      throw new Error(`User: ${uid} has more than one records!`);
    } else if (snapshot.docs.length === 0) {
      throw new Error(`User: ${uid} couldnot be found`);
    }
    const resultUsers: User[] = snapshot.docs.map((doc) => {
      const data: FirebaseFirestore.DocumentData = doc.data();
      return { id: doc.id, ...data } as User;
    });

    return resultUsers[0];
  } catch (error: unknown) {
    if (error instanceof RepositoryError) {
      throw error;
    } else {
      throw new ServiceError(
        `Failed to get document by uid in ${COLLECTION}, ${getErrorMessage(
          error
        )}`,
        getErrorCode(error)
      );
    }
  }
};

/**
 * @description create an User.
 * @param {Partial<User>}
 * user - the User data
 * @returns {Promise<User>} A promise that resolves to the created User
 */
export const createUser = async (
  user: Partial<UserSignUp>
): Promise<Partial<User>> => {
  try {
    const userRecord: UserRecord = await auth.createUser({
      email: user.email,
      password: user.password,
    });

    // when user finish the sign up, give the user role as default
    await auth.setCustomUserClaims(userRecord.uid, { role: "user" });

    const newUserRecord: Partial<User> = {
      email: user.email,
      uid: userRecord.uid,
      role: "user", // all created users have user role as default
      status: "Active",
      createdAt: new Date(),
    };
    // store the user info into firestore
    await db.collection(COLLECTION).doc(userRecord.uid).set(newUserRecord);

    return { id: userRecord.uid, ...newUserRecord } as User;
  } catch (error: unknown) {
    if (error instanceof RepositoryError) {
      throw error;
    } else {
      throw new ServiceError(
        `Failed to create document in ${COLLECTION} with data: ${user}, ${getErrorMessage(
          error
        )}`,
        getErrorCode(error)
      );
    }
  }
};

/**
 * @description Update an existing user.
 */
export const updateUser = async (
  uid: string,
  user: UserUpdate
): Promise<Partial<User>> => {
  try {
    // upate the password if need
    await auth.updateUser(uid, user);

    const newUserRecord: Partial<User> = {
      ...user,
      updatedAt: new Date(),
    };
    // store the user info into firestore
    await db.collection(COLLECTION).doc(uid).update(newUserRecord);

    const snapshot: FirebaseFirestore.DocumentSnapshot | null =
      await firestoreRepository.getDocumentById(COLLECTION, uid);
    if (snapshot && snapshot.exists) {
      const data: FirebaseFirestore.DocumentData = snapshot.data() || {};
      if (data.uid === uid) {
        return { id: snapshot.id, ...data } as Partial<User>;
      }
    }
    return {};
  } catch (error: unknown) {
    if (error instanceof RepositoryError) {
      throw error;
    } else {
      throw new ServiceError(
        `Failed to update document with id: ${uid} in ${COLLECTION} with data: ${user}, ${getErrorMessage(
          error
        )}`,
        getErrorCode(error)
      );
    }
  }
};

/**
 * @description Delete an user.
 */
export const deactivateUser = async (uid: string): Promise<Partial<User>> => {
  try {
    // delete the user from auth
    await auth.deleteUser(uid);

    const newUserRecord: Partial<User> = {
      status: "Deleted",
      updatedAt: new Date(),
    };
    // store the user info into firestore
    await db.collection(COLLECTION).doc(uid).update(newUserRecord);
    const snapshot: FirebaseFirestore.DocumentSnapshot | null =
      await firestoreRepository.getDocumentById(COLLECTION, uid);
    if (snapshot && snapshot.exists) {
      const data: FirebaseFirestore.DocumentData = snapshot.data() || {};
      if (data.uid === uid) {
        return { id: snapshot.id, ...data } as Partial<User>;
      }
    }
    return {};
  } catch (error: unknown) {
    if (error instanceof RepositoryError) {
      throw error;
    } else {
      throw new ServiceError(
        `Failed to delete document with id: ${uid} in ${COLLECTION}, ${getErrorMessage(
          error
        )}`,
        getErrorCode(error)
      );
    }
  }
};
