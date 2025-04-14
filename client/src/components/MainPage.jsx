import { useEffect, useState } from "react";
import ButtonsMenu from "./ButtonsMenu";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import { getAll, getLoggedUserDetails } from "../Utils/dbUtilsForCinemaService";
import Header from "./Header";

const MainPage = () => {
  const initialMenuItems = [
    { title: "Movies", navigate: "/movies/allmovies" },
    { title: "Subscriptions", navigate: "/subscriptions/allmembers" },
    { title: "Users Management", navigate: "/usersmanagement/allusers" },
    { title: "LogOut", navigate: "/logout" },
  ];

  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [user, setUser] = useState({ user: null });

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: loggedUser } = await getAll(
          "userDB/getLoggedUserDetails"
        );

        if (!loggedUser) {
          console.error("User data not found");
          return;
        }
        setUser(loggedUser);
      } catch (error) {
        console.error("Error fetching user details:", error);
        // throw error;
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    setMenuItems(initialMenuItems);
    if (!user?.isAdmin) {
      setMenuItems((prevMenu) =>
        prevMenu.filter((item) => item.title !== "Users Management")
      );
    }
  }, [user]);

  return (
    <>
      <Box>
        <Header user={user}></Header>
      </Box>
      <Box sx={{ mt: 3 }}>
        <ButtonsMenu items={menuItems}> </ButtonsMenu>
      </Box>
      <Box sx={{ border: "2px solid black", mt: 3 }}>
        <Outlet />
      </Box>
    </>
  );
};

export default MainPage;
