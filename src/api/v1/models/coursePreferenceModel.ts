/**
 * @openapi
 * components:
 *   schemas:
 *     NotAvailableTime:
 *       type: array  # Array type
 *       items:
 *         type: integer  # Each item is an integer
 *       minItems: 3  # Exactly 3 items: [day, start time, end time]
 *       maxItems: 3  # Exactly 3 items
 *       description: |
 *         Represents a time slot where the user is unavailable.
 *         It consists of three integers: the first is the day (e.g., 1 for Monday),
 *         the second is the start time, and the third is the end time.
 *         For example: [1, 9, 12] means the user is unavailable on Monday from 9 AM to 12 PM.
 */
type NotAvailableTime = [number, number, number];
/**
 * @openapi
 * components:
 *   schemas:
 *     NotAvailableTimeSpots:
 *       type: array  # Array type
 *       items:
 *         $ref: '#/components/schemas/NotAvailableTime'  # Reference to NotAvailableTime schema
 *       description: |
 *         A list of unavailable time slots where the user is not available to attend classes.
 *         Each time slot is represented by an array of three integers: [day, start time, end time].
 */
type NotAvailableTimeSpots = NotAvailableTime[];
/**
 * @openapi
 * components:
 *   schemas:
 *     PreferenceForInstructor:
 *       type: object  # Object type
 *       properties:
 *         goFor:
 *           type: array  # Array type
 *           items:
 *             type: string  # Each item is a string (instructor's name)
 *           description: |
 *             A list of instructors the user is willing to attend.
 *         notGoFor:
 *           type: array  # Array type
 *           items:
 *             type: string  # Each item is a string (instructor's name)
 *           description: |
 *             A list of instructors the user does not wish to attend.
 *       description: |
 *         Represents the user's preferences for instructors, including instructors the user
 *         prefers to attend (goFor) and those they wish to avoid (notGoFor).
 */
type PreferenceForInstructor = {
  goFor: string[]; // the instructor's name
  notGoFor: string[]; // the instructor's name
};
/**
 * @openapi
 * components:
 *   schemas:
 *     PreferenceForDeliveryType:
 *       type: object  # Object type
 *       properties:
 *         lecture:
 *           type: array  # Array type
 *           items:
 *             type: string  # Each item is a string (course code for lecture type)
 *           description: |
 *             A list of course codes for lecture type courses.
 *         online:
 *           type: array  # Array type
 *           items:
 *             type: string  # Each item is a string (course code for online type)
 *           description: |
 *             A list of course codes for online courses.
 *         mixed:
 *           type: array  # Array type
 *           items:
 *             type: string  # Each item is a string (course code for mixed type)
 *           description: |
 *             A list of course codes for mixed type courses.
 *       description: |
 *         Represents the user's preferences for different course delivery types.
 *         It includes preferences for lecture-based courses, online courses, and mixed delivery courses.
 */
type PreferenceForDeliveryType = {
  lecture: string[]; // the cousrse code for lecture type
  online: string[]; // the cousrse code for online type
  mixed: string[]; // the course code for mixed type
};
/**
 * @openapi
 * components:
 *   schemas:
 *     PreferenceForSection:
 *       type: object  # Object type
 *       properties:
 *         goFor:
 *           type: array  # Array type
 *           items:
 *             type: string  # Each item is a string (section code)
 *           description: |
 *             A list of section codes the user is willing to attend.
 *         notGoFor:
 *           type: array  # Array type
 *           items:
 *             type: string  # Each item is a string (section code)
 *           description: |
 *             A list of section codes the user does not wish to attend.
 *       description: |
 *         Represents the user's preferences for course sections.
 *         Includes sections the user wants to attend (goFor) and sections they wish to avoid (notGoFor).
 */
