import { useEffect, useState } from "react";
import ButtonsMenu from "./ButtonsMenu";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import { getAll } from "../Utils/dbUtils";

const MainPage = () => {
  const Menuitems = [
    { title: "Movies", navigate: "" },
    { title: "Subscriptions", navigate: "" },
    { title: "Users Management", navigate: `/usersmanagement/allusers` },
    { title: "LogOut", navigate: "logout" },
  ];
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await getAll(`/userDB/getUserInfo`);
        setUserName(data?.user?.userName);
      } catch (error) {
        console.error(error);
      }
    };
    getUser();
  }, []);

  return (
    <>
      <Box>
        <AppBar position="static">
          <Toolbar sx={{ display: "block" }}>
            <Box
              sx={{
                float: "right",
                mt: 2,
              }}
            >
              <Typography variant="subtitle2">{`Hi ${userName}`}</Typography>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      <Typography variant="h4">Movie - Subscriptions Web Site</Typography>
      <Box sx={{ mt: 3 }}>
        <ButtonsMenu items={Menuitems}> </ButtonsMenu>
      </Box>
      <Box sx={{ border: "2px solid black", mt: 3 }}>
        <Outlet />
      </Box>
    </>
  );
};

export default MainPage;
