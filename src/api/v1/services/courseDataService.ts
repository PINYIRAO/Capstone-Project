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
  uid: string,
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
    if (uid) {
      resultCourses = resultCourses.filter((course) => course.userId === uid);
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
export const getCourseById = async (
  uid: string,
  id: string
): Promise<Course> => {
  try {
    const snapshot: FirebaseFirestore.DocumentSnapshot | null =
      await firestoreRepository.getDocumentById(COLLECTION, id);
    if (snapshot && snapshot.exists) {
      const data: FirebaseFirestore.DocumentData = snapshot.data() || {};
      if (data.userId === uid) {
        return { id: snapshot.id, ...data } as Course;
      }
    }
    throw new Error(`Id: ${id} couldnot be found`);
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
  uid: string,
  course: Partial<Course>
): Promise<Course> => {
  try {
    const newCourse: Partial<Course> = { ...course, userId: uid };
    const id: string = await firestoreRepository.createDocument(
      COLLECTION,
      newCourse
    );
    return { id, ...newCourse } as Course;
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
  uid: string,
  targetId: string,
  course: Partial<Course>
): Promise<Course> => {
  try {
    let data: FirebaseFirestore.DocumentData | null;
    const newCourse: Partial<Course> = { ...course, userId: uid };
    await firestoreRepository.updateDocument(COLLECTION, targetId, newCourse);
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
export const deleteCourse = async (uid: string, id: string): Promise<void> => {
  try {
    const course: Course = await getCourseById(uid, id);
    if (course && Object.keys(course).length !== 0) {
      await firestoreRepository.deleteDocument(COLLECTION, id);
    }
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
