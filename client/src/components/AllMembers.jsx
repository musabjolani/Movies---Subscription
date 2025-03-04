import { useEffect, useState } from "react";
import {
  deleteById,
  getAll,
  postData,
} from "../Utils/dbUtilsForSubscriptionsService";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import useForm from "../hooks/useForm";
import { localStringToDate } from "../Utils/utilities";

const AllMembers = () => {
  let navigate = useNavigate();
  const {
    handleInputChange,
    values,
    setValues,
    setErrors,
    errors,
    isFormSubmitted,
    setIsFormSubmitted,
    resetForm,
  } = useForm(
    { movieId: "", date: new Date().toLocaleDateString("en-GB") },
    "addMovieToSubscriptionsSchema"
  );

  const labelWidth = "120px";

  const [members, setMembers] = useState([]);
  const [memberIdToAdd, setMemberIdToAdd] = useState(-1);
  const [selectedMovieName, setSelectedMovieName] = useState("");
  const [movies, setMovies] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  //React API

  const getAllMembers = async () => {
    try {
      const { data: members } = await getAll(
        `/subscriptions/getAllMembersWithMovies`
      );

      setMembers(members);
    } catch (error) {
      console.log(error);
    }
  };
  // const getAllMembers = async () => {
  //   try {
  //     // let allMembersWithSubscribedMovies = [];

  //     // ✅ Fetch all members
  //     const { data: members } = await getAll(`/members`);

  //     // ✅ Fetch movies for all members in parallel using Promise.all
  //     const membersWithMovies = await Promise.all(
  //       members.map(async (member) => {
  //         const { data: movies } = await getAll(
  //           `/subscriptions/movies/${member._id}`
  //         );
  //         if (movies)
  //           return {
  //             ...member,
  //             movies: movies.movies,
  //           };
  //         // ✅ Return member with movies
  //         else return { ...member, movies: [] };
  //       })
  //     );

  //     // ✅ Update state after all API calls are completed
  //     setMembers(membersWithMovies);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const getAllMovies = async (memberId) => {
    try {
      setMemberIdToAdd(memberId);
      if (movies && movies.length > 0) return; // if movies already fetched, return
      const { data: moviesData } = await getAll(`/movies`);
      setMovies(moviesData);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllMembers();
  }, []);

  const handleAddMovieToSubscription = async (memberId) => {
    try {
      //if (memberIdToAdd != memberId) return;
      setIsFormSubmitted(true);
      setErrorMessage("");
      if (errors && Object.keys(errors).length > 0) {
        setErrorMessage("Check your error Please");
        return;
      }

      const { data: movieAdded } = await postData(
        `/subscriptions/addmovietosubscription`,
        {
          memberId: memberId,
          movie: {
            movieId: values.movieId,
            date: localStringToDate(values.date),
          },
        }
      );

      let indx = members.findIndex((member) => member._id === memberId);

      if (indx !== -1) {
        // Ensure the member is found
        let membersWithAddedMovie = [...members];

        // Create a new movies array to avoid direct mutation
        let updatedMovies = [
          ...membersWithAddedMovie[indx].movies,
          {
            name: selectedMovieName || "Unknown Movie", // Fallback in case of undefined
            premiered: localStringToDate(values.date),
          },
        ];

        // Update the member object
        membersWithAddedMovie[indx] = {
          ...membersWithAddedMovie[indx],
          movies: updatedMovies,
        };

        setMembers(membersWithAddedMovie);
      }
    } catch (error) {
      setErrorMessage(
        error.response ? error.response.data.message : error.message
      );
    }
  };

  const handleDeleteMovie = async (e, id) => {
    try {
      e.preventDefault();
      if (confirm("Are tou sure you want to delete the Movie ?")) {
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
      {members &&
        members.map((member) => (
          <Box key={member._id} sx={{ border: "2px solid black", mt: 2 }}>
            <Box sx={{ ml: 1 }}>
              <Typography variant="h4" sx={{ fontSize: 22, mt: 1, mb: 1 }}>
                {" "}
                {member.name}
              </Typography>
              <Box sx={{ display: "inline-flex", my: 1 }}>
                <Typography
                  variant="h5"
                  sx={{ fontSize: 15, width: labelWidth }}
                >
                  Email:
                </Typography>
                <Typography
                  sx={{ color: "text.secondary", fontSize: 15, ml: 1 }}
                >
                  {member.email}
                </Typography>
              </Box>
              <br />
              <Box sx={{ display: "inline-flex", my: 1 }}>
                <Typography
                  variant="h5"
                  sx={{ fontSize: 15, width: labelWidth }}
                >
                  City:
                </Typography>
                <Typography
                  sx={{ color: "text.secondary", fontSize: 15, ml: 1 }}
                >
                  {member.city}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "inline-block", ml: 1 }}>
              <Button
                variant="contained"
                size="large"
                type="submit"
                sx={{
                  width: "80px",
                  mr: 1,
                }}
                onClick={() =>
                  navigate(`/subscriptions/updatemember/${member._id}`)
                }
              >
                Edit
              </Button>
              <Button
                variant="contained"
                size="large"
                sx={{
                  width: "80px",
                }}
                onClick={(e) => handleDeleteMovie(e, user.id)}
              >
                Delete
              </Button>
            </Box>
            <Box
              key={member._id}
              sx={{ border: "2px solid black", mt: 2, ml: 1, width: "85%" }}
            >
              <Typography
                variant="h4"
                sx={{ fontSize: 17, fontWeight: "bold", mt: 1, mb: 1, ml: 1 }}
              >
                Movies Watched
              </Typography>

              <Box sx={{ ml: 1, mt: 1 }}>
                <Button
                  variant="contained"
                  size="medium"
                  color="secondary"
                  onClick={() => {
                    getAllMovies(member._id);
                  }}
                >
                  Subscripe to a new Movie
                </Button>
              </Box>
              {memberIdToAdd === member._id && (
                <Box
                  sx={{ border: "2px solid red", mt: 2, ml: 1, width: "90%" }}
                >
                  <Typography variant="h4" sx={{ fontSize: 14, mt: 1, ml: 1 }}>
                    Add a New Movie
                  </Typography>
                  <br />

                  <Box sx={{ display: "inline-flex", mb: 1, ml: 1 }}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Movies
                      </InputLabel>
                      <Select
                        sx={{ width: "300px" }}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="movieId"
                        label="Movies"
                        size="small"
                        value={movies.length > 0 ? movies[0]._id : ""}
                        onChange={(e) => {
                          setSelectedMovieName(
                            movies.find((movie) => movie._id === e.target.value)
                              .name
                          );
                          handleInputChange(e);
                        }}
                      >
                        {movies &&
                          movies.map((movie) => (
                            <MenuItem key={movie._id} value={movie._id}>
                              {movie.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>

                    <TextField
                      sx={{ width: "150px", ml: -2 }}
                      name="date"
                      label="date"
                      value={values.date}
                      variant="outlined"
                      size="small"
                      placeholder="DD/MM/YYYY"
                      onChange={(e) => handleInputChange(e)}
                      {...(isFormSubmitted &&
                        errors.date && {
                          error: true,
                          helperText: errors.date,
                        })}
                    />
                  </Box>
                  <Box sx={{ ml: 1, mb: 1 }}>
                    <Button
                      variant="contained"
                      size="medium"
                      onClick={() => {
                        handleAddMovieToSubscription(member._id);
                      }}
                    >
                      Subscripe
                    </Button>
                  </Box>
                  {errorMessage && errorMessage != "" && (
                    <Alert severity="error">{errorMessage}</Alert>
                  )}
                </Box>
              )}
              <ul key={member._id}>
                {member.movies &&
                  member.movies.map((movie) => (
                    <li key={movie._id}>
                      <Link to={`/movies/allmovies`}>
                        {" "}
                        {`${movie.name},${new Date(
                          movie.premiered
                        ).toLocaleDateString("en-GB")}`}
                      </Link>
                    </li>
                  ))}
              </ul>
              <br />
            </Box>
          </Box>
        ))}
    </>
  );
};

export default AllMembers;
