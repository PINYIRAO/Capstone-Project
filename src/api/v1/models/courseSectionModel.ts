/**
 * @openapi
 * components:
 *   schemas:
 *     DeliveryType:
 *       type: string
 *       description: The delivery method of the class
 *       enum:
 *         - Lecture
 *         - Online
 *         - Mixed
 *       example: "Lecture"
 */
export type DeliveryType = "Lecture" | "Online" | "Mixed";

/**
 * @openapi
 * components:
 *   schemas:
 *     Class:
 *       type: object
 *       required:
 *         - day
 *         - lectureType
 *         - startTime
 *         - endTime
 *         - location
 *       properties:
 *         day:
 *           type: integer
 *           description: Day of the week (0 = Sunday, 6 = Saturday)
 *           example: 1
 *         lectureType:
 *           $ref: '#/components/schemas/DeliveryType'
 *         startTime:
 *           type: integer
 *           description: Start time in 24-hour format (e.g., 9 for 9:00 AM)
 *           example: 9
 *         endTime:
 *           type: integer
 *           description: End time in 24-hour format (e.g., 11 for 11:00 AM)
 *           example: 11
 *         location:
 *           type: string
 *           description: Location of the class
 *           example: "Room 204, Science Building"
 */
export type Class = {
  day: number;
  lectureType: DeliveryType;
  startTime: number;
  endTime: number;
  location: string;
};

/**
 * @openapi
 * components:
 *   schemas:
 *     Section:
 *       type: object
 *       required:
 *         - sectionCode
 *         - sectionName
 *         - sectionInstructor
 *         - sectionLectureType
 *         - sectionStartDate
 *         - sectionEndDate
 *         - sectionSeats
 *         - sectionSchedules
 *       properties:
 *         sectionCode:
 *           type: string
 *           description: Unique code identifying the section
 *           example: "SEC-01"
 *         sectionName:
 *           type: string
 *           description: Name of the section
 *           example: "Back-End Dev - A"
 *         sectionInstructor:
 *           type: string
 *           description: Name of the instructor for the section
 *           example: "Prof. Alice Johnson"
 *         sectionLectureType:
 *           $ref: '#/components/schemas/DeliveryType'
 *         sectionStartDate:
 *           type: string
 *           format: date
 *           description: Section start date
 *           example: "2025-01-15"
 *         sectionEndDate:
 *           type: string
 *           format: date
 *           description: Section end date
 *           example: "2025-05-01"
 *         sectionSeats:
 *           type: integer
 *           description: Number of available seats in the section
 *           example: 40
 *         sectionSchedules:
 *           type: array
 *           description: List of scheduled classes for the section
 *           items:
 *             $ref: '#/components/schemas/Class'
 */
export type Section = {
  sectionCode: string;
  sectionName: string;
  sectionInstructor: string;
  sectionLectureType: DeliveryType;
  sectionStartDate: Date;
  sectionEndDate: Date;
  sectionSeats: number;
  sectionSchedules: Class[];
};
