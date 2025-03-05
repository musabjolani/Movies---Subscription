import useForm from "../hooks/useForm";
import { Box, TextField, Typography, Button, Alert } from "@mui/material";
import { getAll, updateById } from "../Utils/dbUtilsForSubscriptionsService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";

const UpdateMember = () => {
  const { memberId } = useParams();

  let navigate = useNavigate();
  const initForm = {
    name: "",
    city: "",
    email: "",
  };

  const {
    handleInputChange,
    values,
    setValues,
    setErrors,
    errors,
    isFormSubmitted,
    setIsFormSubmitted,
    resetForm,
  } = useForm(initForm, "memeberSchema");

  const labelWidth = "90px";

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const getMember = async () => {
      const { data: member } = await getAll(`/members/${memberId}`);
      setValues(member);
    };
    getMember();
  }, []);

  const updateMovie = async (e) => {
    try {
      e.preventDefault();
      setIsFormSubmitted(true);
      setSuccessMessage("");
      setErrorMessage("");
      if (errors && Object.keys(errors).length > 0) {
        setErrorMessage("Check your error Please");
        return;
      }
      await updateById(`/members/${memberId}`, values);
      // resetForm();
      setSuccessMessage("The Memmber Updated Successfully ");
    } catch (error) {
      setErrorMessage(
        error.response ? error.response.data.message : error.message
      );
    }
  };

  return (
    <>
      <form onSubmit={(e) => submitMovie(e)}>
        <Box sx={{ dispaly: "on", my: 2 }}>
          <Typography variant="h5" component="h2">
            {`Edit Mmeber : ${values.name}`}
          </Typography>
        </Box>
        <Box sx={{ mb: 0.5 }}>
          <label className="label" style={{ width: labelWidth }}>
            Name
          </label>
          <TextField
            sx={{ width: "300px" }}
            name="name"
            value={values.name}
            variant="outlined"
            size="small"
            onChange={(e) => handleInputChange(e)}
            {...(isFormSubmitted &&
              errors.name && {
                error: true,
                helperText: errors.name,
              })}
          />
        </Box>
        <br />
        <Box sx={{ mb: 0.5 }}>
          <label className="label" style={{ width: labelWidth }}>
            Email
          </label>
          <TextField
            sx={{ width: "300px" }}
            name="email"
            value={values.email}
            variant="outlined"
            size="small"
            placeholder="Genres separated by commas "
            onChange={(e) => handleInputChange(e)}
            {...(isFormSubmitted &&
              errors.email && {
                error: true,
                helperText: errors.email,
              })}
          />
        </Box>
        <br />
        <Box sx={{ mb: 0.5 }}>
          <label className="label" style={{ width: labelWidth }}>
            City
          </label>
          <TextField
            sx={{ width: "300px" }}
            name="city"
            value={values.city}
            variant="outlined"
            size="small"
            onChange={(e) => handleInputChange(e)}
            {...(isFormSubmitted &&
              errors.city && {
                error: true,
                helperText: errors.city,
              })}
          />
        </Box>
        <br />

        <br />

        {errorMessage && errorMessage != "" && (
          <Alert severity="error">{errorMessage}</Alert>
        )}
        {successMessage && successMessage != "" && (
          <Alert severity="success">{successMessage}</Alert>
        )}
        <Box sx={{ display: "inline-block", mt: 2 }}>
          <Button
            variant="contained"
            size="large"
            type="submit"
            sx={{
              width: "80px",
              mr: 1,
            }}
            onClick={(e) => updateMovie(e)}
          >
            Update
          </Button>
          <Button
            variant="contained"
            size="large"
            sx={{
              width: "80px",
            }}
            onClick={() => navigate(`/subscriptions/allmembers`)}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </>
  );
};

export default UpdateMember;
