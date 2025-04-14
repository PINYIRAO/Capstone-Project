jest.mock("../src/api/v1/repositories/firestoreRepository", () => ({
  getDocuments: jest.fn(),
  getDocumentById: jest.fn(),
  createDocument: jest.fn(),
  updateDocument: jest.fn(),
  deleteDocument: jest.fn(),
  getDocumentsByFieldValue: jest.fn(),
}));
const updateMock: jest.Mock = jest.fn();
jest.mock("../config/firebaseConfig", () => ({
  auth: {
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    setCustomUserClaims: jest.fn(),
  },
  db: {
    collection: jest.fn(() => {
      // eslint-disable-next-line no-unused-labels
      doc: jest.fn(() => {
        // eslint-disable-next-line no-unused-labels, @typescript-eslint/no-unused-expressions
        update: updateMock;
      });
    }),
  },
}));
import dotenv from "dotenv";
dotenv.config();
import { auth } from "../config/firebaseConfig";
import {
  getAllUsers,
  getUserByUID,
  createUser,
  updateUser,
  deactivateUser,
} from "../src/api/v1/services/userService";
import {
  getDocuments,
  getDocumentById,
  deleteDocument,
  getDocumentsByFieldValue,
} from "../src/api/v1/repositories/firestoreRepository";
import { UserSignUp, UserUpdate, User } from "../src/api/v1/models/userModel";
import {
  QuerySnapshot,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase-admin/firestore";
import { ServiceError, RepositoryError } from "../src/api/v1/errors/errors";
import { UserRecord } from "node_modules/firebase-admin/lib/auth";

describe("user Service", () => {
  let userObj: Partial<User> = {};
  let userSignUpObj: Partial<UserSignUp> = {};
  let userUpdateObj: UserUpdate = {};
  beforeEach(() => {
    jest.clearAllMocks();
    userObj = {
      uid: "123456",
      email: "abc@rrc.ca",
      displayName: "abc",
      photoURL: "testurl.com",
      role: "user",
      status: "Active",
    };
    userSignUpObj = {
      email: "abc@rrc.ca",
      password: "123232131!ddAAAd2",
      displayName: "abc",
      photoURL: "testurl.com",
    };
    userUpdateObj = {
      password: "dfd!ddAAAd2",
      displayName: "abcabc",
      photoURL: "testurl.com.ca",
    };
  });
  describe("getAllUsers", () => {
    it("should return all users when the request is successful", async () => {
      // Mock data
      const mockDate: Date = new Date();
      const mockDocs: QueryDocumentSnapshot[] = [
        {
          id: "1234",
          data: () =>
            ({
              ...userObj,
              createdAt: mockDate,
              updatedAt: mockDate,
            } as DocumentData),
        } as QueryDocumentSnapshot,
      ];

      const mockSnapshot: QuerySnapshot = {
        docs: mockDocs,
      } as QuerySnapshot;

      (getDocuments as jest.Mock).mockResolvedValue(mockSnapshot);

      const result: User[] = await getAllUsers();

      // Assertions
      expect(getDocuments).toHaveBeenCalledWith("users");
      expect(getDocuments).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(1);

      expect(result[0]).toHaveProperty("id", "1234");
      expect(result[0]).toHaveProperty("email", "abc@rrc.ca");
    });

    it("should throw an error when occurs the repository Error", async () => {
      // Mock data

      const err: RepositoryError = new RepositoryError("test", "testCode", 500);
      (getDocuments as jest.Mock).mockRejectedValue(err);

      // Assertions
      await expect(getAllUsers()).rejects.toThrow(err);
    });
    it("should throw an service error when occurs an error but not repository Error type", async () => {
      // Mock data

      const err: Error = new Error("service error");
      (getDocuments as jest.Mock).mockRejectedValue(err);

      // Assertions
      await expect(getAllUsers()).rejects.toThrow(ServiceError);
    });
  });

  describe("getUserByUID", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return the user with the specific ID successfully", async () => {
      // Mock data
      const mockDate: Date = new Date();
      const mockDocs: QueryDocumentSnapshot[] = [
        {
          id: "1234",
          data: () =>
            ({
              ...userObj,
              createdAt: mockDate,
              updatedAt: mockDate,
            } as DocumentData),
        } as QueryDocumentSnapshot,
      ];

      const mockSnapshot: QuerySnapshot = {
        docs: mockDocs,
      } as QuerySnapshot;

      (getDocumentsByFieldValue as jest.Mock).mockResolvedValue(mockSnapshot);

      const result: User = await getUserByUID("1234");

      // Assertions
      expect(getDocumentsByFieldValue).toHaveBeenCalledWith(
        "users",
        "uid",
        "1234"
      );
      expect(getDocumentsByFieldValue).toHaveBeenCalledTimes(1);

      expect(result).toHaveProperty("id", "1234");
      expect(result).toHaveProperty("email", "abc@rrc.ca");
    });
    it("should throw an error when there is no document found", async () => {
      // Mock data
      // const mockDate: Date = new Date();
      const mockDocs: QueryDocumentSnapshot[] = [];

      const mockSnapshot: QuerySnapshot = {
        docs: mockDocs,
      } as QuerySnapshot;

      (getDocumentsByFieldValue as jest.Mock).mockResolvedValue(mockSnapshot);

      // Assertions
      await expect(getUserByUID("1234")).rejects.toThrow(/couldnot be found/);
    });

    it("should throw an error when occurs the repository Error", async () => {
      // Mock data

      const err: RepositoryError = new RepositoryError("test", "testCode", 500);
      (getDocumentsByFieldValue as jest.Mock).mockRejectedValue(err);

      // Assertions
      await expect(getUserByUID("1234")).rejects.toThrow(err);
    });
    it("should throw an service error when occurs an error but not repository Error type", async () => {
      // Mock data

      const err: Error = new Error("service error");
      (getDocumentsByFieldValue as jest.Mock).mockRejectedValue(err);

      // Assertions
      await expect(getUserByUID("1234")).rejects.toThrow(ServiceError);
    });
  });

  describe("createUser", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return the user when the user creation is successful", async () => {
      // Mock data
      const mockRocord: Partial<UserRecord> = {
        uid: "1234",
        ...userSignUpObj,
      };
      (auth.createUser as jest.Mock).mockResolvedValue(mockRocord);

      const result: Partial<User> = await createUser(userSignUpObj);

      expect(result).toHaveProperty("id", "1234");
      expect(result).toHaveProperty("email", "abc@rrc.ca");
    });

    it("should throw an error when occurs the repository Error", async () => {
      // Mock data

      const err: RepositoryError = new RepositoryError("test", "testCode", 500);
      (auth.createUser as jest.Mock).mockRejectedValue(err);

      // Assertions
      await expect(createUser(userSignUpObj)).rejects.toThrow(err);
    });
    it("should throw an service error when occurs an error but not repository Error type", async () => {
      // Mock data

      const err: Error = new Error("service error");
      (auth.createUser as jest.Mock).mockRejectedValue(err);

      // Assertions
      await expect(createUser(userSignUpObj)).rejects.toThrow(ServiceError);
    });
  });
  describe("update user", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return the user with updated information", async () => {
      // Mock data
      const mockDate: Date = new Date();
      const mockDoc: FirebaseFirestore.DocumentSnapshot = {
        id: "1234",
        exists: true,
        data: () =>
          ({
            ...userUpdateObj,
            createdAt: mockDate,
            updatedAt: mockDate,
          } as DocumentData),
      } as FirebaseFirestore.DocumentSnapshot;

      (getDocumentById as jest.Mock).mockResolvedValue(mockDoc);

      const result: Partial<User> = await updateUser("1234", userUpdateObj);

      // Assertions
      expect(result).toHaveProperty("id", "1234");
      expect(result).toHaveProperty("displayName", "abcabc");
    });

    it("should throw an error when occurs the repository Error", async () => {
      // Mock data

      const err: RepositoryError = new RepositoryError("test", "testCode", 500);
      (getDocumentById as jest.Mock).mockRejectedValue(err);

      // Assertions
      await expect(updateUser("1234", userUpdateObj)).rejects.toThrow(err);
    });
    it("should throw an service error when occurs an error but not repository Error type", async () => {
      // Mock data

      const err: Error = new Error("service error");
      (getDocumentById as jest.Mock).mockRejectedValue(err);

      // Assertions
      await expect(updateUser("1234", userUpdateObj)).rejects.toThrow(
        ServiceError
      );
    });
  });

  describe("deactive user", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return the user with updated information", async () => {
      await deactivateUser("1234");

      // Assertions
      expect(updateMock).toHaveBeenCalledTimes(1);
    });

    it("should throw an error when occurs the repository Error", async () => {
      // Mock data

      const err: RepositoryError = new RepositoryError("test", "testCode", 500);
      (deleteDocument as jest.Mock).mockRejectedValue(err);

      // Assertions
      await expect(deactivateUser("1234")).rejects.toThrow(err);
    });
    it("should throw an service error when occurs an error but not repository Error type", async () => {
      // Mock data

      const err: Error = new Error("service error");
      (deleteDocument as jest.Mock).mockRejectedValue(err);

      // Assertions
      await expect(deactivateUser("1234")).rejects.toThrow(ServiceError);
    });
  });
});
