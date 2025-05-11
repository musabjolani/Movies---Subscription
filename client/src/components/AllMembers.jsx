import { useEffect, useState } from "react";
import {
  getAll,
  deleteById,
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
import { getLoggedUserDetails } from "../Utils/dbUtilsForCinemaService";
//import { getAll as getLoggedUserDetails } from "../Utils/dbUtilsForCinemaService";

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
  const [user, setUser] = useState({ permissions: [] });
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
  const getUser = async () => {
    try {
      const { data: loggedUser } = await getLoggedUserDetails(
        "userDB/getLoggedUserDetails"
      );
      if (!loggedUser) {
        return;
      }
      setUser(loggedUser);
    } catch (error) {
      console.error("Error fetching user details:  In All Members", error);
    }
  };

  const getUnsubscribedMovies = async (memberId) => {
    try {
      resetForm();
      setMemberIdToAdd(memberId);
      if (movies && movies.length > 0) return; // if movies already fetched, return
      const { data: moviesData } = await getAll(
        `subscriptions/getUnsubscribedMovies/${memberId}`
      );
      setMovies(moviesData);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllMembers();
    getUser();
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

      const { data: subscriptionId } = await postData(
        `/subscriptions/addmovietosubscription`,
        {
          memberId: memberId,
          movie: {
            movieId: values.movieId,
            date: localStringToDate(values.date),
          },
        }
      );

      let indx = members.findIndex((member) => member.memberId === memberId);
      // Ensure the member is found
      if (indx !== -1) {
        let membersWithAddedMovie = [
          ...members,
          { subscriptionId: subscriptionId },
        ];

        // Create a new movies array to avoid direct mutation
        let updatedMovies = [
          ...membersWithAddedMovie[indx].movies,
          {
            _id: values.movieId,
            name: selectedMovieName || "Unknown Movie", // Fallback in case of undefined
            premiered: localStringToDate(values.date),
          },
        ];

        console.log("Updated Movies:", updatedMovies);

        // Update the member object
        membersWithAddedMovie[indx] = {
          ...membersWithAddedMovie[indx],
          movies: updatedMovies,
        };
        console.log("Updated Members:", membersWithAddedMovie);
        setMembers(membersWithAddedMovie);
      }
    } catch (error) {
      setErrorMessage(
        error.response ? error.response.data.message : error.message
      );
    }
  };

  const handleDeleteMember = async (e, id) => {
    try {
      e.preventDefault();

      if (
        confirm(
          "Are tou sure you want to delete the Member from Subscriptions”?"
        )
      ) {
        if (id === undefined) return;
        await deleteById(`/subscriptions/${id}`);
        // setMembers(members.filter((member) => member.subscriptionId !== id));
        await getAllMembers();
      }
    } catch (error) {
      setErrorMessage(
        error.response ? error.response.data.message : error.message
      );
    }
  };
  return (
    <>
      {members &&
        members.map((member) => (
          <Box key={member.memberId} sx={{ border: "2px solid black", mt: 2 }}>
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
              {user.permissions.includes("Update Subscriptions") && (
                <Button
                  variant="contained"
                  size="large"
                  type="submit"
                  sx={{
                    width: "80px",
                    mr: 1,
                  }}
                  onClick={() =>
                    navigate(`/subscriptions/updatemember/${member.memberId}`)
                  }
                >
                  Edit
                </Button>
              )}
              {user.permissions.includes("Delete Subscriptions") && (
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    width: "80px",
                  }}
                  onClick={(e) => handleDeleteMember(e, member.subscriptionId)}
                >
                  Delete
                </Button>
              )}
            </Box>
            <Box
              key={member.memberId}
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
                    getUnsubscribedMovies(member.memberId);
                  }}
                >
                  Subscripe to a new Movie
                </Button>
              </Box>
              {memberIdToAdd === member.memberId && (
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
                        value={
                          values.movieId != ""
                            ? values.movieId
                            : movies[0]
                            ? movies[0]._id
                            : ""
                        }
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
                        handleAddMovieToSubscription(member.memberId);
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
              <ul key={member.memberId}>
                {member.movies &&
                  member.movies.map((movie) => (
                    <li key={movie._id}>
                      <Link to={`/movies/allmovies/?movieName=${movie.name}`}>
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