type PreferenceForSection = {
  goFor: string[]; // the section's code
  notGoFor: string[]; // the section's code
};
/**
 * @openapi
 * components:
 *   schemas:
 *     ElectiveSelection:
 *       type: array  # Array type
 *       items:
 *         type: string  # Each item is a string (elective course code)
 *       description: |
 *         A list of elective course codes the user has selected.
 */
type ElectiveSelection = string[]; // select which elective courses, including course codes

// sort the schedule

/**
 * @openapi
 * components:
 *   schemas:
 *     SortOption:
 *       type: string  # String type
 *       enum:
 *         - daysGoToCampus      # Sort by the days user needs to go to campus
 *         - daysAttendMorningClass # Sort by user's preference for attending morning classes
 *       description: |
 *         Defines the sorting options for schedule preferences.
 *         'daysGoToCampus' sorts by the days the user needs to go to campus,
 *         'daysAttendMorningClass' sorts by the user's preference for attending morning classes.
 */
type SortOption = "daysGoToCampus" | "daysAttendMorningClass";
/**
 * @openapi
 * components:
 *   schemas:
 *     SortOptions:
 *       type: array  # Array type
 *       items:
 *         $ref: '#/components/schemas/SortOption'  # Reference to the SortOption schema
 *       minItems: 0  # Minimum of 0 sort options (can be empty)
 *       maxItems: 2  # Maximum of 2 sort options (sorted by priority)
 *       description: |
 *         An array of sort options. It can contain 0 to 2 sort options,
 *         where the first one has higher priority.
 *         If multiple sort options are provided, they will be applied in order.
 */
export type SortOptions = [] | [SortOption] | [SortOption, SortOption]; // sort will consider the sort field order, the front one has a higher priority
/**
 * @openapi
 * components:
 *   schemas:
 *     SchedulePreferenceQuery:
 *       type: object  # Object type
 *       properties:
 *         notAvailableTimeSpots:
 *           $ref: '#/components/schemas/NotAvailableTimeSpots'  # List of unavailable time slots
 *           description: |
 *             An array of time slots where the user is unavailable to attend classes.
 *             Each slot includes three elements: day, start time, and end time.
 *
 *         preferenceForInstructor:
 *           $ref: '#/components/schemas/PreferenceForInstructor'  # User's preference for instructors
 *           description: |
 *             User's preference for instructors. It includes a list of instructors
 *             the user is willing to go for (goFor) and a list of instructors
 *             the user prefers not to go for (notGoFor).
 *
 *         preferenceForDeliveryType:
 *           $ref: '#/components/schemas/PreferenceForDeliveryType'  # User's preference for course delivery type
 *           description: |
 *             User's preference for the course delivery type.
 *             Includes course codes for lecture-based courses (lecture),
 *             online courses (online), and mixed delivery courses (mixed).
 *
 *         preferenceForSection:
 *           $ref: '#/components/schemas/PreferenceForSection'  # User's preference for course sections
 *           description: |
 *             User's preference for course sections.
 *             Includes section codes the user is willing to attend (goFor)
 *             and section codes the user prefers not to attend (notGoFor).
 *
 *         electiveSelection:
 *           $ref: '#/components/schemas/ElectiveSelection'  # User's elective course selection
 *           description: |
 *             A list of elective course codes the user has selected.
 *
 *         sortOptions:
 *           $ref: '#/components/schemas/SortOptions'  # Sorting preferences for the schedule
 *           description: |
 *             The sort options for the schedule query.
 *             The user can provide 0 to 2 sort options, with the first option having higher priority.
 *       required: []  # This object does not have required properties
 *       additionalProperties: false  # No additional properties are allowed
 */
export type SchedulePreferenceQuery = {
  notAvailableTimeSpots?: NotAvailableTimeSpots;
  preferenceForInstructor?: PreferenceForInstructor;
  preferenceForDeliveryType?: PreferenceForDeliveryType;
  preferenceForSection?: PreferenceForSection;
  electiveSelection?: ElectiveSelection;
  sortOptions?: SortOptions;
};
