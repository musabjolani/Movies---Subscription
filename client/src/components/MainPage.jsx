import * as React from "react";
import ButtonsMenu from "./ButtonsMenu";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";

const MainPage = () => {
  const Menuitems = ["Movies", "Subscriptions", "Users Management", "LogOut"];
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
              <Typography variant="subtitle2">Hi , Musab</Typography>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      <Typography variant="h4">Movie - Subscriptions Web Site</Typography>
      <Box sx={{ mt: 3 }}>
        <ButtonsMenu items={Menuitems}></ButtonsMenu>
      </Box>
      <Box sx={{ border: "2px solid black", mt: 3 }}>
        <Outlet />
      </Box>
    </>
  );
};

export default MainPage;
