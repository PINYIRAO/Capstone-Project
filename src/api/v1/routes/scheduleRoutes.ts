import { Router } from "express";
import * as scheduleController from "../controllers/schedule/scheduleController";

// define a router for deal with
const router: Router = Router();

/**
 * @openapi
 * /schedules:
 *   post:
 *     summary: Get course schedules based on user preferences and availability
 *     tags: [Schedule]
 *     description: |
 *       This endpoint allows users to retrieve course schedules based on their preferences for instructors, lecture types, section selections, and availability.
 *       The user can also specify sorting options and filter schedules based on unavailable time slots.
 *     requestBody:
 *       description: A JSON object containing the user's preferences and query parameters for course schedules.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notAvailableTimeSpots:
 *                 type: array
 *                 items:
 *                   type: array
 *                   items:
 *                     type: number
 *                 description: |
 *                   A list of unavailable time slots, each represented as a tuple of [startTime, endTime, day]. Format: [number, number, number].
 *                 example: |
 *                   [[1, 8, 10], [2, 20, 22]]
 *               preferenceForInstructor:
 *                 type: object
 *                 properties:
 *                   goFor:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: A list of instructor names the user prefers.
 *                     example: |
 *                       ["Tim, D"]
 *                   notGoFor:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: A list of instructor names the user does not prefer.
 *                     example: |
 *                       ["Smith, J"]
 *                 description: Preferences for instructor selection.
 *               preferenceForLectureType:
 *                 type: object
 *                 properties:
 *                   lecture:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: A list of section codes for the "Lecture" type.
 *                     example: ["L01"]
 *                   online:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: A list of section codes for the "Online" type.
 *                     example: ["O01"]
 *                   mixed:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: A list of section codes for the "Mixed" type.
 *                     example: ["M01"]
 *                 description: Preferences for lecture type selection.
 *               preferenceForSection:
 *                 type: object
 *                 properties:
 *                   goFor:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: A list of section codes the user prefers.
 *                     example: ["S01"]
 *                   notGoFor:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: A list of section codes the user does not prefer.
 *                     example: ["S02"]
 *                 description: Preferences for section selection.
 *               electiveSelection:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: A list of elective course codes that the user is interested in selecting.
 *                 example: ["CS101", "BIO202"]
 *               sortOptions:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [daysGoToCampus, daysAttendMorningClass]
 *                 description: A list of sorting options to control the ordering of the returned schedules. The order of the fields determines priority.
 *                 example: ["daysGoToCampus", "daysAttendMorningClass"]
 *     responses:
 *       '200':
 *         description: Successfully retrieved course schedules based on the provided preferences and availability
 *       '400':
 *         description: Invalid query parameters provided
 *       '500':
 *         description: Internal server error
 */
router.post("/", scheduleController.getAllSchedules);

export default router;
