import db from "../../../../config/firebaseConfig";
import { FirestoreDataTypes } from "../types/firestore";
import { RepositoryError } from "../errors/errors";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import {
  getErrorCode,
  getErrorMessage,
  getFirebaseErrorStatusCode,
} from "../utils/errorUtils";

/**
 * Represents a field-value pair used for querying documents.
 * Used primarily in filtering operations when deleting multiple documents.
 */
interface FieldValuePair {
  fieldName: string;
  fieldValue: FirestoreDataTypes;
}

/**
 * Creates a new document in the specified collection.
 *
 * @template T - The type of data being stored
 * @param collectionName - The name of the collection to create the document in
 * @param data - The data to be stored in the document
 * @param id - Optional custom document ID. If not provided, Firestore will auto-generate one
 * @returns Promise resolving to the created document's ID
 * @throws Error if document creation fails
 *
 * @example
 * const docId = await createDocument('users', { name: 'John', age: 25 });
 */
export const createDocument = async <T>(
  collectionName: string,
  data: Partial<T>,
  id?: string
): Promise<string> => {
  try {
    let docRef: FirebaseFirestore.DocumentReference;

    // If an ID is provided, use it to create a document at that specific ID
    // Otherwise, let Firestore auto-generate an ID
    if (id) {
      docRef = db.collection(collectionName).doc(id);
      await docRef.set(data);
    } else {
      docRef = await db.collection(collectionName).add(data);
    }

    return docRef.id;
  } catch (error: unknown) {
    throw new RepositoryError(
      `Failed to create document in ${collectionName} with data: ${data}, ${getErrorMessage(
        error
      )}`,
      getErrorCode(error),
      getFirebaseErrorStatusCode(error)
    );
  }
};

/**
 * Retrieves all documents from a specified Firestore collection.
 * @param {string} collectionName - The name of the collection.
 * @returns {Promise<FirebaseFirestore.QuerySnapshot>} - A QuerySnapshot containing all documents.
 */
export const getDocuments = async (
  collectionName: string
): Promise<FirebaseFirestore.QuerySnapshot> => {
  try {
    return await db.collection(collectionName).get();
  } catch (error) {
    throw new RepositoryError(
      `Failed to fetch documents from ${collectionName}: ${getErrorMessage(
        error
      )}`,
      getErrorCode(error),
      getFirebaseErrorStatusCode(error)
    );
  }
};

/**
 * Retrieves a document by its ID from a specified Firestore collection.
 * @param {string} collectionName - The name of the collection.
 * @param {string} id - The ID of the document to retrieve.
 * @returns {Promise<FirebaseFirestore.DocumentSnapshot | null>} - The document or null if it doesn't exist.
 */
export const getDocumentById = async (
  collectionName: string,
  id: string
): Promise<FirebaseFirestore.DocumentSnapshot | null> => {
  try {
    const doc: FirebaseFirestore.DocumentSnapshot = await db
      .collection(collectionName)
      .doc(id)
      .get();

    if (!doc.exists) {
      throw new RepositoryError(
        `Document not found in collection ${collectionName} with id ${id}`,
        "DOCUMENT_NOT_FOUND",
        HTTP_STATUS.NOT_FOUND
      );
    }
    return doc;
  } catch (error: unknown) {
    if (error instanceof RepositoryError) {
      throw error;
    }
    throw new RepositoryError(
      `Failed to fetch document ${id} from ${collectionName}: ${getErrorMessage(
        error
      )}`,
      getErrorCode(error),
      getFirebaseErrorStatusCode(error)
    );
  }
};

/**
 * Updates an existing document in a specified Firestore collection.
 * @param {string} collectionName - The name of the collection.
 * @param {string} id - The ID of the document to update.
 * @param {Partial<T>} data - The updated document data.
 * @returns {Promise<void>}
 */
