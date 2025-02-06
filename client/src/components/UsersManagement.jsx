import { Box } from "@mui/material";
import ButtonsMenu from "./ButtonsMenu";
import { Outlet } from "react-router-dom";
import useForm from "../hooks/useForm";

const UsersManagement = () => {
  const Menuitems = ["All Users", "Add Users"];

  return (
    <>
      <Box sx={{ mt: 3 }}>
        <ButtonsMenu items={Menuitems}></ButtonsMenu>
      </Box>
      <Box sx={{ border: "2px solid black", mt: 3 }}>
        <Outlet />
      </Box>
    </>
  );
};

export default UsersManagement;
