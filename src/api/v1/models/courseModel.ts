import { Section } from "./courseSectionModel";

type CourseType = "Required" | "Elective";

/**
 * @openapi
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       required:
 *         - id
 *         - program
 *         - term
 *         - courseCode
 *         - courseName
 *         - courseType
 *         - userId
 *         - courseSections
 *       properties:
 *         id:
 *           type: string
 *           description: Firestore document ID
 *           example: "abc123"
 *         program:
 *           type: string
 *           description: Program to which the course belongs
 *           example: "Computer Science"
 *         term:
 *           type: integer
 *           description: Academic term number
 *           example: 2
 *         courseCode:
 *           type: string
 *           description: Unique course code
 *           example: "COMP-3018"
 *         courseName:
 *           type: string
 *           description: Name of the course
 *           example: "Back-End Development"
 *         courseType:
 *           type: string
 *           description: Type of the course (e.g. core, elective)
 *           enum: [core, elective]
 *           example: "core"
 *         userId:
 *           type: string
 *           description: ID of the user (student or admin) who uploaded this course
 *           example: "user_456"
 *         courseSections:
 *           type: array
 *           description: List of course sections
 *           items:
 *             $ref: '#/components/schemas/Section'
 */

export type Course = {
  id: string; // firestore's id string
  program: string;
  term: number;
  courseCode: string;
  courseName: string;
  courseType: CourseType;
  userId: string; // indicate the course information is uploaded by specific student or the overall information set by admin
  courseSections: Section[];
};