export const updateDocument = async <T>(
  collectionName: string,
  id: string,
  data: Partial<T>
): Promise<void> => {
  try {
    // before update do the check to see if the given id exists
    const doc: FirebaseFirestore.DocumentSnapshot = await db
      .collection(collectionName)
      .doc(id)
      .get();

    if (!doc.exists) {
      throw new RepositoryError(
        `Failed to update: Document not found with given id ${id} in collection ${collectionName} `,
        "DOCUMENT_NOT_FOUND",
        HTTP_STATUS.NOT_FOUND
      );
    }

    await db.collection(collectionName).doc(id).update(data);
  } catch (error: unknown) {
    if (error instanceof RepositoryError) {
      throw error;
    } else {
      throw new RepositoryError(
        `Failed to update document ${id} in ${collectionName}: ${getErrorMessage(
          error
        )}`,
        getErrorCode(error),
        getFirebaseErrorStatusCode(error)
      );
    }
  }
};

/**
 * Deletes a document from a specified Firestore collection.
 * Can operate within a transaction if provided, otherwise performs a direct delete.
 * @param {string} collectionName - The name of the collection.
 * @param {string} id - The ID of the document to delete.
 * @param {FirebaseFirestore.Transaction} [transaction] - Optional Firestore transaction.
 * @returns {Promise<void>}
 */
export const deleteDocument = async (
  collectionName: string,
  id: string,
  transaction?: FirebaseFirestore.Transaction
): Promise<void> => {
  try {
    const docRef: FirebaseFirestore.DocumentReference = db
      .collection(collectionName)
      .doc(id);
    const docSnap: FirebaseFirestore.DocumentSnapshot = await docRef.get();
    if (!docSnap.exists) {
      throw new RepositoryError(
        `Document not found in collection ${collectionName} with id ${id}`,
        "DOCUMENT_NOT_FOUND",
        HTTP_STATUS.NOT_FOUND
      );
    }
    if (transaction) {
      transaction.delete(docRef);
    } else {
      await docRef.delete();
    }
  } catch (error: unknown) {
    if (error instanceof RepositoryError) {
      throw error;
    }
    throw new RepositoryError(
      `Failed to delete document ${id} from ${collectionName}: ${getErrorMessage(
        error
      )}`,
      getErrorCode(error),
      getFirebaseErrorStatusCode(error)
    );
  }
};

/**
 * Deletes documents from a specified collection based on multiple field values.
 * Can operate within a transaction if provided, otherwise performs a batch delete.
 * @param {string} collectionName - The name of the collection to delete from.
 * @param {FieldValuePair[]} fieldValuePairs - An array of field-value pairs to filter on.
 * @param {FirebaseFirestore.Transaction} [transaction] - Optional Firestore transaction object.
 * @returns {Promise<void>}
 */
export const deleteDocumentsByFieldValues = async (
  collectionName: string,
  fieldValuePairs: FieldValuePair[],
  transaction?: FirebaseFirestore.Transaction
): Promise<void> => {
  try {
    let query: FirebaseFirestore.Query = db.collection(collectionName);

    // Apply all field-value filters
    fieldValuePairs.forEach(({ fieldName, fieldValue }) => {
      query = query.where(fieldName, "==", fieldValue);
    });

    let snapshot: FirebaseFirestore.QuerySnapshot;

    if (transaction) {
      snapshot = await transaction.get(query);
      snapshot.docs.forEach((doc) => {
        transaction.delete(doc.ref);
      });
    } else {
      snapshot = await query.get();
      const batch: FirebaseFirestore.WriteBatch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    }
  } catch (error: unknown) {
    const fieldValueString: string = fieldValuePairs
      .map(({ fieldName, fieldValue }) => `${fieldName} == ${fieldValue}`)
      .join(" AND ");
    throw new RepositoryError(
      `Failed to delete documents from ${collectionName} where ${fieldValueString}: ${getErrorMessage(
        error
      )}`,
      getErrorCode(error),
      getFirebaseErrorStatusCode(error)
    );
  }
};
