import Joi, { ObjectSchema } from "joi";

// for validating the course data for creation
export const courseUpdateSchema: ObjectSchema = Joi.object({
  id: Joi.string().optional().messages({
    "string.empty": "Id is optional, but can not be the empty string", // optional, if pass ,there is no effect on functionality
  }),
  program: Joi.string().optional().min(5),
  term: Joi.number().optional().min(1),
  courseCode: Joi.string().optional().min(5),
  courseName: Joi.string().optional().min(5).messages({
    "any.required": "courseName is required",
  }),
  courseType: Joi.string().optional(), // calculated by system according the updated section delivery type
  userId: Joi.string(), // will be overwritten by user from idtoken
  courseSections: Joi.array()
    .min(1)
    .messages({
      "array.min":
        "Course '{{courseCode}} - {{courseName}}' must have at least a section",
      "any.required":
        "Course '{{courseCode}} - {{courseName}}' must have courseSections:Value pair",
    })
    .optional()
    .items(
      Joi.object({
        sectionCode: Joi.string().required().min(5),
        sectionName: Joi.string().required().min(5),
        sectionInstructor: Joi.string().required().min(5),
        sectionDeliveryType: Joi.string()
          .required()
          .valid("Online", "Lecture", "Hybrid"),
        sectionStartDate: Joi.date().optional(), //calculated by system
        sectionEndDate: Joi.date().optional(), //calculated by system
        sectionSeats: Joi.number().required().min(1),
        sectionSchedules: Joi.array()
          .min(1)
          .required()
          .messages({
            "array.min":
              "Section '{{sectionCode}} - {{sectionName}}' must have at least a class schedule",
            "any.required":
              "Section '{{sectionCode}} - {{sectionName}}' must have sectionSchedules:Value pair",
          })
          .items(
            Joi.object({
              day: Joi.number().required().valid(0, 1, 2, 3, 4, 5, 6),
              deliveryType: Joi.string()
                .required()
                .valid("Online", "Lecture", "Hybrid"),
              startTime: Joi.number().min(0).max(24),
              endTime: Joi.number().min(0).max(24),
              location: Joi.string().required().min(5),
            })
          ),
      })
    ),
});
