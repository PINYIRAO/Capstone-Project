import { Router } from "express";
import * as courseController from "../controllers/courseController";
import * as uploadController from "../controllers/uploadController";
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

router.post("/upload", uploadMidFunc, uploadController.uploadCourses);

export default router;
