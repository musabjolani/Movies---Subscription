import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import useForm from "../hooks/useForm";
import {
  getAll,
  getLoggedUserDetails,
  postData,
} from "../Utils/dbUtilsForCinemaService";
import { useNavigate } from "react-router";

const Register = () => {
  let navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    handleInputChange,
    setValues,
    values,
    setErrors,
    errors,
    isFormSubmitted,
    setIsFormSubmitted,
  } = useForm(
    {
      userName: "",
      password: "",
    },
    "loginSchema"
  );

  useEffect(() => {
    // const getUser = async () => {
    //   try {
    //     const { data } = await getLoggedUserDetails();
    //     setValues({ ...values, userName: data?.user?.userName });
    //     setIsAdmin(data?.user?.isAdmin);
    //   } catch (error) {}
    // };
    //  getUser();
  }, []);

  const registerUser = async (e) => {
    try {
      e.preventDefault();
      setIsFormSubmitted(true);
      setErrorMessage("");
      setSuccessMessage("");
      if (errors && Object.keys(errors).length > 0) {
        return;
      }
      await postData(`/userDB/register`, values);
      setErrorMessage("");
      setSuccessMessage("The password reset Successfully ");
    } catch (error) {
      setErrorMessage(
        error.response ? error.response.data.message : error.message
      );
    }
  };

  return (
    <>
      <form onSubmit={(e) => registerUser(e)}>
        <Box>
          <Typography variant="h4">Movie - Subscriptions Web Site</Typography>
          <br />
          <Typography width="30%" variant="h5">
            Create User:
          </Typography>
          <Typography width="30%" variant="h5"></Typography>
        </Box>
        <Card sx={{ width: "400px" }}>
          <CardContent>
            <Box
              sx={{
                "& .MuiTextField-root": {
                  m: 1,
                  width: "90%",
                },
              }}
            >
              <TextField
                name="userName"
                value={values.userName}
                label="User Name"
                variant="outlined"
                onChange={(e) => handleInputChange(e)}
                {...(isFormSubmitted &&
                  errors.userName && {
                    error: true,
                    helperText: errors.userName,
                  })}
              />
              <TextField
                name="password"
                value={values.password}
                type="password"
                label="Password"
                variant="outlined"
                onChange={(e) => handleInputChange(e)}
                {...(isFormSubmitted &&
                  errors.password && {
                    error: true,
                    helperText: errors.password,
                  })}
              />

              {errorMessage && errorMessage != "" && (
                <Alert severity="error">{errorMessage}</Alert>
              )}
              {successMessage && successMessage != "" && (
                <Alert severity="success">{successMessage}</Alert>
              )}
              <Button
                variant="contained"
                size="large"
                type="submit"
                sx={{
                  width: "90%",
                }}
              >
                Create Account
              </Button>
            </Box>
          </CardContent>
        </Card>
      </form>
    </>
  );
};

export default Register;
