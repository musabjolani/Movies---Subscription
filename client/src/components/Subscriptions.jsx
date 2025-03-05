import { Box, Button, TextField } from "@mui/material";
import ButtonsMenu from "./ButtonsMenu";
import { Outlet, useLocation } from "react-router-dom";
import { useRef, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

const Subscriptions = () => {
  const [search, setSearch] = useState("");
  const [searchText, setSearchText] = useState("");
  const Menuitems = [
    { title: "All Members", navigate: "allmembers" },
    { title: "Add Members", navigate: "addmembers" },
  ];
  const location = useLocation();

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
          <ButtonsMenu items={Menuitems}></ButtonsMenu>
        </Box>
      </Box>
      <Box sx={{ border: "2px solid black", mt: 3 }}>
        <Outlet />
      </Box>
    </>
  );
};

export default Subscriptions;
