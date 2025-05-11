import { Box, Button, TextField } from "@mui/material";
import ButtonsMenu from "./ButtonsMenu";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { getLoggedUserDetails } from "../Utils/dbUtilsForCinemaService";

const Subscriptions = () => {
  const initialMenuItems = [
    { title: "All Members", navigate: "allmembers" },
    { title: "Add Members", navigate: "addmember" },
  ];

  const [user, setUser] = useState({ permissions: [] });
  const [menuItems, setMenuItems] = useState(initialMenuItems);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: loggedUser } = await getLoggedUserDetails();
        if (!loggedUser) {
          console.error("User data not found  In Movies");
          return;
        }
        setUser(loggedUser);
      } catch (error) {
        console.error("Error fetching user details:  In Movies", error);
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    setMenuItems(initialMenuItems);

    if (!user?.permissions.includes("View Subscriptions"))
      setMenuItems((prevMenu) =>
        prevMenu.filter((item) => item.title !== "All Members")
      );
    if (!user?.permissions.includes("Create Subscriptions"))
      setMenuItems((prevMenu) =>
        prevMenu.filter((item) => item.title !== "Add Members")
      );
  }, [user]);

  return (
    <>
      <Box
        sx={{
          mt: 3,
          width: "600px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <ButtonsMenu items={menuItems}></ButtonsMenu>
        </Box>
      </Box>
      <Box sx={{ border: "2px solid black", mt: 3 }}>
        <Outlet />
      </Box>
    </>
  );
};

export default Subscriptions;
