import { Box } from "@mui/material";
import ButtonsMenu from "./ButtonsMenu";
import { Outlet } from "react-router-dom";

const Movies = () => {
  const Menuitems = [
    { title: "All Movies", navigate: "allmovies" },
    { title: "Add Movie", navigate: "addmovie" },
  ];

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

export default Movies;
