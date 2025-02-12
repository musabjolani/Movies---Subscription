import { useState } from "react";
import logo from "../assets/movies-sub.png";
import TextField from "@mui/material/TextField";
import { postData } from "../Utils/dbUtils";
import { useNavigate } from "react-router";
import useForm from "../hooks/useForm";
import { Link } from "react-router";
import { useDispatch } from "react-redux";
import { setToken } from "../redux/authSlice";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

const Login = () => {
  let navigate = useNavigate();
  const dispatch = useDispatch();

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

  const [errorMessage, setErrorMessage] = useState("");

  const LoginUser = async (e) => {
    try {
      e.preventDefault();
      setIsFormSubmitted(true);
      setErrorMessage("");
      if (errors && Object.keys(errors).length > 0) {
        return;
      }
      const result = await postData(`/userDB/login`, values);
      console.log(result);
      if (result) {
        dispatch(setToken(result.data));
        setErrorMessage("");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      setErrorMessage(
        error.response ? error.response.data.message : error.message
      );
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
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          </Box>
        </CardContent>
      </Card>
    </form>
  );
};

export default Login;
