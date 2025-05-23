import { Box, Button, TextField } from "@mui/material";
import ButtonsMenu from "./ButtonsMenu";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { getLoggedUserDetails } from "../Utils/dbUtilsForCinemaService";
import { useSearchParams } from "react-router-dom";

const Movies = () => {
  const [search, setSearch] = useState("");
  const [searchText, setSearchText] = useState("");
  const [user, setUser] = useState({ permissions: [] });
  const [searchParams, setSearchParams] = useSearchParams();

  const initialMenuItems = [
    { title: "All Movies", navigate: "allmovies" },
    { title: "Add Movie", navigate: "addmovie" },
  ];
  const [menuItems, setMenuItems] = useState(initialMenuItems);

  const location = useLocation();
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
    if (searchParams.get("movieName")) {
      setSearchText(searchParams.get("movieName"));
      setSearch(searchParams.get("movieName"));
    }
  }, []);

  useEffect(() => {
    setMenuItems(initialMenuItems);

    if (!user?.permissions.includes("View Movies"))
      setMenuItems((prevMenu) =>
        prevMenu.filter((item) => item.title !== "All Movies")
      );
    if (!user?.permissions.includes("Create Movies"))
      setMenuItems((prevMenu) =>
        prevMenu.filter((item) => item.title !== "Add Movie")
      );
  }, [user]);

  // Check if current route is `/movies/allmovies`

  const findButtonRef = useRef(null);

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
    //setSearch(e.target.value);
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
          <ButtonsMenu items={menuItems}></ButtonsMenu>
        </Box>
        {location.pathname.startsWith("/movies/allmovies") && (
          <Box sx={{ display: "flex", alignItems: "flex-end", mr: 1, gap: 2 }}>
            <TextField
              id="input-with-sx"
              placeholder="Search..."
              variant="outlined"
              size="small"
              value={searchText}
              //value={search}
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
