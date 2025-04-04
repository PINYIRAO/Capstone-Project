import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../src/api/v1/services/courseService";
import {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
} from "../src/api/v1/repositories/firestoreRepository";
import { Course } from "../src/api/v1/models/courseModel";
import { courseObj } from "./data/courseSample";
import {
  QuerySnapshot,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase-admin/firestore";
import { ServiceError, RepositoryError } from "../src/api/v1/errors/errors";

jest.mock("../src/api/v1/repositories/firestoreRepository", () => ({
  getDocuments: jest.fn(),
  getDocumentById: jest.fn(),
  createDocument: jest.fn(),
  updateDocument: jest.fn(),
  deleteDocument: jest.fn(),
  getDocumentsByFieldValue: jest.fn(),
}));
describe("course Service", () => {
  describe("getAllCourses", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return all courses when the request is successful", async () => {
      // Mock data
      const mockDate: Date = new Date();
      const mockDocs: QueryDocumentSnapshot[] = [
        {
          id: "1234",
          data: () =>
            ({
              ...courseObj,
              createdAt: mockDate,
              updatedAt: mockDate,
            } as DocumentData),
        } as QueryDocumentSnapshot,
      ];

      const mockSnapshot: QuerySnapshot = {
        docs: mockDocs,
      } as QuerySnapshot;

      (getDocuments as jest.Mock).mockResolvedValue(mockSnapshot);

      const result: Course[] = await getAllCourses(
        "COMP-3018",
        "Back-End Development"
      );

      // Assertions
      expect(getDocuments).toHaveBeenCalledWith("courses");
      expect(getDocuments).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(1);

      expect(result[0]).toHaveProperty("id", "1234");
      expect(result[0]).toHaveProperty("courseName", "Back-End Development");
    });

    it("should throw an error when occurs the repository Error", async () => {
      // Mock data

      const err: Error = new RepositoryError("test", "testCode", 500);
      (getDocuments as jest.Mock).mockRejectedValue(err);

      // Assertions
      await expect(
        getAllCourses("COMP-3018", "Back-End Development")
      ).rejects.toThrow(err);
    });
    it("should throw an service error when occurs an error but not repository Error type", async () => {
      // Mock data

      const err: Error = new Error("service error");
      (getDocuments as jest.Mock).mockRejectedValue(err);

      // Assertions
      await expect(
        getAllCourses("COMP-3018", "Back-End Development")
      ).rejects.toThrow(ServiceError);
    });
  });

  describe("getCourseById", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return the course with the specific ID successfully", async () => {
      // Mock data
      const mockDate: Date = new Date();
      const mockDoc: FirebaseFirestore.DocumentSnapshot = {
        id: "1234",
        exists: true,
        data: () =>
          ({
            ...courseObj,
            createdAt: mockDate,
            updatedAt: mockDate,
          } as DocumentData),
      } as FirebaseFirestore.DocumentSnapshot;

      (getDocumentById as jest.Mock).mockResolvedValue(mockDoc);

      const result: Course = await getCourseById("1234");

      // Assertions
      expect(getDocumentById).toHaveBeenCalledWith("courses", "1234");
      expect(getDocumentById).toHaveBeenCalledTimes(1);

      expect(result).toHaveProperty("id", "1234");
      expect(result).toHaveProperty("courseName", "Back-End Development");
    });
    it("should throw an error when there is no document found", async () => {
      // Mock data
      const mockDate: Date = new Date();
      const mockDoc: FirebaseFirestore.DocumentSnapshot = {
        id: "1234",
        exists: false,
        data: () =>
          ({
            createdAt: mockDate,
            updatedAt: mockDate,
          } as DocumentData),
      } as FirebaseFirestore.DocumentSnapshot;

      (getDocumentById as jest.Mock).mockResolvedValue(mockDoc);

      // Assertions
      await expect(getCourseById("1234")).rejects.toThrow(ServiceError);
    });

    it("should throw an error when occurs the repository Error", async () => {
      // Mock data

      const err: Error = new RepositoryError("test", "testCode", 500);
      (getDocumentById as jest.Mock).mockRejectedValue(err);

      // Assertions
      await expect(getCourseById("1234")).rejects.toThrow(err);
    });
    it("should throw an service error when occurs an error but not repository Error type", async () => {
      // Mock data

      const err: Error = new Error("service error");
      (getDocumentById as jest.Mock).mockRejectedValue(err);

      // Assertions
      await expect(getCourseById("1234")).rejects.toThrow(ServiceError);
    });
  });

  describe("createCourse", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return the course when the course creation is successful", async () => {
      // Mock data
      const mockDate: Date = new Date();
      const mockDoc: FirebaseFirestore.DocumentSnapshot = {
        id: "1234",
        exists: true,
        data: () =>
          ({
            ...courseObj,
            createdAt: mockDate,
            updatedAt: mockDate,
          } as DocumentData),
      } as FirebaseFirestore.DocumentSnapshot;
      (createDocument as jest.Mock).mockResolvedValue(mockDoc);

      const result: Course = await createCourse(courseObj);

      // Assertions
      expect(createDocument).toHaveBeenCalledTimes(1);

      expect(result).toHaveProperty("id", "1234");
      expect(result).toHaveProperty("courseName", "Back-End Development");
    });

    it("should throw an error when occurs the repository Error", async () => {
      // Mock data

      const err: Error = new RepositoryError("test", "testCode", 500);
      (createDocument as jest.Mock).mockRejectedValue(err);

      // Assertions
      await expect(createCourse(courseObj)).rejects.toThrow(err);
    });
    it("should throw an service error when occurs an error but not repository Error type", async () => {
      // Mock data

      const err: Error = new Error("service error");
      (createDocument as jest.Mock).mockRejectedValue(err);

      // Assertions
      await expect(createCourse(courseObj)).rejects.toThrow(ServiceError);
    });
  });
});

