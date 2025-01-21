import { useEffect, useState } from "react";
import validateData from "./Validations";

const useForm = (modelObject, schemaName) => {
  const [values, setValues] = useState(modelObject);
  const [errors, setErrors] = useState({});
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  useEffect(() => {
    setErrors(validateData(schemaName, values));
  }, [values]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  return {
    handleInputChange,
    values,
    setValues,
    setErrors,
    errors,
    isFormSubmitted,
    setIsFormSubmitted,
  };
};
export default useForm;
