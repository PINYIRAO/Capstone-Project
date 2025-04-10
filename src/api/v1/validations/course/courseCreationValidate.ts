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
        })
      ),
  });

  return schema;
};