describe("updateCourse", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return the course with updated information", async () => {
    // Mock data
    const mockDate: Date = new Date();
    const mockDoc: FirebaseFirestore.DocumentSnapshot = {
      id: "1234",
      exists: true,
      data: () =>
        ({
          ...courseObj,
          createdAt: mockDate,
          updatedAt: mockDate,
        } as DocumentData),
    } as FirebaseFirestore.DocumentSnapshot;

    (updateDocument as jest.Mock).mockResolvedValue(mockDoc);
    (getDocumentById as jest.Mock).mockResolvedValue(mockDoc);

    const result: Course = await updateCourse("1234", courseObj);

    // Assertions
    expect(updateDocument).toHaveBeenCalledTimes(1);

    expect(result).toHaveProperty("id", "1234");
    expect(result).toHaveProperty("courseName", "Back-End Development");
  });

  it("should throw an error when occurs the repository Error", async () => {
    // Mock data

    const err: Error = new RepositoryError("test", "testCode", 500);
    (updateDocument as jest.Mock).mockRejectedValue(err);

    // Assertions
    await expect(updateCourse("1234", courseObj)).rejects.toThrow(err);
  });
  it("should throw an service error when occurs an error but not repository Error type", async () => {
    // Mock data

    const err: Error = new Error("service error");
    (updateDocument as jest.Mock).mockRejectedValue(err);

    // Assertions
    await expect(updateCourse("1234", courseObj)).rejects.toThrow(ServiceError);
  });
});

describe("deleteCourse", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return the course with updated information", async () => {
    await deleteCourse("1234");

    // Assertions
    expect(deleteDocument).toHaveBeenCalledTimes(1);
  });

  it("should throw an error when occurs the repository Error", async () => {
    // Mock data

    const err: Error = new RepositoryError("test", "testCode", 500);
    (deleteDocument as jest.Mock).mockRejectedValue(err);

    // Assertions
    await expect(deleteCourse("1234")).rejects.toThrow(err);
  });
  it("should throw an service error when occurs an error but not repository Error type", async () => {
    // Mock data

    const err: Error = new Error("service error");
    (deleteDocument as jest.Mock).mockRejectedValue(err);

    // Assertions
    await expect(deleteCourse("1234")).rejects.toThrow(ServiceError);
  });
});
