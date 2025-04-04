import { Course } from "../models/courseModel";
import * as firestoreRepository from "../repositories/firestoreRepository";
import { RepositoryError, ServiceError } from "../errors/errors";
import { getErrorCode, getErrorMessage } from "../utils/errorUtils";

const COLLECTION: string = "courses";

/**
 * @description Get all courses that qualified with the optional parameters in query， set the function async temporarily.
 * @returns a Promise that resolves to an array of `Course` objects.
 */
export const getAllCourses = async (
  courseCode: string | undefined,
  courseName: string | undefined
): Promise<Course[]> => {
  try {
    // filter the courses using the query parameter

    const snapshot: FirebaseFirestore.QuerySnapshot =
      await firestoreRepository.getDocuments(COLLECTION);
    let resultCourses: Course[] = snapshot.docs.map((doc) => {
      const data: FirebaseFirestore.DocumentData = doc.data();
      return { id: doc.id, ...data } as Course;
    });

    if (courseCode) {
      resultCourses = resultCourses.filter((course) => {
        return course.courseCode
          .toUpperCase()
          .includes(courseCode.toUpperCase());
      });
    }
    if (courseName) {
      resultCourses = resultCourses.filter((course) =>
        course.courseName.toUpperCase().includes(courseName.toUpperCase())
      );
    }
    return resultCourses;
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
 * @description get an course by course id.
 * @param {string} id - The ID of the course.
 * @returns {Promise<Course|null>}
 * @throws {Error} If the Course with the given ID is not found.
 */
export const getCourseById = async (id: string): Promise<Course> => {
  try {
    const snapshot: FirebaseFirestore.DocumentSnapshot | null =
      await firestoreRepository.getDocumentById(COLLECTION, id);
    if (snapshot && snapshot.exists) {
      const data: FirebaseFirestore.DocumentData = snapshot.data() || {};
      return { id: snapshot.id, ...data } as Course;
    } else {
      throw new Error(`Id: ${id} couldnot be found`);
    }
  } catch (error: unknown) {
    if (error instanceof RepositoryError) {
      throw error;
    } else {
      throw new ServiceError(
        `Failed to get document by id in ${COLLECTION}, ${getErrorMessage(
          error
        )}`,
        getErrorCode(error)
      );
    }
  }
};

/**
 * @description create an Course.
 * @param {Partial<Course>}
 * course - the Course data
 * @returns {Promise<Course>} A promise that resolves to the created Course
 */
export const createCourse = async (
  course: Partial<Course>
): Promise<Course> => {
  try {
    const id: string = await firestoreRepository.createDocument(
      COLLECTION,
      course
    );
    return { id, ...course } as Course;
  } catch (error: unknown) {
    if (error instanceof RepositoryError) {
      throw error;
    } else {
      throw new ServiceError(
        `Failed to create document in ${COLLECTION} with data: ${course}, ${getErrorMessage(
          error
        )}`,
        getErrorCode(error)
      );
    }
  }
};

/**
 * @description Update an existing course.
 * @param {string} targetId - The ID of the course to update.
 * @param {Partial<Course>}
 * course - the course data
 * @returns {Promise<Course>}
 * @throws {Error} If the course with the given ID is not found.
 */
export const updateCourse = async (
  targetId: string,
  course: Partial<Course>
): Promise<Course> => {
  try {
    let data: FirebaseFirestore.DocumentData | null;
    await firestoreRepository.updateDocument(COLLECTION, targetId, course);
    const snapshot: FirebaseFirestore.DocumentSnapshot | null =
      await firestoreRepository.getDocumentById(COLLECTION, targetId);
    if (snapshot && snapshot.exists) {
      data = snapshot.data() || {};
    } else {
      data = null;
    }
    return { id: targetId, ...data } as Course;
  } catch (error: unknown) {
    if (error instanceof RepositoryError) {
      throw error;
    } else {
      throw new ServiceError(
        `Failed to update document with id: ${targetId} in ${COLLECTION} with data: ${course}, ${getErrorMessage(
          error
        )}`,
        getErrorCode(error)
      );
    }
  }
};

/**
 * @description Delete an course.
 * @param {string} id - The ID of the course to delete.
 * @returns {Promise<void>}
 * @throws {Error} If the course with the given ID is not found.
 */
export const deleteCourse = async (id: string): Promise<void> => {
  try {
    await firestoreRepository.deleteDocument(COLLECTION, id);
  } catch (error: unknown) {
    if (error instanceof RepositoryError) {
      throw error;
    } else {
      throw new ServiceError(
        `Failed to delete document with id: ${id} in ${COLLECTION}, ${getErrorMessage(
          error
        )}`,
        getErrorCode(error)
      );
    }
  }
};
