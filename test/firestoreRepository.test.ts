import {
  createDocument,
  getDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  deleteDocumentsByFieldValues,
} from "../src/api/v1/repositories/firestoreRepository";
import {
  mockFirestoreCollection,
  mockFirestoreQuery,
  MockFirestoreCollection,
  MockFirestoreQuery,
} from "./utils/mockFirebaseHelper";

jest.mock("../config/firebaseConfig", () => ({
  __esModule: true,
  default: {
    collection: jest.fn(),
    runTransaction: jest.fn(),
    batch: jest.fn(),
  },
}));

import db from "../config/firebaseConfig";

describe("Firestore Repository", () => {
  const mockCollectionName: string = "testCollection";
  const mockDocId: string = "mockDocId";
  const mockData: { id: string; name: string; value: number } = {
    id: mockDocId,
    name: "Test Document",
    value: 42,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createDocument", () => {
    it("should create a document with generated ID", async () => {
      const collectionRef: MockFirestoreCollection =
        mockFirestoreCollection(mockData);
      (db.collection as jest.Mock).mockReturnValue(collectionRef);

      const result: string = await createDocument(mockCollectionName, mockData);

      expect(result).toBe(mockDocId);
      expect(collectionRef.add).toHaveBeenCalledWith(mockData);
    });

    it("should create a document with provided ID", async () => {
      const collectionRef: MockFirestoreCollection = mockFirestoreCollection(
        mockData,
        mockDocId
      );
      (db.collection as jest.Mock).mockReturnValue(collectionRef);

      const result: string = await createDocument(
        mockCollectionName,
        mockData,
        mockDocId
      );

      expect(result).toBe(mockDocId);
      expect(collectionRef.doc().set).toHaveBeenCalledWith(mockData);
    });

    it("should throw a Error if creation fails", async () => {
      const collectionRef: MockFirestoreCollection =
        mockFirestoreCollection(mockData);
      collectionRef.add.mockRejectedValue(new Error("Creation failed"));
      (db.collection as jest.Mock).mockReturnValue(collectionRef);

      await expect(
        createDocument(mockCollectionName, mockData)
      ).rejects.toThrow(Error);
    });
  });

  describe("getDocuments", () => {
    it("should return all documents from a collection", async () => {
      const mockDocs: {
        id: string;
        name: string;
        value: number;
      }[] = [mockData, { ...mockData, id: "mockDocId2" }];
      const queryRef: MockFirestoreQuery = mockFirestoreQuery(mockDocs);
      (db.collection as jest.Mock).mockReturnValue(queryRef);

      const result: FirebaseFirestore.QuerySnapshot = await getDocuments(
        mockCollectionName
      );

      expect(result.docs).toHaveLength(mockDocs.length);
      expect(result.docs[0].data()).toEqual(mockDocs[0]);
    });

    it("should throw a Error if retrieval fails", async () => {
      const queryRef: MockFirestoreQuery = mockFirestoreQuery([]);
      queryRef.get.mockRejectedValue(new Error("Retrieval failed"));
      (db.collection as jest.Mock).mockReturnValue(queryRef);

      await expect(getDocuments(mockCollectionName)).rejects.toThrow(Error);
    });
  });

  describe("getDocumentById", () => {
    it("should return a document by ID", async () => {
      const collectionRef: MockFirestoreCollection = mockFirestoreCollection(
        mockData,
        mockDocId
      );
      (db.collection as jest.Mock).mockReturnValue(collectionRef);

      const result: FirebaseFirestore.DocumentSnapshot | null =
        await getDocumentById(mockCollectionName, mockDocId);

      expect(result!.data()).toEqual(mockData);
    });

    it("should throw an error if document doesn't exist", async () => {
      const collectionRef: MockFirestoreCollection = mockFirestoreCollection(
        {},
        mockDocId
      );
      collectionRef.doc().get.mockResolvedValue({ exists: false });
      (db.collection as jest.Mock).mockReturnValue(collectionRef);

      // Use async/await with expect to catch the thrown error
      await expect(
        getDocumentById(mockCollectionName, mockDocId)
      ).rejects.toThrow(
        `Document not found in collection ${mockCollectionName} with id ${mockDocId}`
      );
    });

    it("should throw a Error if retrieval fails", async () => {
      const collectionRef: MockFirestoreCollection = mockFirestoreCollection(
        mockData,
        mockDocId
      );
      collectionRef.doc().get.mockRejectedValue(new Error("Retrieval failed"));
      (db.collection as jest.Mock).mockReturnValue(collectionRef);

      await expect(
        getDocumentById(mockCollectionName, mockDocId)
      ).rejects.toThrow(Error);
    });
  });

  describe("updateDocument", () => {
    it("should update a document", async () => {
      const collectionRef: MockFirestoreCollection = mockFirestoreCollection(
        mockData,
        mockDocId
      );
      (db.collection as jest.Mock).mockReturnValue(collectionRef);

      await updateDocument(mockCollectionName, mockDocId, { value: 43 });

      expect(collectionRef.doc().update).toHaveBeenCalledWith({
        value: 43,
      });
    });

    it("should throw a Error if update fails", async () => {
      const collectionRef: MockFirestoreCollection = mockFirestoreCollection(
        mockData,
        mockDocId
      );
      collectionRef.doc().update.mockRejectedValue(new Error("Update failed"));
      (db.collection as jest.Mock).mockReturnValue(collectionRef);

      await expect(
        updateDocument(mockCollectionName, mockDocId, { value: 43 })
      ).rejects.toThrow(Error);
    });
  });

  describe("deleteDocument", () => {
    it("should delete a document", async () => {
      const collectionRef: MockFirestoreCollection = mockFirestoreCollection(
        mockData,
        mockDocId
      );
      (db.collection as jest.Mock).mockReturnValue(collectionRef);

      await deleteDocument(mockCollectionName, mockDocId);

      expect(collectionRef.doc().delete).toHaveBeenCalled();
    });

    it("should throw a Error if deletion fails", async () => {
      const collectionRef: MockFirestoreCollection = mockFirestoreCollection(
        mockData,
        mockDocId
      );
      collectionRef
        .doc()
        .delete.mockRejectedValue(new Error("Deletion failed"));
      (db.collection as jest.Mock).mockReturnValue(collectionRef);

      await expect(
        deleteDocument(mockCollectionName, mockDocId)
      ).rejects.toThrow(Error);
    });
  });

  describe("deleteDocumentsByFieldValues", () => {
    it("should delete documents by field values", async () => {
      const mockDocs: {
        id: string;
        field1: string;
        field2: string;
      }[] = [
        { id: "doc1", field1: "value1", field2: "value2" },
        { id: "doc2", field1: "value1", field2: "value2" },
      ];
      const queryRef: MockFirestoreQuery = mockFirestoreQuery(mockDocs);
      (db.collection as jest.Mock).mockReturnValue(queryRef);
      const batchMock: { commit: jest.Mock; delete: jest.Mock } = {
        commit: jest.fn().mockResolvedValue(null),
        delete: jest.fn(),
      };
      (db.batch as jest.Mock) = jest.fn().mockReturnValue(batchMock);

      const fieldValuePairs: {
        fieldName: string;
        fieldValue: string;
      }[] = [
        { fieldName: "field1", fieldValue: "value1" },
        { fieldName: "field2", fieldValue: "value2" },
      ];

      await deleteDocumentsByFieldValues(mockCollectionName, fieldValuePairs);

      expect(queryRef.where).toHaveBeenCalledTimes(2);
      expect(batchMock.delete).toHaveBeenCalledTimes(2);
      expect(batchMock.commit).toHaveBeenCalled();
    });

    it("should throw a Error if deletion by field values fails", async () => {
      const queryRef: MockFirestoreQuery = mockFirestoreQuery([]);
      queryRef.get.mockRejectedValue(new Error("Deletion failed"));
      (db.collection as jest.Mock).mockReturnValue(queryRef);

      const fieldValuePairs: {
        fieldName: string;
        fieldValue: string;
      }[] = [{ fieldName: "field1", fieldValue: "value1" }];

      await expect(
        deleteDocumentsByFieldValues(mockCollectionName, fieldValuePairs)
      ).rejects.toThrow(Error);
    });
  });
});
