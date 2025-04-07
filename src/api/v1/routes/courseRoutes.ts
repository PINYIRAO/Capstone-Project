import { Router } from "express";
import * as courseController from "../controllers/courseController";
import * as uploadController from "../controllers/uploadController";
import * as scheduleController from "../controllers/schedule/scheduleController";
import uploadMidFunc from "../middleware/upload";

// define a router for deal with
const router: Router = Router();

/**
 * @route GET /
 * @description Get all courses that qualified with the optional parameters in  query.
 */
/**
 * @openapi
 * /courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Course]
 *     parameters:
 *       - in: query
 *         name: courseCode
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter courses by course code
 *         example: "COMP-3018"
 *       - in: query
 *         name: courseName
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter courses by course name
 *         example: "Back-End Development"
 *     responses:
 *         200:
 *           description: All courses  matching the criteria
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Course'
 *         500:
 *           description: Server error
 */
router.get("/", courseController.getAllCourses);

/**
 * @route POST /
 * @description Create a new course
 */
/**
 * @openapi
 * /courses:
 *  post:
 *   summary: Create a new course
 *   tags: [Course]
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/Course'
 *   responses:
 *    201:
 *     description: the new course
 *    500:
 *     description: Server error
 */
router.post("/", courseController.createCourse);

/**
 * @openapi
 * /courses/upload:
 *   post:
 *     summary: Upload course information via images
 *     tags: [Course]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               courseScreenshots:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: |
 *                   1. Up to 5 course screenshot images
 *                   2. max size for each file is 1MB
 *             required:
 *               - courseScreenshots
 *     responses:
 *       200:
 *         description: Upload successful
 *       400:
 *         description: no course information found
 *       500:
 *         description: Server error/file counts or size exceed the limits
 */
router.post("/upload", uploadMidFunc, uploadController.uploadCourses);

/**
 * @openapi
 * /courses/schedules:
 *   get:
 *     summary: Get course schedules based on user preferences and availability
 *     tags: [Schedule]
 *     description: |
 *       This endpoint allows users to retrieve course schedules based on their preferences for instructors, lecture types, section selections, and availability.
 *       The user can also specify sorting options and filter schedules based on unavailable time slots.
 *     parameters:
 *       - in: query
 *         name: notAvailableTimeSpots
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: array
 *             items:
 *               type: number
 *           description: |
 *             A list of unavailable time slots, each represented as a array of day,startTime, endTime. Format: number, number, number.
 *
 *       - in: query
 *         name: preferenceForInstructor
 *         required: false
 *         schema:
 *           type: object
 *           properties:
 *             goFor:
 *               type: array
 *               items:
 *                 type: string
 *               description: A list of instructor names the user prefers.
 *             notGoFor:
 *               type: array
 *               items:
 *                 type: string
 *               description: A list of instructor names the user does not prefer.
 *           description: Preferences for instructor selection.
 *
 *       - in: query
 *         name: preferenceForLectureType
 *         required: false
 *         schema:
 *           type: object
 *           properties:
 *             lecture:
 *               type: array
 *               items:
 *                 type: string
 *               description: A list of section codes for the "Lecture" type.
 *             online:
 *               type: array
 *               items:
 *                 type: string
 *               description: A list of section codes for the "Online" type.
 *             mixed:
 *               type: array
 *               items:
 *                 type: string
 *               description: A list of section codes for the "Mixed" type.
 *           description: Preferences for lecture type selection.
 *
 *       - in: query
 *         name: preferenceForSection
 *         required: false
 *         schema:
 *           type: object
 *           properties:
 *             goFor:
 *               type: array
 *               items:
 *                 type: string
 *               description: A list of section codes the user prefers.
 *             notGoFor:
 *               type: array
 *               items:
 *                 type: string
 *               description: A list of section codes the user does not prefer.
 *           description: Preferences for section selection.
 *
 *       - in: query
 *         name: electiveSelection
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *           description: A list of elective course codes that the user is interested in selecting.
 *
 *       - in: query
 *         name: sortOptions
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: [dayGoToCampus, dayAttendMorningClass]
 *           description: A list of sorting options to control the ordering of the returned schedules. The order of the fields determines priority.
 *           example: ["dayGoToCampus", "dayAttendMorningClass"]
 *
 *     responses:
 *       200:
 *         description: Successfully retrieved course schedules based on the provided preferences and availability
 *       400:
 *         description: Invalid query parameters provided
 *       500:
 *         description: Internal server error
 */
router.get("/schedules", scheduleController.getAllSchedules);

/**
 * @route GET /:id
 * @description Get an existing course.
 */
/**
 * @openapi
 * /courses/{id}:
 *   get:
 *     summary: Get an existing course
 *     tags: [Course]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the course to be found
 *     responses:
 *       200:
 *         description: The wanted course
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               courses:
 *                 $ref: '#/components/schemas/Course'
 *       404:
 *         description: No branch found with the specified id
 *       500:
 *         description: Server error
 */
router.get("/:id", courseController.getCourseById);

/**
 * @route PUT /:id
 * @description Update an existing course.
 *
 * @openapi
 * /courses/{id}:
 *   put:
 *     summary: Update an existing course
 *     tags: [Course]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the course to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       200:
 *         description: The updated course
 *       404:
 *         description: No course found with the specified id
 *       500:
 *         description: Server error
 */
router.put("/:id", courseController.updateCourse);

/**
 * @route DELETE /:id
 * @description Delete an course profile.
 */
/**
 * @openapi
 * /courses/{id}:
 *   delete:
 *     summary: Delete an existing course
 *     tags: [Course]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the course to be deleted
 *     responses:
 *       200:
 *         description: Delete successfully
 *       404:
 *         description: No course found with the specified id
 *       500:
 *         description: Server error
 */
router.delete("/:id", courseController.deleteCourse);

export default router;
