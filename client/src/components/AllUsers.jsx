import { useEffect, useState } from "react";
import logo from "../assets/movies-sub.png";
import TextField from "@mui/material/TextField";
import { deleteById, getAll } from "../Utils/dbUtilsForCinemaService";
import { useNavigate } from "react-router";
import useForm from "../hooks/useForm";
import { Link } from "react-router";

import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { baseURL } from "../Utils/variables";

const AllUsers = () => {
  let navigate = useNavigate();
  const labelWidth = "120px";

  const [users, setUsers] = useState([]);

  const getAllUsers = async () => {
    try {
      let indx = 0;
      let userArr = [];
      const { data: users } = await getAll(`/users`);
      setUsers(users);
      const { data: userPermissions } = await getAll(`/permissions`);

      userArr = [...users];

      userPermissions.map((userPerm) => {
        indx = userArr.findIndex((user) => {
          if (userPerm.id === user.id) return true;
        });
        if (indx != -1) userArr[indx].permissions = userPerm.permissions;
      });

      setUsers(userArr);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleDeleteUser = async (e, id) => {
    try {
      e.preventDefault();
      if (confirm("Are tou sure you want to delete the User ?")) {
        await deleteById(`/users/${id}`);
        await deleteById(`/permissions/${id}`);
        await deleteById(`/userDB/${id}`);
        getAllUsers();
      }
      // setSuccessMessage("The User Deleted Successfully ");
    } catch (error) {
      // setErrorMessage(
      //   error.response ? error.response.data.message : error.message
      // );
    }
  };
  return (
    <>
      {users.map((user) => (
        <Card variant="outlined" key={user.id}>
          <CardContent>
            <Box sx={{ display: "inline-flex", my: 1 }}>
              <Typography variant="h5" sx={{ fontSize: 15, width: labelWidth }}>
                First Name:
              </Typography>
              <Typography sx={{ color: "text.secondary", fontSize: 15, ml: 1 }}>
                {user.firstName}
              </Typography>
            </Box>
            <br />
            <Box sx={{ display: "inline-flex", my: 1 }}>
              <Typography variant="h5" sx={{ fontSize: 15, width: labelWidth }}>
                Last Name:
              </Typography>
              <Typography sx={{ color: "text.secondary", fontSize: 15, ml: 1 }}>
                {user.lastName}
              </Typography>
            </Box>
            <br />
            <Box sx={{ display: "inline-flex", my: 1 }}>
              <Typography variant="h5" sx={{ fontSize: 15, width: labelWidth }}>
                Created Date:
              </Typography>
              <Typography sx={{ color: "text.secondary", fontSize: 15, ml: 1 }}>
                {user.createdDate}
              </Typography>
            </Box>
            <br />
            <Box sx={{ display: "inline-flex", my: 1 }}>
              <Typography variant="h5" sx={{ fontSize: 15, width: labelWidth }}>
                Session TimeOut:
              </Typography>
              <Typography sx={{ color: "text.secondary", fontSize: 15, ml: 1 }}>
                {user.sessionTimeOut}
              </Typography>
            </Box>
            <br />
            <Box sx={{ display: "inline-flex", my: 1 }}>
              <Typography variant="h5" sx={{ fontSize: 15, width: labelWidth }}>
                Permissions:
              </Typography>
              <Typography sx={{ color: "text.secondary", fontSize: 15, ml: 1 }}>
                {user.permissions && user.permissions.join(" , ")}
              </Typography>
            </Box>
          </CardContent>
          <CardActions>
            <Box sx={{ display: "inline-block" }}>
              <Button
                variant="contained"
                size="large"
                type="submit"
                sx={{
                  width: "80px",
                  mr: 1,
                }}
                onClick={() =>
                  navigate(`/usersmanagement/updateuser/${user.id}`)
                }
              >
                Update
              </Button>
              <Button
                variant="contained"
                size="large"
                sx={{
                  width: "80px",
                }}
                onClick={(e) => handleDeleteUser(e, user.id)}
              >
                Delete
              </Button>
            </Box>
          </CardActions>
        </Card>
      ))}
    </>
  );
};

export default AllUsers;
