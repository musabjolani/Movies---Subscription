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
import { getAll, postData, updateById } from "../Utils/dbUtils";
import { useEffect, useState } from "react";
import hasAllPermissions from "../Utils/permissionUtils";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router";

const UpdateUser = () => {
  const { userId } = useParams();
  let navigate = useNavigate();

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
    errors,
    isFormSubmitted,
    setIsFormSubmitted,
  } = useForm(initForm, "addUserSchema");

  const labelWidth = "200px";

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data: user } = await getAll(`/users/${userId}`);
        const { data: userDb } = await getAll(`/userDB/${userId}`);
        const { data: userPermissions } = await getAll(
          `/permissions/${userId}`
        );

        setValues({
          ...user?.[0], // Ensure user data exists
          userName: userDb?.userName || "", // Avoid undefined
          permissions: userPermissions?.[0]?.permissions || [], // Default empty array
        });
      } catch (error) {
        setErrorMessage(
          error.response ? error.response.data.message : error.message
        );
      }
    };

    getUserData();
  }, []);

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
  const selectedSubscriptions = hasAllPermissions(
    values && values.permissions ? values.permissions : [],
    ["Create Subscriptions", "Delete Subscriptions", "Update Subscriptions"]
  );

  useEffect(() => {
    if (
      selectedSubscriptions &&
      !values.permissions.includes("View Subscriptions")
    ) {
      setValues((prevValues) => ({
        ...prevValues,
        permissions: [...values.permissions, "View Subscriptions"],
      }));
    }
  }, [selectedSubscriptions]);

  const selectedMovies = hasAllPermissions(
    values && values.permissions ? values.permissions : [],
    ["Create Movies", "Delete Movies", "Update Movies"]
  );

  useEffect(() => {
    if (selectedMovies && !values.permissions.includes("View Movies")) {
      setValues((prevValues) => ({
        ...prevValues,
        permissions: [...values.permissions, "View Movies"],
      }));
    }
  }, [selectedMovies]);

  const submitUser = async (e) => {
    try {
      e.preventDefault();
      setIsFormSubmitted(true);
      setSuccessMessage("");
      setErrorMessage("");

      if (errors && Object.keys(errors).length > 0) {
        setErrorMessage("Check your errors, please.");
        return;
      }

      // Prepare user update payload
      const userPayload = {
        id: values.id,
        firstName: values.firstName,
        lastName: values.lastName,
        createdDate: values.createdDate,
        sessionTimeOut: values.sessionTimeOut,
      };

      // Prepare userDB payload
      const userDBPayload = {
        userId: values.id,
        userName: values.userName,
      };

      // Prepare permissions payload
      const permissionsPayload = {
        id: values.id,
        permissions: values.permissions || [],
      };

      // Perform updates in parallel
      await Promise.all([
        updateById(`/users/${userId}`, userPayload),
        updateById(`/userDB/${userId}`, userDBPayload).catch(async () =>
          postData(`/userDB`, userDBPayload)
        ),
        updateById(`/permissions/${userId}`, permissionsPayload).catch(
          async () => postData(`/permissions`, permissionsPayload)
        ),
      ]);

      // setSuccessMessage("The User Updated Successfully");
      navigate(`/usersmanagement/allusers`);
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
      {values && (
        <form onSubmit={(e) => submitUser(e)}>
          <Box sx={{ my: 2 }}>
            <Typography variant="h4">Users</Typography>
          </Box>
          <Box sx={{ display: "inline-flex", my: 2 }}>
            <Typography variant="h5">{`Edit User:`}</Typography>
            <Typography variant="h5" sx={{ ml: 1 }}>
              {` ${values.firstName} ${values.lastName} `}
            </Typography>
          </Box>
          <Box sx={{ mb: 0.5 }}>
            <label className="label" style={{ width: labelWidth }}>
              First Name
            </label>
            <TextField
              name="firstName"
              value={values.firstName || ""}
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
              value={values.lastName || ""}
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
              value={values.userName || ""}
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
              value={values.createdDate || ""}
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
                checked={
                  values.permissions && values.permissions.includes(permission)
                }
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
              Update
            </Button>
            <Button
              variant="contained"
              size="large"
              sx={{
                width: "80px",
              }}
              onClick={() => navigate(`/usersmanagement/allusers`)}
            >
              Cancel
            </Button>
          </Box>
        </form>
      )}
    </>
  );
};

export default UpdateUser;
