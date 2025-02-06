import useForm from "../hooks/useForm";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
  Button,
  Alert,
} from "@mui/material";
import { postData } from "../Utils/dbUtils";
import CINEMA_SERVICE_URL from "../Config/config";
import { useEffect, useState } from "react";
import hasAllPermissions from "../Utils/permissionUtils";

const AddUser = () => {
  const initForm = {
    firstName: "",
    lastName: "",
    userName: "",
    createdDate: "",
    permissions: [],
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
  } = useForm(initForm, "addUserSchema");

  const labelWidth = "200px";

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const permissions = [
    "View Subscriptions",
    "Create Subscriptions",
    "Delete Subscriptions",
    "Update Subscriptions",
    "View Movies",
    "Create Movies",
    "Delete Movies",
    "Update Movies",
  ];

  const selectedSubscriptions = hasAllPermissions(values.permissions, [
    "Create Subscriptions",
    "Delete Subscriptions",
    "Update Subscriptions",
  ]);

  useEffect(() => {
    if (
      selectedSubscriptions &&
      !values.permissions.includes("View Subscriptions")
    ) {
      setValues({
        ...values,
        permissions: [...values.permissions, "View Subscriptions"],
      });
    }
  }, [selectedSubscriptions]);

  const selectedMovies = hasAllPermissions(values.permissions, [
    "Create Movies",
    "Delete Movies",
    "Update Movies",
  ]);

  useEffect(() => {
    if (selectedMovies && !values.permissions.includes("View Movies")) {
      setValues({
        ...values,
        permissions: [...values.permissions, "View Movies"],
      });
    }
  }, [selectedMovies]);

  const submitUser = async (e) => {
    try {
      e.preventDefault();
      setIsFormSubmitted(true);
      setSuccessMessage("");
      setErrorMessage("");
      if (errors && Object.keys(errors).length > 0) {
        setErrorMessage("Check your error Please");
        return;
      }

      const { data: userAdded } = await postData(
        `${CINEMA_SERVICE_URL}/users`,
        {
          firstName: values.firstName,
          lastName: values.lastName,
          createdDate: values.createdDate,
          sessionTimeOut: values.sessionTimeOut,
        }
      );
      await postData(`${CINEMA_SERVICE_URL}/userDB`, {
        userId: userAdded.id,
        userName: values.userName,
      });
      await postData(`${CINEMA_SERVICE_URL}/permissions`, {
        id: userAdded.id,
        permissions: values.permissions,
      });

      resetForm();
      setSuccessMessage("The User Added Successfully ");
    } catch (error) {
      setErrorMessage(
        error.response ? error.response.data.message : error.message
      );
    }
  };

  const handlePermissions = (e) => {
    const { checked, value } = e.target;
    const updatedPermissions = checked
      ? [...values.permissions, value]
      : values.permissions.filter((permission) => permission !== value);

    setValues({ ...values, permissions: updatedPermissions });
  };

  return (
    <>
      <form onSubmit={(e) => submitUser(e)}>
        <Box sx={{ dispaly: "on", my: 2 }}>
          <Typography variant="h5" component="h2">
            Add New User
          </Typography>
        </Box>
        <Box sx={{ mb: 0.5 }}>
          <label className="label" style={{ width: labelWidth }}>
            First Name
          </label>
          <TextField
            name="firstName"
            value={values.firstName}
            variant="outlined"
            size="small"
            onChange={(e) => handleInputChange(e)}
            {...(isFormSubmitted &&
              errors.firstName && {
                error: true,
                helperText: errors.firstName,
              })}
          />
        </Box>
        <br />
        <Box sx={{ mb: 0.5 }}>
          <label className="label" style={{ width: labelWidth }}>
            Last Name
          </label>
          <TextField
            name="lastName"
            value={values.lastName}
            variant="outlined"
            size="small"
            onChange={(e) => handleInputChange(e)}
            {...(isFormSubmitted &&
              errors.lastName && {
                error: true,
                helperText: errors.lastName,
              })}
          />
        </Box>
        <br />
        <Box sx={{ mb: 0.5 }}>
          <label className="label" style={{ width: labelWidth }}>
            User Name
          </label>
          <TextField
            name="userName"
            value={values.userName}
            variant="outlined"
            size="small"
            onChange={(e) => handleInputChange(e)}
            {...(isFormSubmitted &&
              errors.userName && {
                error: true,
                helperText: errors.userName,
              })}
          />
        </Box>
        <br />
        <Box sx={{ mb: 0.5 }}>
          <label className="label" style={{ width: labelWidth }}>
            Session Time Out (Minutes){" "}
          </label>
          <TextField
            name="sessionTimeOut"
            value={values.sessionTimeOut || 0}
            variant="outlined"
            size="small"
            type="number"
            onChange={(e) => handleInputChange(e)}
            {...(isFormSubmitted &&
              errors.sessionTimeOut && {
                error: true,
                helperText: errors.sessionTimeOut,
              })}
          />
        </Box>
        <br />

        <Box sx={{ mb: 0.5 }}>
          <label className="label" style={{ width: labelWidth }}>
            Created Date
          </label>

          <TextField
            name="createdDate"
            value={values.createdDate}
            variant="outlined"
            size="small"
            placeholder="DD/MM/YYYY"
            onChange={(e) => handleInputChange(e)}
            {...(isFormSubmitted &&
              errors.createdDate && {
                error: true,
                helperText: errors.createdDate,
              })}
          />
        </Box>
        <br />

        <Typography variant="h5">Permissons:</Typography>
        <br />
        <FormGroup>
          {permissions.map((permission) => (
            <FormControlLabel
              key={permission}
              control={<Checkbox />}
              label={permission}
              checked={values.permissions.includes(permission)}
              value={permission}
              onChange={(e) => handlePermissions(e)}
            />
          ))}
        </FormGroup>
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
          >
            Save
          </Button>
          <Button
            variant="contained"
            size="large"
            sx={{
              width: "80px",
            }}
            onClick={() => {}}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </>
  );
};

export default AddUser;
