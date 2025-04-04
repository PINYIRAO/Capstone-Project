import { firestore } from "firebase-admin";

/**
 * Firestore Test Helpers
 *
 * This file contains utility functions to help mock Firestore operations in your tests.
 * These helpers make it easier to write unit tests for code that interacts with Firestore,
 * without actually connecting to a real Firestore database.
 */

/**
 * MockFirestoreData represents the structure of a Firestore document.
 * It's a flexible type that can contain any key-value pairs, just like a real Firestore document.
 */
export type MockFirestoreData = {
  [key: string]: unknown;
};

export type MockFirestoreCollection = {
  doc: jest.Mock;
  add: jest.Mock;
};

export type MockFirestoreQuery = {
  get: jest.Mock;
  where: jest.Mock;
  orderBy: jest.Mock;
  limit: jest.Mock;
};

export type MockSnapshot = {
  docs: FirestoreDocumentSnapshot[];
};

export type MockFirestoreDocumentSnapshot = {
  data: () => MockFirestoreData;
  id: string;
};

export type MockQuerySnapshot = {
  docs: MockFirestoreDocumentSnapshot[];
  forEach: jest.Mock;
  empty: boolean;
  size: number;
};

export type FirestoreDocumentSnapshot<T = unknown> = {
  id: string;
  data: () => T;
};

export type PartialMockFirestoreTransaction = Partial<{
  [K in keyof firestore.Transaction]: jest.Mock;
}>;

/**
 * mockFirestoreCollection creates a mock Firestore collection with a single document.
 *
 * @param docData - The data to be stored in the mock document
 * @param id - The ID of the mock document (defaults to "mockDocId" if not provided)
 *
 * @returns An object that mimics a Firestore collection reference
 *
 * Usage example:
 * const mockCollection = mockFirestoreCollection({ name: "John", age: 30 }, "user123");
 */
export const mockFirestoreCollection = (
  docData: MockFirestoreData,
  id: string = "mockDocId"
): MockFirestoreCollection => {
  return {
    doc: jest.fn().mockReturnValue({
      set: jest.fn().mockResolvedValue(undefined),
      get: jest.fn().mockResolvedValue({
        id,
        exists: true,
        data: () => ({ ...docData }),
      }),
      update: jest.fn().mockResolvedValue(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
      id,
    }),
    add: jest.fn().mockResolvedValue({ id }),
  };
};

/**
 * mockFirestoreTransaction is a mock of a Firestore transaction object.
 * It provides mock functions for common transaction operations.
 *
 * Usage example:
 * // In your test:
 * mockFirestoreTransaction.get.mockResolvedValue(someMockDocumentData);
 */
export const mockFirestoreTransaction: jest.Mocked<firestore.Transaction> = {
  get: jest.fn(),
  getAll: jest.fn(),
  create: jest.fn(),
  set: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

/**
 * mockQuerySnapshot creates a mock of a Firestore query snapshot.
 *
 * @param docs - An array of document data to be included in the snapshot
 *
 * @returns An object that mimics a Firestore query snapshot
 *
 * Usage example:
 * const mockSnapshot = mockQuerySnapshot([
 *     { id: "doc1", name: "John" },
 *     { id: "doc2", name: "Jane" }
 * ]);
 */
export const mockQuerySnapshot = (
  docs: MockFirestoreData[]
): MockQuerySnapshot => ({
  docs: docs.map((doc) => ({
    data: (): MockFirestoreData => doc,
    id: (doc.id as string) || "mockDocId",
  })),
  forEach: jest.fn((callback) =>
    docs.forEach((doc) =>
      callback({
        data: (): MockFirestoreData => doc,
        id: (doc.id as string) || "mockDocId",
      })
    )
  ),
  empty: docs.length === 0,
  size: docs.length,
});

/**
 * mockFirestoreQuery creates a mock of a Firestore query.
 *
 * @param docs - An array of document data to be returned by the query
 *
 * @returns An object that mimics a Firestore query
 *
 * Usage example:
 * const mockQuery = mockFirestoreQuery([
 *     { id: "doc1", name: "John" },
 *     { id: "doc2", name: "Jane" }
 * ]);
 */
export const mockFirestoreQuery = (
  docs: MockFirestoreData[]
): MockFirestoreQuery => ({
  get: jest.fn().mockResolvedValue(mockQuerySnapshot(docs)),
  where: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
});

/**
 * How to use these helpers in your tests:
 *
 * 1. Import the helpers you need in your test file:
 *    import { mockFirestoreCollection, mockFirestoreQuery } from './path-to-this-file';
 *
 * 2. In your test, use these helpers to create mock Firestore objects:
 *    const mockCollection = mockFirestoreCollection({ name: "John" }, "user123");
 *    const mockQuery = mockFirestoreQuery([{ id: "doc1", name: "John" }]);
 *
 * 3. Use Jest to mock your Firestore module and return these mock objects:
 *    jest.mock('./your-firestore-module', () => ({
 *      collection: jest.fn().mockReturnValue(mockCollection),
 *      query: jest.fn().mockReturnValue(mockQuery),
 *    }));
 *
 * 4. Now you can test your functions that interact with Firestore without actually connecting to a database.
 *
 * Remember: These helpers create simplified versions of Firestore objects.
 * They may not cover all possible Firestore behaviors, so you might need to extend them for more complex scenarios.
 */
