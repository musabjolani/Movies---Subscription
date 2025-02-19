import Joi from "joi";

const schemas = {
  loginSchema: Joi.object({
    userName: Joi.string().required().label("User Name"),
    password: Joi.string().required().label("Password"),
  }),

  addUserSchema: Joi.object({
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    userName: Joi.string().required().label("User Name"),
    sessionTimeOut: Joi.number().positive().label("Session Time Out"),
    createdDate: Joi.string()
      .pattern(/^([1-9]|0[1-9]|[12][0-9]|3[01])\/([1-9]|0[1-9]|1[0-2])\/\d{4}$/) // Ensuring DD_MM-YYYY format
      .required()
      .label("Created Date")
      .messages({
        "string.pattern.base": "Created Date must be in DD/MM/YYYY format",
      }),
    permissions: Joi.any(),
    id: Joi.any(),
  }),

  addMovieSchema: Joi.object({
    name: Joi.string().required().label("Name"),
    genresString: Joi.any(),
    image: Joi.any(),
    premiered: Joi.string()
      .allow("")
      .pattern(/^([1-9]|0[1-9]|[12][0-9]|3[01])\/([1-9]|0[1-9]|1[0-2])\/\d{4}$/) // Ensuring DD_MM-YYYY format
      .label("Premiered Date")
      .messages({
        "string.pattern.base": "Premiered Date must be in DD/MM/YYYY format",
      }),
    genres: Joi.any(),
    _id: Joi.any(),
  }),
};

const validateData = (schemaName, data) => {
  // Check if the schema exists
  if (!schemas[schemaName]) {
    throw new Error(`Unknown schema: ${schemaName}`);
  }

  // Ensure data is an object
  if (typeof data !== "object" || data === null) {
    throw new Error("Data must be an object");
  }

  // Get the validation schema
  const validationSchema = schemas[schemaName];

  // Validate the data
  const { error } = validationSchema.validate(data, { abortEarly: false });
  let errors = {};
  // If there are errors, return them in a structured format
  if (error) {
    error.details.map(
      (detail) => (errors[detail.context.key] = detail.message)
    );
    return errors;
  }
  // If no errors, return an empty array
  return {};
};

export default validateData;
