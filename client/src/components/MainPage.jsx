import { useEffect, useState } from "react";
import ButtonsMenu from "./ButtonsMenu";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import { getAll, getUserDetails } from "../Utils/dbUtilsForCinemaService";

const MainPage = () => {
  const [Menuitems, setMenuitems] = useState([
    { title: "Movies", navigate: "/movies" },
    { title: "Subscriptions", navigate: "" },
    { title: "Users Management", navigate: `/usersmanagement/allusers` },
    { title: "LogOut", navigate: "logout" },
  ]);
  const [user, setUser] = useState("");

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await getUserDetails();

        if (!data?.user) {
          console.error("User data not found");
          return;
        }

        setUser(data.user);

        if (!data.user.isAdmin) {
          setMenuitems((prevMenu) =>
            prevMenu.filter((item) => item.title !== "Users Management")
          );
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
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
              <Typography variant="subtitle2">{`Hi ${user?.userName}`}</Typography>
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
