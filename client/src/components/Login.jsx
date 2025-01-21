import * as React from "react";
import logo from "../assets/movies-sub.png";
import TextField from "@mui/material/TextField";
import { postData } from "../Utils/dbUtils";
import { useNavigate } from "react-router";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import useForm from "../hooks/useForm";
import { Link } from "react-router";
import CINEMA_SERVICE_URL from "../Config/config";

const Login = () => {
  let navigate = useNavigate();
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

  const LoginUser = async (e) => {
    try {
      e.preventDefault();
      setIsFormSubmitted(true);
      if (errors && Object.keys(errors).length > 0) {
        return;
      }
      let { data: token } = await postData(
        `${CINEMA_SERVICE_URL}/userDB/login`,
        values
      );
      localStorage.setItem("token", JSON.stringify(token));
      navigate("/");
      setErrors({ ...errors, Message: "" });
    } catch (error) {
      setErrors({
        ...errors,
        Message: error.response ? error.response.data.message : error.message,
      });
    }
  };

  return (
    <form onSubmit={(e) => LoginUser(e)}>
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
            <img src={logo} alt="Logo" height="100px" width="90%" />
            <Typography variant="h5" component="h2"></Typography>
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
              label="Password"
              variant="outlined"
              type="password"
              onChange={(e) => handleInputChange(e)}
              {...(isFormSubmitted &&
                errors.password && {
                  error: true,
                  helperText: errors.password,
                })}
            />
            <Button
              variant="contained"
              size="large"
              type="submit"
              sx={{
                width: "90%",
              }}
            >
              Login
            </Button>
            <Typography variant="body2" color="textSecondary" component="p">
              New User ? <Link to={`/register`}>Create Account</Link>
            </Typography>
            {errors.Message && <Alert severity="error">{errors.Message}</Alert>}
          </Box>
        </CardContent>
      </Card>
    </form>
  );
};

export default Login;
