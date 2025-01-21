import Joi from "joi-browser";

const schemas = {
  loginSchema: {
    userName: Joi.string().required().label("User Name"),
    password: Joi.string().required().label("Password"),
  },
  // Add more schemas here
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
  const { error } = Joi.validate(data, validationSchema, {
    abortEarly: false, // Collect all errors, not just the first one
  });
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
