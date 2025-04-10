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
    courseType: Joi.string().required().min(5).messages({
      "any.required": "courseType is required",
    }),
    courseType: "core",
  });

  return schema;
};
