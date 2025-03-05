import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import ButtonsMenu from "./ButtonsMenu";
const Header = ({ user }) => {
  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ display: "block" }}>
          <Box
            sx={{
              float: "right",
              mt: 2,
            }}
          >
            <Typography variant="subtitle2">
              {`Hi, ${user?.user?.firstName || "Guest"}  ${
                user?.user?.lastName
              } `}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Typography variant="h4">Movie - Subscriptions Web Site</Typography>
    </>
  );
};
export default Header;
