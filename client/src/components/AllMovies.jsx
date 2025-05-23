import { useEffect, useMemo, useState } from "react";
import { deleteById, getAll } from "../Utils/dbUtilsForSubscriptionsService";
import { useNavigate } from "react-router";
import { useOutletContext } from "react-router-dom";
import { getLoggedUserDetails } from "../Utils/dbUtilsForCinemaService";
import { Link } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from "@mui/material";

const AllMovies = () => {
  let navigate = useNavigate();

  const labelWidth = "120px";
  const [movies, setMovies] = useState([]);
  const [search] = useOutletContext();
  const [user, setUser] = useState({ permissions: [] });

  const getAllMovies = async () => {
    try {
      const { data: movies } = await getAll(
        `/subscriptions/getAllMoviesWithMembers`
      );
      setMovies(movies);
    } catch (error) {
      console.log(error);
    }
  };

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

  useEffect(() => {
    getAllMovies();
    getUser();
  }, []);

  const filteredMovies = useMemo(() => {
    if (!search || search === "") return movies;
    return movies.filter((movie) => {
      return movie.name.toLowerCase().includes(search.toLowerCase());
    });
  }, [search, movies]);

  const handleDeleteMovie = async (e, id) => {
    try {
      e.preventDefault();
      if (confirm("Are tou sure you want to delete the Movie ?")) {
        await deleteById(`/movies/${id}`);
        await deleteById(`subscriptions/removemoviefromsubscription/${id}`);

        getAllMovies();
      }
      setSuccessMessage("The User Deleted Successfully ");
    } catch (error) {
      setErrorMessage(
        error.response ? error.response.data.message : error.message
      );
    }
  };
  return (
    <>
      {filteredMovies &&
        filteredMovies.map((movie) => (
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
                      display: "flex",
                      border: "2px solid black",
                      minHeight: "100px",
                      minWidth: "200px",
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
                      Subscriptions Watched :
                    </Typography>
                    {movie.subscribedMembers.length === 0 ? (
                      <Typography
                        sx={{
                          mt: 5,
                          fontSize: 15,
                          fontWeight: "bold",
                          ml: 1,
                          position: "absolute",
                        }}
                      >
                        No Subscribed Members
                      </Typography>
                    ) : (
                      <ul>
                        {movie.subscribedMembers.map((member) => (
                          <li key={member.name}>
                            {" "}
                            <Link to={`/subscriptions/allmembers`}>
                              {" "}
                              {`${member.name} ,${new Date(
                                member.subscriptionDate
                              ).toLocaleDateString("en-GB")}`}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Box>
                </Box>
              </Stack>
            </CardContent>
            <CardActions>
              <Box sx={{ display: "inline-block" }}>
                {user.permissions.includes("Update Movies") && (
                  <Button
                    variant="contained"
                    size="large"
                    type="submit"
                    sx={{
                      width: "80px",
                      mr: 1,
                    }}
                    onClick={() => navigate(`/movies/updatemovie/${movie._id}`)}
                  >
                    Update
                  </Button>
                )}
                {user.permissions.includes("Delete Movies") && (
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      width: "80px",
                    }}
                    onClick={(e) => handleDeleteMovie(e, movie._id)}
                  >
                    Delete
                  </Button>
                )}
              </Box>
            </CardActions>
          </Card>
        ))}
    </>
  );
};

export default AllMovies;
