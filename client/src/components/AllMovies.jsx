import { useEffect, useMemo, useState } from "react";
import logo from "../assets/movies-sub.png";
import TextField from "@mui/material/TextField";
import { deleteById, getAll } from "../Utils/dbUtilsForSubscriptionsService";
import { useNavigate } from "react-router";
import SearchIcon from "@mui/icons-material/Search";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  List,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

const AllMovies = () => {
  let navigate = useNavigate();
  const labelWidth = "120px";

  const [movies, setMovies] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  //const [filteredMovies, setFilteredMovies] = useState([]);

  const getAllMovies = async () => {
    try {
      const { data: movies } = await getAll(`/movies`);
      setMovies(movies);
      //   setFilteredMovies(movies);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("loading ...");
    getAllMovies();
  }, []);

  const filteredMovies = useMemo(
    () =>
      movies.filter((movie) => {
        console.log("filteredUsers");
        return movie.name.toLowerCase().includes(search.toLowerCase());
      }),
    [search, movies]
  );

  // useEffect(() => {
  //   const getFilteredMovies = () => {
  //     console.log("find...");
  //     const filteredMovies =
  //       search != ""
  //         ? movies.filter((movie) =>
  //             movie.name.toLowerCase().includes(search.toLowerCase())
  //           )
  //         : movies;
  //     setFilteredMovies(filteredMovies);
  //   };
  //   getFilteredMovies();
  // }, [search]);

  const handleDeleteUser = async (e, id) => {
    try {
      e.preventDefault();
      if (confirm("Are tou sure you want to delete the User ?")) {
        await deleteById(`/movies/${id}`);
        await deleteById(`/permissions/${id}`);
        await deleteById(`/userDB/${id}`);
        getAllMovies();
      }
      // setSuccessMessage("The User Deleted Successfully ");
    } catch (error) {
      // setErrorMessage(
      //   error.response ? error.response.data.message : error.message
      // );
    }
  };
  return (
    <>
      <Box
        sx={{ display: "flex", alignItems: "flex-end", mt: 2, ml: 1, gap: 2 }}
      >
        <TextField
          id="input-with-sx"
          placeholder="Search..."
          variant="outlined"
          size="small"
          value={searchText}
          slotProps={{
            input: {
              startAdornment: <SearchIcon position="start" color="action" />,
            },
          }}
          onChange={(e) => setSearchText(e.target.value)}
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
      {filteredMovies.map((movie) => (
        <Card
          variant="outlined"
          key={movie._id}
          sx={{ border: "2px solid black", mt: 2 }}
        >
          <CardHeader
            title={`${movie.name},${new Date(movie.premiered).getFullYear()}`}
          ></CardHeader>
          <CardContent>
            <Stack direction="row" spacing={2}>
              <Box>
                <Typography
                  variant="h5"
                  sx={{ fontSize: 15, width: labelWidth }}
                >
                  Genres:
                </Typography>
                <img height="100px" width="80px" src={movie.image} />
              </Box>

              <Box>
                <Typography
                  sx={{ color: "text.secondary", fontSize: 15, ml: 1 }}
                >
                  {movie.genres && movie.genres.join(" , ")}
                </Typography>
                <Box
                  sx={{
                    overflow: "scroll",
                    border: "2px solid black",
                    height: "100px",
                  }}
                >
                  <Typography
                    sx={{
                      color: "text.secondary",
                      fontSize: 15,
                      ml: 1,
                      position: "absolute",
                    }}
                  >
                    Subscriptions Watched
                  </Typography>
                  <ul>
                    <li>Coffee</li>
                    <li>Tea</li>
                    <li>Milk</li>
                    <li>Tea</li>
                    <li>Milk</li>
                    <li>Tea</li>
                    <li>Milk</li>
                  </ul>
                </Box>
              </Box>
            </Stack>
          </CardContent>
          <CardActions>
            <Box sx={{ display: "inline-block" }}>
              <Button
                variant="contained"
                size="large"
                type="submit"
                sx={{
                  width: "80px",
                  mr: 1,
                }}
                onClick={() =>
                  navigate(`/moviesmanagement/updatemoviedfsdfd/${user.id}`)
                }
              >
                Update
              </Button>
              <Button
                variant="contained"
                size="large"
                sx={{
                  width: "80px",
                }}
                onClick={(e) => handleDeleteUser(e, user.id)}
              >
                Delete
              </Button>
            </Box>
          </CardActions>
        </Card>
      ))}
    </>
  );
};

export default AllMovies;
