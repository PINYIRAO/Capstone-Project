import { Course } from "./courseModel";
import { SortOptions } from "./coursePreferenceModel";
/**
 * @openapi
 * components:
 *   schemas:
 *     SortedSchedule:
 *       type: object
 *       properties:
 *         baseInfo:
 *           type: object
 *           properties:
 *             count:
 *               type: integer
 *               example: 5
 *             sortOptions:
 *               $ref: '#/components/schemas/SortOption'
 *             daysGoToCampus:
 *               type: integer
 *               example: 3
 *             daysAttendMorningClass:
 *               type: integer
 *               example: 2
 *         schedule:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Course'
 */
export type SortedSchedule = {
  baseInfo: {
    count: number;
    sortOptions?: SortOptions;
    daysGoToCampus?: number;
    daysAttendMorningClass?: number;
  };
  schedule: Course[];
};
