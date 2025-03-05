import { Box, Button, TextField } from "@mui/material";
import ButtonsMenu from "./ButtonsMenu";
import { Outlet, useLocation } from "react-router-dom";
import { useRef, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

const Movies = () => {
  const [search, setSearch] = useState("");
  const [searchText, setSearchText] = useState("");
  const Menuitems = [
    { title: "All Movies", navigate: "allmovies" },
    { title: "Add Movie", navigate: "addmovie" },
  ];
  const location = useLocation();

  // Check if current route is `/movies/allmovies`
  const showSearch = location.pathname === "/movies/allmovies";
  const findButtonRef = useRef(null);

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
    if (findButtonRef.current) {
      findButtonRef.current.focus(); //  Focus on the "Find" button
    }
  };

  //  Handle Key Press (Enter Key)
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setSearch(searchText);
    }
  };

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
        {showSearch && (
          <Box sx={{ display: "flex", alignItems: "flex-end", mr: 1, gap: 2 }}>
            <TextField
              id="input-with-sx"
              placeholder="Search..."
              variant="outlined"
              size="small"
              value={searchText}
              slotProps={{
                input: {
                  startAdornment: (
                    <SearchIcon position="start" color="action" />
                  ),
                },
              }}
              onChange={handleInputChange} //  Update text and focus button
              onKeyDown={handleKeyPress} //  Handle Enter key press
            />
            <Button
              variant="contained"
              type="button"
              sx={{ height: "35px" }}
              onClick={() => setSearch(searchText)}
            >
              Find
            </Button>
          </Box>
        )}
      </Box>
      <Box sx={{ border: "2px solid black", mt: 3 }}>
        <Outlet context={[search]} />
      </Box>
    </>
  );
};

export default Movies;
