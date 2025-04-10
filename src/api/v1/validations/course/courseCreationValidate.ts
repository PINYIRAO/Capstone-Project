import Joi, { ObjectSchema } from "joi";

// for validating the course data for creation
export const courseCreationSchema = (): ObjectSchema => {
  const schema: ObjectSchema = Joi.object({
    id: Joi.string().optional().messages({
      "string.empty": "Id is optional, but can not be the empty string",
    }),
    program: Joi.string().required().min(5).messages({
      "any.required": "Program is required",
    }),
    term: Joi.number().required().min(1),
    courseCode: Joi.string().required().min(5).messages({
      "any.required": "courseCode is required",
    }),
    courseName: Joi.string().required().min(5).messages({
      "any.required": "courseName is required",
    }),
    courseType: Joi.string().optional(), // calculated by system according the updated section delivery type
    courseSections: Joi.array()
      .required()
      .items(
        Joi.object({
          sectionCode: Joi.string().required().min(5),
          sectionName: Joi.string().required().min(5),
          sectionInstructor: Joi.string().required().min(5),
          sectionDeliveryType: Joi.string()
            .required()
            .validate(["Online", "Lecture", "Hybrid"]),
          sectionStartDate: Joi.date().optional(), //calculated by system
          sectionEndDate: Joi.date().optional(), //calculated by system
          sectionSeats: Joi.number().required().min(1),
          sectionSchedules: Joi.array().items(
            Joi.object({
              day: Joi.number().required().validate([0, 1, 2, 3, 4, 5, 6]),
              deliveryType: Joi.string()
                .required()
                .validate(["Online", "Lecture", "Hybrid"]),
              startTime: Joi.number().min(0).max(24),
              endTime: Joi.number().min(0).max(24),
              location: Joi.string().required().min(5),
            })
          ),
        })
      ),
  });

  return schema;
};
