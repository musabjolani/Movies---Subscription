import { useState } from "react";
import TextField from "@mui/material/TextField";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import useForm from "../hooks/useForm";
import { postData } from "../Utils/dbUtils";
import CINEMA_SERVICE_URL from "../Config/config";

const Register = () => {
  const [severity, setSeverity] = useState("");

  const {
    handleInputChange,
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

  const registerUser = async (e) => {
    try {
      e.preventDefault();
      setIsFormSubmitted(true);
      if (errors && Object.keys(errors).length > 0) {
        return;
      }
      await postData(`${CINEMA_SERVICE_URL}/userDB/register`, values);
      setSeverity("success");
      setErrors({ ...errors, Message: "" });
    } catch (error) {
      setSeverity("error");
      setErrors({
        ...errors,
        Message: error.response ? error.response.data.message : error.message,
      });
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

              {errors.Message && (
                <Alert severity={severity}>{errors.Message}</Alert>
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
